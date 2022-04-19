const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var commentSchema = new mongoose.Schema({
    _id:{
        type:String,
    },
    commentCount:{
        type:Number,
        required:true,
    },
    comment:{
        type:Array,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('Comment', commentSchema);