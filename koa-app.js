// LightSpeedWorks main app.js

'use strict';

console.log(['node', process.version, process.arch, process.platform, __filename].join(' '));

//######################################################################
// global Application name. {アプリケーション名}
var APP_NAME  = global.APP_NAME  = 'LightSpeedWorks';
var APP_TITLE = global.APP_TITLE = '光速工房 LightSpeedWorks';


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
clog('node', process.version, process.arch, process.platform, APP_NAME, __filename);


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
// koa app
var koa = require('koa');
var app = koa();

app.use(function *(){
  this.body = 'Hello World';
  clog('hello world');
});

// listen port
app.listen(CONFIG.port || process.env.PORT || 3000);
