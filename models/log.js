var mongoose = require('mongoose');

var logSchema = new mongoose.Schema({
    pollId:{
        type: String,
        required:"Poll's ID is required",
    },
    ips:[String]
});

var Log = mongoose.model("Log",logSchema);
module.exports = Log;