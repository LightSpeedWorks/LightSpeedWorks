// LightSpeedWorks
// routes page1.js
// �y�[�W�S�̂��X�V

/*
 * GET a page.
 */

var util = require('util');

exports.index = function (req, res){
  var options = {
    title: 'LightSpeedWorks',
    page:  req.url,
    req:   util.inspect(req, false, 1, false),
    proc:  util.inspect(process, false, 2, false)
  };
  if (req.url === '/page1') {
    return res.render('page1', options);
  }
  else if (req.url === '/page2') {
    return res.render('page1', options);
  }
  options.title = 'LightSpeedWorks: pageX? ' + req.url;
  res.render('index', options);
};
