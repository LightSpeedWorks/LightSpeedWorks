// test app.js

'use strict';

//######################################################################
/**
 * モジュール依存関係
 * Module dependencies.
 */

var express = require('express');
var path = require('path');

var app = express();

// all environments
app.set('port', CONFIG.port || 3000);
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
app.get('/', index);

function index(req, res){
  res.render('index', { title: APP_TITLE,
          req: req, res: res, process: process, util: util });
}

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
    reqText:   util.inspect(req, false, 2, false),
    resText:   util.inspect(res, false, 2, false),
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
app.get('/test/users', users);

function users(req, res){
  res.send('respond with a resource');
}

app.startDateTime = new Date();

module.exports.app = app;
