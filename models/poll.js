var mongoose = require('mongoose');

var pollSchema = new mongoose.Schema({
    author: {
        type: String,
        required: "An author name is required!"
    },
    title: {
        type: String,
        required: "The title/question of the poll is required!!"
    },
    pollElements: [{element:{type:String,required:"Yes"},count:{type:Number,default:0}}],
    published: {
        type: Date,
        default: Date.now
    }

})

var Poll = mongoose.model("Poll",pollSchema);

module.exports = Poll;