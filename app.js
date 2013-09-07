/**
 * LightSpeedWorks
 * app.js
 * アプリケーション
 */

/**
 * モジュール依存関係
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var test = require('./routes/test');
var page1 = require('./routes/page1');
var pagex = require('./routes/pagex');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

app.configure(function (){
  app.set('port', process.env.PORT || 3001);
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
});

app.configure('development', function (){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/test', test.index);
app.get('/test/pagex', test.index);
app.get('/test/envc',  test.index);
app.get('/test/page1', page1.index);
app.get('/test/page2', page1.index);
app.get('/test/pagex.html', pagex.index);
app.get('/test/users', user.list);

// kazuaki add
app.startDateTime = new Date();
//var util = require('util');
//console.log(util.inspect(app,false,2,true));
console.log(app.startDateTime);

http.createServer(app).listen(app.get('port'), function (){
  console.log("Express server listening http://localhost:" + app.get('port'));
});

require('./http-proxy-server-ninja');
