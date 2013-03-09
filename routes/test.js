/**
 * LightSpeedWorks
 * routes test.js
 * testページ
 */

/*
 * GET home page.
 */

exports.index = function (req, res){
  res.render('test', { title: '光速工房 LightSpeedWorks' });
};
