require("../config/database");
const Product = require("../models/Product");

const pro = new Product({
    image: "kk.jpg",
    name: "sixxxxxxxxxxxxxxxxxxx",
    price: 66,
    description: "this is the 666666666666 mobo",
    quantity: 4
});

pro.save().then((e) => {
    console.log(e);
});
