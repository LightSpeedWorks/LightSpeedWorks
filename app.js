// LightSpeedWorks main app.js

'use strict';

//######################################################################
// global Application name. {アプリケーション名}
var APP_NAME = 'LightSpeedWorks';
var APP_TITLE = '光速工房 LightSpeedWorks';
global.APP_NAME = APP_NAME;
global.APP_TITLE = APP_TITLE;

//######################################################################
// global clog - console log. {コンソールログ}
function clog() {
  var util = require('util');
  console.log(tm() + util.format.apply(util, arguments));
  function tm() {
    return new Date(new Date() - 0 + 9000 * 3600).toISOString().replace(/T|Z/g, ' ')
  }
}
global.clog = clog;

//######################################################################
// global CONFIG - config file. {設定ファイル}
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
  clog('master numWorkers:' + numWorkers + ' (app)');
  for (var i = 0; i < numWorkers; i++)
    cluster.fork();
  cluster.on('death', function onDeath(worker) {
    clog('worker pid:' + worker.pid + ' died (app)');
  });
  return;
}
clog('worker pid:' + process.pid + ' started (app)');

//######################################################################
var express = require('express'); 
var app = express(); 

var testApp =   require('./test-app/app.js').app;
var localApp =  require('./local-app/app.js').app;
var lightApp =  require('./light-app/app.js').app;
var goobooApp = require('./gooboo-app/app.js').app;

app.set('port', CONFIG.port || process.env.PORT || 3000);

app.use(express.vhost('localhost', localApp));

app.use(express.vhost('test.lightspeedworks.dev', testApp));
app.use(express.vhost('test.lightspeedworks.com', testApp));

app.use(express.vhost('www.lightspeedworks.dev', lightApp));
app.use(express.vhost('www.lightspeedworks.com', lightApp));
app.use(express.vhost('lightspeedworks.dev',     lightApp));
app.use(express.vhost('lightspeedworks.com',     lightApp));

app.use(express.vhost('www.goo-boo.dev', goobooApp));
app.use(express.vhost('goo-boo.dev',     goobooApp));
app.use(express.vhost('www.goo-boo.com', goobooApp));
app.use(express.vhost('goo-boo.com',     goobooApp));

app.listen(app.get('port'), function () {
  clog('Server started on port ' + app.get('port') + ' (' + APP_NAME + ' Express)');
});

require('./proxy-app/proxy');
