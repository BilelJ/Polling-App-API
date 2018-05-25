var mongoose = require('mongoose');
//mongoose.set('debug',true);
mongoose.connect('mongodb://mypoll:mlab2go@ds129540.mlab.com:29540/mypoll');

mongoose.Promise = Promise;

module.exports.Poll = require('./poll');
module.exports.Log = require("./log")