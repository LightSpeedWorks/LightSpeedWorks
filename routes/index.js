// LightSpeedWorks
// routes index.js
// indexページ

/*
 * GET home page.
 */

var util = require('util');

exports.index = function (req, res){
  res.render('index', { title: '光速工房 LightSpeedWorks',
          req: req, res: res,
          process: process,
          util: util });
};
