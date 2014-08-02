// app-start.js

'use strict';

var fs = require('fs');
var appName = process.argv[2] || 'koa-app';
var procsFile = '../procs.json';

//######################################################################
function printerr(msg) {
  process.stderr.write(msg);
}

//######################################################################
// kill remain processes
var pids = [];
try {
  pids = require(procsFile);
} catch(e) {
  printerr('*** remain processes does not exist');
}

//======================================================================
pids.forEach(function (pid) {
  printerr('*** kill remain processes pid:' + pid + '\n');
  try {
    process.kill(pid, 'SIGHUP');
    printerr('*** process pid:' + pid + ' killed\n');
  } catch (e) {
    printerr('*** process pid:' + pid + ' can not killed: ' + e + '\n');
  }
});
writeProcsFile([]);

//======================================================================
function writeProcsFile(procs) {
  fs.writeFileSync(procsFile, JSON.stringify(procs) + '\n');
}

//######################################################################
printerr(['*** node', process.version, process.arch, process.platform, __filename, appName].join(' ') + '\n');
printerr('*** cwd ' + process.cwd() + '\n');

var spawn = require('child_process').spawn;

var config = require('./config.json');
var node = process.platform === 'sunos' ? '/home/node/.nvm/' + config.version + '/bin/node' : 'node';

//######################################################################
var procs = {};
function killAll() {
  for (var i in procs) {
    try {
      procs[i] && process.kill(i, 'SIGHUP');
      printerr('*** process pid:' + i + ' killed\n');
    } catch (e) {
      printerr('*** process pid:' + i + ' can not killed: ' + e + '\n');
    }
  }
  writeProcsFile([]);
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
  printerr('process exit code: 0x' + (code.toString(16)) + '\n');
  killAll();
});
process.on('SIGINT', function() {
  printerr('Got SIGINT.' + '\n');
  killAll();
});
process.on('SIGHUP', function() {
  printerr('Got SIGHUP.' + '\n');
  killAll();
});
process.on('uncaughtException', function(err) {
  printerr('Caught exception: ' + err + '\n');
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
    [node, '--harmony-generators', appName]
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
    printerr('*** exited: ' + (err ? err : code) + '\n');
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
  writeProcsFile([procs.pid]);

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
    writeProcsFile([]);

    called = true;
    if (msg) return cb(new Error(msg), msg);
    return cb(null, code);
  }
}
