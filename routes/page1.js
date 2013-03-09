// LightSpeedWorks
// routes page1.js
// ページ全体を更新

/*
 * GET a page.
 */

var util = require('util');

exports.index = function (req, res){
  var options = {
    title: '光速工房 LightSpeedWorks',
    page:  req.url,
    req:   util.inspect(req, false, 1, false),
    proc:  util.inspect(process, false, 2, false)
  };
  if (req.url === '/test/page1') {
    return res.render('page1', options);
  }
  else if (req.url === '/test/page2') {
    return res.render('page1', options);
  }
  options.title = '光速工房 LightSpeedWorks: pageX? ' + req.url;
  res.render('test', options);
};
