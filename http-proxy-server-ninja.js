(function () { 'use strict';

var http = require('http');
var url  = require('url');
var net  = require('net');

var HTTP_PORT = 8080;

var log = console.log.bind(console);
var connCount = 0;

function tm() { return new Date().toLocaleTimeString(); }

function printError(err, msg, url) {
  log('%s %s: %s %s', tm(), msg, err, url);
}

var cluster = require('cluster');
var numWorkers = 1; //require('os').cpus().length;
if (numWorkers > 1 && cluster.isMaster) {
  // master
  log(tm() + ' numWorkers: ' + numWorkers);
  for (var i = 0; i < numWorkers; i++)
    cluster.fork();
  cluster.on('death', function onDeath(worker) {
    log(tm() + ' worker ' + worker.pid + ' died');
  });
  return;
}

var server = http.createServer(function onCliReq(cliReq, cliRes) {
  var x = url.parse(cliReq.url);
  //log('%s http  : (%d) %s%s', tm(), connCount,
  //    x.hostname + ':' + (x.port || 80));
  var options = {host: x.hostname, port: x.port || 80, path: x.path,
                 method: cliReq.method, headers: cliReq.headers};
  var svrReq = http.request(options, function onSvrRes(svrRes) {
    cliRes.writeHead(svrRes.statusCode, svrRes.headers);
    svrRes.pipe(cliRes);
  });
  cliReq.pipe(svrReq);
  svrReq.on('error', function onSvrReqErr(err) {
    cliRes.writeHead(400, err.message, {'content-type': 'text/html'});
    cliRes.end('<h1>' + err.message + '<br/>' + cliReq.url + '</h1>');
    printError(err, 'svrReq', x.hostname + ':' + (x.port || 80));
  });
});

server.on('clientError', function onCliErr(err, cliSoc) {
  cliSoc.end();
  printError(err, 'cliErr', '');
});

server.on('connect', function onCliConn(cliReq, cliSoc, cliHead) {
  var x = url.parse('https://' + cliReq.url);
  //log('%s https : (%d) %s%s', tm(), connCount, cliReq.url);
  var svrSoc = net.connect(x.port || 443, x.hostname, function onSvrConn() {
    cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
    if (cliHead && cliHead.length) svrSoc.write(cliHead);
    cliSoc.pipe(svrSoc);
  });
  svrSoc.pipe(cliSoc);
  svrSoc.on('error', funcOnSocErr(cliSoc, 'svrSoc', cliReq.url));
  cliSoc.on('error', funcOnSocErr(svrSoc, 'cliSoc', cliReq.url));
  function funcOnSocErr(soc, msg, url) {
    return function onSocErr(err) {
      soc.end();
      printError(err, msg, url);
    };
  }
});

server.listen(HTTP_PORT, function () {
  log('http proxy server started on port ' + HTTP_PORT);
});

var whiteAddressList = [];
whiteAddressList['127.0.0.1'] = true;
whiteAddressList['192.168.251.1'] = true;
whiteAddressList['59.157.207.17'] = true;
server.on('connection', function onConn(cliSoc) {
  if (cliSoc.remoteAddress in whiteAddressList) return;
  log('%s reject: ', tm(), cliSoc.remoteAddress);
  cliSoc.destroy();
});

/*
server.on('connection', function onConn(cliSoc) {
  var connTime = new Date();
  log('%s ++conn: (%d) from: %s', tm(), (++connCount),
      cliSoc.remoteAddress);
  cliSoc.on('close', function onDisconn() {
    log('%s --conn: (%d) time: %s sec', tm(), (--connCount),
        (new Date() - connTime) / 1000.0);
  });
});
*/

})();
