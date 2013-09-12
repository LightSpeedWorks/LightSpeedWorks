/**
 * LightSpeedWorks
 * routes test2.js
 * testページ
 */

var util = require('util');

exports.index = function (req, res){
  res.render('test2', { title: '光速工房 LightSpeedWorks',
        req: req, res: res,
        process: process,
        util: util,
        app: app,
        config: config,
        misc: {
          file: __filename,
          dir: __dirname}
  });
};
