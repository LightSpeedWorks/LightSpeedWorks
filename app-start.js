// app-start.js

'use strict';

var name = process.argv[2] || 'koa-app';

console.log(['*** node', process.version, process.arch, process.platform, __filename, name].join(' '));
console.log('*** cwd ' + process.cwd());

var spawn = require('child_process').spawn;

var node = process.platform === 'sunos' ? '/home/node/.nvm/v0.11.10/bin/node' : 'node';

//######################################################################
var procs = {};
function killAll() {
  for (var i in procs) {
    try {
      procs[i] && process.kill(i, 'SIGHUP');
      console.log('*** process pid:' + i + ' killed');
    } catch (e) {
      console.log('*** process pid:' + i + ' can not killed: ' + e);
    }
  }
  setTimeout(function() {
    for (var i in procs) {
      try {
        procs[i] && process.kill(i);
      } catch (e) {
        //console.log(e + '');
      }
    }
    process.kill(process.pid);
  }, 1000);
}

//######################################################################
process.on('exit', function(code) {
  console.log('process exit code: 0x' + (code.toString(16)));
  killAll();
});
process.on('SIGINT', function() {
  console.log('Got SIGINT.');
  killAll();
});
process.on('SIGHUP', function() {
  console.log('Got SIGHUP.');
  killAll();
});
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  killAll();
});

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
  procs[proc.pid] = proc;

  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
  proc.on('close', callback);
  proc.on('exit', callback);

  var n = 2, called, msg;
  function callback(code, signal) {
    if (called) return;

    if (code || signal)
      msg = 'process exit code: 0x' + (code.toString(16)) +
            (signal ? ' signal: ' + signal : '');

    if (--n > 0) return;

    delete procs[proc.pid];

    called = true;
    if (msg) return cb(new Error(msg), msg);
    return cb(null, code);
  }
}
