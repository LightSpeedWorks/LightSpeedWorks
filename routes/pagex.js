// LightSpeedWorks
// routes pagex.js
// 1部分を更新

/*
 * GET pageX page.
 */

var util = require('util');

exports.index = function (req, res){
  var options = {
    title: '光速工房 LightSpeedWorks:' + req.url,
    page:  req.url,
    req:   util.inspect(req, false, 1, false),
    res:   util.inspect(res, false, 1, false),
    proc:  util.inspect(process, false, 2, false)
  };
  res.render('pagex', options);
};
