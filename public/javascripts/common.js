// LightSpeedWorks
// public javascripts common.js

var divStatus = null; // ステータス
var divResult = null; // 結果表示用
var divResultEnvc = '';
var divResultPagex = '';
var currentPathname = '';

function colorProgress(text) {
  return '<font color="gray">' + text + '</font>'
}
function colorComplete(text) {
  return '<font color="blue">' + text + '</font>'
}

// windowOnLoad
function windowOnLoad() {
  divStatus = $("#status");
  divResult = $("#result");
  divResult.html('')
  divStatus.html(colorComplete('初期化終了!'));

  if (document.location.pathname === '/test/pagex') pagexOnClick(true);
  else if (document.location.pathname === '/test/envc') envcOnClick(true);
  currentPathname = document.location.pathname;
}

function windowOnPopState(event) {
//  if (!event || !event.state) {
//    currentPathname = document.location.pathname;
//    return;
//  }
  if (! divStatus) divStatus = $("#status");
  if (! divResult) divResult = $("#result");
  divStatus.html(
    '<pre>location: ' + document.location + '\n'+
    'state: ' + JSON.stringify(event.state) + '</pre>');

  if (divResult.html() === '') {
    if (document.location.pathname === '/test/pagex') pagexOnClick(true);
    else if (document.location.pathname === '/test/envc') envcOnClick(true);
  }
  else {
    if (document.location.pathname === '/test/pagex')
      if (divResultPagex === '') pagexOnClick(true);
      else divResult.html(divResultPagex);
    else if (document.location.pathname === '/test/envc')
      if (divResultPagex === '') envcOnClick(true);
      else divResult.html(divResultEnvc);
    else if (document.location.pathname === '/') divResult.html('');
    else if (document.location.pathname === '/test') divResult.html('');
  }
  currentPathname = document.location.pathname;
}

function pagexOnClick(skip) {
  if (! skip)
    window.history.pushState(null, 'pagex', '/test/pagex');

  divStatus.html(colorProgress('読込中...'))

  $.get('/test/pagex.html', /*{page: '/test/pagex.html'},*/ function (data) {
    divResult.html(data);
    divStatus.html('');
  });
}

function varToString(v) {
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'number' ||
      typeof v === 'string' ||
      typeof v === 'boolean') return '' + v;
  if (typeof v === 'function') return 'function';
  if (typeof v === 'object') {
    try {
      return JSON.stringify(v);
    }
    catch (e) {
      try {
        if ('toString' in v) return v.toString();
        return '' + v;
      }
      catch (e) {
        return typeof v;
      }
    }
  }
  return typeof v;
}

function getObjectToString(obj) {
  var data = '';
  for (var i in obj) {
    var v = obj[i];
    if (v === null) continue;
    if (typeof v === 'function') continue;
    if (v === obj) {
      data += i + ' == (it self)\n';
    }
    else {
      data += i + ' = ' + varToString(v) + '\n';
    }
  }
  return data;
}

function envcOnClick(skip) {
  if (! skip)
    window.history.pushState({page: '/test/envc'}, 'envc', '/test/envc');

  divStatus.html(colorProgress('読込中...'))

  var data = '';
  data += '<h2>client objects:</h2>\n';

  data += '<h3>window:</h3>\n';
  data += '<pre>\n';
  data += getObjectToString(window);
  data += '\n</pre>\n';

  data += '<h3>navigator:</h3>\n';
  data += '<pre>\n';
  data += getObjectToString(navigator);
  data += '\n</pre>\n';

  data += '<h3>document.location:</h3>\n';
  data += '<pre>\n';
  data += getObjectToString(document.location);
  data += '\n</pre>\n';

  data += '<h3>end of /test/envc</h3>\n';

  divResult.html(data);
  divStatus.html('');
}

// body(DOM)読込完了で動作させる方が良い? 速くなるかな?
window.onload = windowOnLoad;

window.onpopstate = windowOnPopState;

//if (! Object.prototype.toString) {
//  alert('Object.toString が無い! ので定義する!');
//  Object.prototype.toString = function toString() {
//    return JSON.stringify(this);
//  }
//}
