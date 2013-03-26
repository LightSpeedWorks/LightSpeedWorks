// LightSpeedWorks
// routes pagex.js
// 1部分を更新

/*
 * GET pageX page.
 */

var util = require('util');

exports.index = function (req, res){
  var options = {
    title: '光速工房 LightSpeedWorks:' + req.url, req: req, res: res, process: process,
    page:  req.url,
    reqText:   util.inspect(req, false, 1, false),
    resText:   util.inspect(res, false, 1, false),
    procText:  util.inspect(process, false, 2, false)
  };
  res.render('pagex', options);
};
