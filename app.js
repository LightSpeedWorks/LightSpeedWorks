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
// express app
var express = require('express'); 
var app = express(); 

// sub apps
var testApp =   require('./test-app/app.js').app;
var localApp =  require('./local-app/app.js').app;
var lightApp =  require('./light-app/app.js').app;
var goobooApp = require('./gooboo-app/app.js').app;
var appApp =    require('./app-app/app.js').app;

// port
app.set('port', CONFIG.port || process.env.PORT || 3000);

// vhostApps
var vhostApps = {
  'localhost': localApp,
  '127.0.0.1': localApp,
  'test.lightspeedworks.dev': testApp,
  'test.lightspeedworks.com': testApp,
  'app.lightspeedworks.dev': appApp,
  'app.lightspeedworks.com': appApp,
  '*.app.lightspeedworks.dev': appApp,
  '*.app.lightspeedworks.com': appApp,
  'www.lightspeedworks.dev': lightApp,
  'www.lightspeedworks.com': lightApp,
  'lightspeedworks.dev': lightApp,
  'lightspeedworks.com': lightApp,
  'www.goo-boo.dev': goobooApp,
  'www.goo-boo.com': goobooApp,
  'goo-boo.dev': goobooApp,
  'goo-boo.com': goobooApp,
};

for (var host in vhostApps)
  app.use(express.vhost(host, vhostApps[host]));

app.get('/*', redirect);
app.post('/*', redirect);

// redirect
function redirect(req, res, next) {
  var host = req.headers.host;

  if (vhostApps[host])
    return next();

  if (host.indexOf('app.lightspeedworks.') > 0)
    return appApp(req, res, next);

  lightApp(req, res, next);
}

// listend
clog('Server starting - port ' + app.get('port') + ' (' + APP_NAME + ' Express)');
app.listen(app.get('port'), function () {
  clog('Server started on port ' + app.get('port') + ' (' + APP_NAME + ' Express)');
});

require('./proxy-app/proxy').proxy(clog, CONFIG, APP_NAME);
