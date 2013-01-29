// LightSpeedWorks
// app.js
// アプリケーション

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
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
app.get('/pagex', routes.index);
app.get('/envc',  routes.index);
app.get('/page1', page1.index);
app.get('/page2', page1.index);
app.get('/html/pagex', pagex.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function (){
  console.log("Express server listening http://localhost:" + app.get('port'));
});
