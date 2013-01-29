// LightSpeedWorks
// routes pagex.js
// 1•”•ª‚ğXV

/*
 * GET pageX page.
 */

var util = require('util');

exports.index = function (req, res){
  var options = {
    title: 'LightSpeedWorks:' + req.url,
    page:  req.url,
    req:   util.inspect(req, false, 1, false),
    proc:  util.inspect(process, false, 2, false)
  };
  res.render('pagex', options);
};
