// LightSpeedWorks app.js

'use strict';

// Application name. {アプリケーション名}
var APP_NAME = 'LightSpeedWorks';
var APP_TITLE = '光速工房 LightSpeedWorks';

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
    CONFIG = require('../../' + APP_NAME + '.json');
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
/**
 * モジュール依存関係
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', CONFIG.port || process.env.PORT || 3000);
app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.resolve(__dirname, '../public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// index
app.get('/', function index(req, res){
  res.render('index', { title: APP_TITLE,
          req: req, res: res, process: process, util: util });
});

app.get('/test',            test1);
app.get('/test2',           test2);
app.get('/test/pagex',      test1);
app.get('/test/envc',       test1);
app.get('/test/page1',      page1);
app.get('/test/page2',      page1);
app.get('/test/pagex.html', pagex);

var util = require('util');

function page1(req, res) {
  var options = {
    title: APP_TITLE, req: req, res: res, process: process,
    page:  req.url,
    reqText:   util.inspect(req, false, 1, false),
    procText:  util.inspect(process, false, 2, false)
  };
  if (req.url === '/test/page1') {
    return res.render('page1', options);
  }
  else if (req.url === '/test/page2') {
    return res.render('page1', options);
  }
  options.title = APP_TITLE + ': pageX? ' + req.url;
  res.render('test', options);
}

function pagex(req, res) {
  var options = {
    title: APP_TITLE + ':' + req.url, req: req, res: res, process: process,
    page:  req.url,
    reqText:   util.inspect(req, false, 1, false),
    resText:   util.inspect(res, false, 1, false),
    procText:  util.inspect(process, false, 2, false)
  };
  res.render('pagex', options);
}

function test1(req, res) {
  res.render('test', { title: APP_TITLE,
    req: req, res: res, process: process });
}

function test2(req, res){
  res.render('test2', { title: APP_TITLE,
        req: req, res: res, process: process, util: util,
        app: app, config: config,
        misc: { file: __filename, dir: __dirname}
  });
}

// users
app.get('/test/users', function (req, res){
  res.send('respond with a resource');
});

http.createServer(app).listen(app.get('port'), function () {
  clog('Server started on port ' + app.get('port') + ' (' + APP_NAME + ' Express)');
});

//require('./http-proxy-server-ninja');

app.startDateTime = new Date();

global.app = app;
global.clog = clog;
