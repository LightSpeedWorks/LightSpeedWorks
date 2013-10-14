// http-proxy-server-ninja

'use strict';

// Application name. {アプリケーション名}
var APP_NAME = 'LightSpeedWorks';

//######################################################################
// clog - console log. {コンソールログ}
function clog() {
  var util = require('util');
  console.log(tm() + util.format.apply(util, arguments));
  function tm() {
    return new Date(new Date() - 0 + 9000 * 3600).toISOString().replace(/T|Z/g, ' ')
  }
}

//######################################################################
// CONFIG - config file. {設定ファイル}
if (typeof CONFIG === 'undefined') {
  // CONFIG - config file.
  global.CONFIG = {};
  try {
    CONFIG = require('../' + APP_NAME + '.json');
  } catch (e) {
    clog(e);
  }
}

//######################################################################
// cluster fork. {クラスタ分割対応}
var cluster = require('cluster');
var numWorkers = 1; //require('os').cpus().length;
if (numWorkers > 1 && cluster.isMaster) {
  // master
  clog('proxy master: numWorkers: ' + numWorkers);
  for (var i = 0; i < numWorkers; i++)
    cluster.fork();
  cluster.on('death', function onDeath(worker) {
    clog('proxy worker ' + worker.pid + ' died');
  });
  return;
}
clog('proxy worker ' + process.pid + ' started');

//######################################################################
var HTTP_PORT = CONFIG.proxy_port || 8080;

var http = require('http');
var url  = require('url');
var net  = require('net');

function printError(err, msg, url) {
  clog('%s: %s %s', msg, err, url);
}

//######################################################################
var connCount = 0;

var server = http.createServer(function onCliReq(cliReq, cliRes) {
  var x = url.parse(cliReq.url);
  //clog('http  : (%d) %s%s', connCount,
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
  //clog('https : (%d) %s%s', connCount, cliReq.url);
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
  clog('http proxy server started on port ' + HTTP_PORT);
});

var whiteAddressList = [];
whiteAddressList['127.0.0.1'] = true;
whiteAddressList['192.168.251.1'] = true;
whiteAddressList['59.157.207.17'] = true;
whiteAddressList['210.170.211.28'] = true;
server.on('connection', function onConn(cliSoc) {
  if (cliSoc.remoteAddress in whiteAddressList) return;
  clog('reject: ', cliSoc.remoteAddress);
  cliSoc.destroy();
});

/*
server.on('connection', function onConn(cliSoc) {
  var connTime = new Date();
  clog('++conn: (%d) from: %s', (++connCount),
      cliSoc.remoteAddress);
  cliSoc.on('close', function onDisconn() {
    clog('--conn: (%d) time: %s sec', (--connCount),
        (new Date() - connTime) / 1000.0);
  });
});
*/
