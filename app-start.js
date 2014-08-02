// app-start.js

'use strict';

var name = process.argv[2] || 'koa-app';

console.log(['*** node', process.version, process.arch, process.platform, __filename, name].join(' '));
console.log('*** cwd ' + process.cwd());

var spawn = require('child_process').spawn;

var node = process.platform === 'sunos' ? '/home/node/.nvm/v0.11.9/bin/node' : 'node';

//######################################################################
setTimeout(function () {
  shellFall(
    //['cmd', '/c', 'dir /b'], // for windows
    //['node', '-v'],
    //[node, '-v'],
    //[node, '--help'],
    //[node, '--v8-options'],
    [node, '--harmony-generators', name]
  );
}, process.platform === 'sunos' ? 10000 : 1000);

//######################################################################
function shellFall() {
  if (arguments.length === 0) return;
  var args = Array.prototype.slice.call(arguments);
  var cmd = args.shift().slice();
  cmd.push(cb);
  shell.apply(null, cmd);
  function cb(err, code) {
    console.log('*** exited: ' + (err ? err : code));
    if (args.length > 0) shellFall.apply(null, args);
  }
}

//######################################################################
function shell(/* cmd, args */) {
  var args = Array.prototype.slice.call(arguments);
  var cb = args.pop();
  var cmd = args.shift();
  var proc = spawn(cmd, args);

  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
  proc.on('close', callback);
  proc.on('exit', callback);

  var n = 2, called, msg;
  function callback(code, signal) {
    if (called) return;

    if (code || signal)
      msg = 'process exit code: ' + code +
            (signal ? ' signal: ' + signal : '');

    if (--n > 0) return;
    called = true;
    if (msg) return cb(new Error(msg), msg);
    return cb(null, code);
  }
}
