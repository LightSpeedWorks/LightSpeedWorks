// app-start

'use strict';

var name = process.argv[2] || 'koa-app';

console.log(['node', process.version, process.arch, process.platform, __filename, name].join(' '));
console.log(process.cwd());

var spawn = require('child_process').spawn;

//######################################################################
setTimeout(function () {
  shell('node', '--harmony-generators', name, function (code) {
  //shell('cmd', '/c', 'dir /b', function (code) {
    console.log('*** exited: ' + code);
    shell('node', '--help', function (code) {
      console.log('*** exited: ' + code);
      shell('node', '--v8-options', function (code) {
        console.log('*** exited: ' + code);
        shell('node', '-v', function (code) {
          console.log('*** exited: ' + code);
        });
      });
    });
  });
}, 10000);

//######################################################################
function shell() {
  var args = Array.prototype.slice.call(arguments);
  var cb = args.pop();
  var cmd = args.shift();
  var proc = spawn(cmd, args);

  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
  proc.on('close', cb);
}
