var mongoose = require('mongoose');
//mongoose.set('debug',true);
mongoose.connect('mongodb://SERVER:PORT/DBName');

mongoose.Promise = Promise;

module.exports.Poll = require('./poll');
module.exports.Log = require("./log")