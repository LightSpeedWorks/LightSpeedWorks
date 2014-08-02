// app-start

'use strict';

var name = process.argv[2] || 'koa-app';
console.log(['node', process.version, process.arch, process.platform, __filename, name].join(' '));

var spawn = require('child_process').spawn;
var proc = spawn('node', ['--harmony', name]);
//var proc = spawn('cmd', ['/c', 'dir /b']);
proc.stdout.on('data', function (data) { process.stdout.write(data); });
proc.stderr.on('data', function (data) { process.stderr.write(data); });
proc.on('close', function (code) { process.stdout.write('*** exited: ' + code + '\n'); });
