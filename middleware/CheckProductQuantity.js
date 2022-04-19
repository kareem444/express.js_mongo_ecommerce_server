const Product = require("../models/Product");
const Cart = require("../models/Cart");

function CheckProductQuantity(req, res, next) {
    Product.findById(req.body.product._id, (err, product) => {
        if (err) {
            res.status(500).json({
                message: "error product",
            });
            return;
        } else {
            if (!product) {
                res.status(404).json({
                    message: "product not found",
                });
                return;
            } else {
                if (product.quantity > 0) {
                    req.productId = product._id;
                    req.productQuantity = product.quantity;
                    next();
                } else {
                    res.status(402).json({
                        message: "no more product",
                    });
                    return;
                }
            }
        }
    });
}

function CheckProductChangeQuantity(req, res, next) {
    const cartId = req.userId;
    const productId = req.params.id;
    const newQuantity = req.body.quantity;

    Cart.findById(cartId, (err, cart) => {
        if (err) {
            res.status(500);
        } else {
            if (!cart) {
                res.status(404);
            } else {
                let productIndex = -1;
                for (let i = 0; i < cart.cartProducts.length; i++) {
                    if (cart.cartProducts[i]._id === productId) {
                        productIndex = i;
                        break;
                    }
                }
                if (productIndex >= 0) {
                    let theNewProductQuantity =
                        cart.cartProducts[productIndex].quantity - newQuantity;

                    Product.findById(
                        {
                            _id: cart.cartProducts[productIndex]._id,
                        },
                        (err, product) => {
                            if (err) {
                                res.status(500);
                            } else {
                                if (!product) {
                                    res.status(404);
                                } else {
                                    if ((product.quantity + theNewProductQuantity) >= 0) {
                                        next()
                                    } else {
                                        res.json(404).json({
                                            "message": "no more quantity"
                                        })
                                    }
                                }
                            }
                        }
                    );
                }
            }
        }
    });
}

module.exports = {
    CheckProductQuantity,
    CheckProductChangeQuantity,
};
