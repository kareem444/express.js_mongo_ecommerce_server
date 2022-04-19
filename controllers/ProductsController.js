const Product = require("../models/Product");
const Comment = require("../models/Comment");

function index(req, res) {
    Product.find({}, (err, docs) => {
        if (err) {
            console.log(`Error: ` + err);
        } else {
            if (docs.length === 0) {
                console.log("message");
            } else {
                res.json(docs);
            }
        }
    });
}

function showProduct(req, res) {
    const productId = req.params.id;

    Product.findById(productId, (err, product) => {
        if (err) {
            res.status(404).json({
                message: "no product found",
            });
        } else {
            if (!product) {
                res.status(404).json({
                    message: "no product found",
                });
            } else {
                Comment.findById(productId, (err, comment) => {
                    if (err) {
                        res.status(500).json({
                            mesage: "sorry some thing went wrong",
                        });
                    } else {
                        if (!comment) {
                            res
                                .status(201)
                                .json({ message: "success get the product", product: product });
                        } else {
                            res
                                .status(201)
                                .json({
                                    message: "success get the product and comments",
                                    product: product,
                                    comments: comment,
                                });
                        }
                    }
                });
            }
        }
    });
}

module.exports = {
    index,
    showProduct,
};
