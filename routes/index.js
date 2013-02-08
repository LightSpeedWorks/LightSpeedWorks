// LightSpeedWorks
// routes index.js
// indexページ

/*
 * GET home page.
 */

exports.index = function (req, res){
  res.render('index', { title: '光速工房 LightSpeedWorks' });
};
