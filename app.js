const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
require("./config/database")
const routes = require('./routes/index')
require('dotenv').config()

const app = express()
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.use('/product', routes.products);
app.use('/user', routes.user);
app.use('/cart', routes.cart);
app.use('/comment', routes.comment);

const Product = require('./models/Product')

app.get('/kareem/:id', (req, res) => {
    const id = req.params.id
    const kareem = Product.find({}, {}, { skip: 1, limit: 2 }, (err, docs) => {
        if (err) {
            console.log(`Error: ` + err)
        } else {
            if (docs.length === 0) {
                console.log("message")
            } else {
                res.json(docs);
            }
        }
    });
    // Product.findById(id, (err, doc) => {
    //     if (err) {
    //         console.log(`Error: ` + err)
    //     } else {
    //         if (!doc) {
    //             console.log("message")
    //         } else {
    //              res.json(doc);
    //         }
    //     }
    // });
});

module.exports = app
