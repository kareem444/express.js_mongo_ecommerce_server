const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    _id:{
        type:String,
    },
    totalPrice:{
        type:Number,
        required:true,
    },
    productCount:{
        type:Number,
        required:true,
    },
    cartProducts:{
        type:Array,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('Cart', cartSchema);