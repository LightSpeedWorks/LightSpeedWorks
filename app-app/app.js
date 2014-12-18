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

var punycode = require('punycode');

// index
app.get('/*', function (req, res) {
  var name = req.headers.host;
  if (name.indexOf('.lightspeedworks.') > 0)
    name = name.slice(0, name.indexOf('.lightspeedworks.'));

  var name2 = punicode.toUnicode(name);
  if (name !== name2)
    name2 = name2 + ' <- ' + name;

  var url2 = decodeURI(req.url);
  if (req.url !== url2)
    url2 = url2 + ' <- ' + req.url;

  var host2 = punycode.toUnicode(req.headers.host);
  if (req.headers.host !== host2)
    host2 = host2 + ' <- ' + req.headers.host;

  res.render('index', { title: 'Express (' + name2 + ')',
    punycode: punycode,
    url:  req.url,
    url2:  url2,
    name: name,
    name2: name2,
    host: req.headers.host,
    host2: host2,
    util: require('util'),
    hdrs: req.headers });
});

module.exports.app = app;
