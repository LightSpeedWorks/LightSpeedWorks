// LightSpeedWorks app.js

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
  clog('app master: numWorkers: ' + numWorkers);
  for (var i = 0; i < numWorkers; i++)
    cluster.fork();
  cluster.on('death', function onDeath(worker) {
    clog('app worker ' + worker.pid + ' died');
  });
  return;
}
clog('app worker ' + process.pid + ' started');

//######################################################################
/**
 * モジュール依存関係
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var test  = require('./routes/test');
var test2 = require('./routes/test2');
var page1 = require('./routes/page1');
var pagex = require('./routes/pagex');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', CONFIG.port || process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/test',  test.index);
app.get('/test2', test2.index);
app.get('/test/pagex', test.index);
app.get('/test/envc',  test.index);
app.get('/test/page1', page1.index);
app.get('/test/page2', page1.index);
app.get('/test/pagex.html', pagex.index);
app.get('/test/users', user.list);

http.createServer(app).listen(app.get('port'), function () {
  clog(APP_NAME + ' Express server started on port ' + app.get('port'));
});

require('./http-proxy-server-ninja');

app.startDateTime = new Date();

global.app = app;
global.clog = clog;

