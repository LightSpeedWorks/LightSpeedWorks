'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
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
app.get('/', function (req, res) {
  res.render('index', { title: 'Express (goo-boo)' });
});

// users
app.get('/users', function (req, res) {
  res.send('respond with a resource');
});

module.exports.app = app;
