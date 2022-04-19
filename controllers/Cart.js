const Cart = require("../models/Cart");
const Product = require("../models/Product");

function changeProductQuantity(id, quantity, res, newQuantity) {
    Product.updateOne(
        {
            _id: id,
        },
        {
            quantity: quantity - newQuantity,
        },
        (err) => {
            if (err) {
                res.status(401).json({
                    message: "error cant change the quantity",
                });
            }
        }
    );
}

function UserCart(req, res) {
    const cartId = req.userId;
    const cartProducts = [
        {
            _id: req.body.product._id,
            quantity: req.body.product.quantity,
            totalProductPrice: req.body.product.totalPrice,
            product: {
                name: req.body.product.name,
                price: req.body.product.price,
                image: req.body.product.image,
            },
        },
    ];
    Cart.findById(cartId, (err, cart) => {
        if (err) {
            console.log(`Error: ` + err);
        } else {
            if (!cart) {
                const theCart = {
                    _id: cartId,
                    totalPrice: req.body.product.totalPrice,
                    productCount: req.body.product.quantity,
                    cartProducts: cartProducts,
                };
                Cart.create(theCart).then((responseCart) => {
                    res.json(responseCart);
                });
                changeProductQuantity(
                    req.productId,
                    req.productQuantity,
                    res,
                    req.body.product.quantity
                );
            } else {
                let productIndex = -1;
                for (let i = 0; i < cart.cartProducts.length; i++) {
                    if (cart.cartProducts[i]._id === req.body.product._id) {
                        productIndex = i;
                        break;
                    }
                }
                if (productIndex < 0) {
                    changeProductQuantity(
                        req.productId,
                        req.productQuantity,
                        res,
                        req.body.product.quantity
                    );
                    Cart.updateOne(
                        {
                            _id: cartId,
                        },
                        {
                            productCount: cart.productCount + req.body.product.quantity,
                            totalPrice: cart.totalPrice + req.body.product.totalPrice,
                            cartProducts: [...cart.cartProducts, cartProducts[0]],
                        },
                        (err) => {
                            if (err) {
                                console.log(`Error: ` + err);
                            }
                        }
                    );
                } else {
                    changeProductQuantity(
                        req.productId,
                        req.productQuantity,
                        res,
                        req.body.product.quantity
                    );
                    const cartProducts = cart.cartProducts;
                    const newProduct = {
                        _id: cart.cartProducts[productIndex]._id,
                        quantity:
                            cart.cartProducts[productIndex].quantity +
                            req.body.product.quantity,
                        totalProductPrice:
                            cart.cartProducts[productIndex].totalProductPrice +
                            req.body.product.price,
                        product: {
                            name: req.body.product.name,
                            price: req.body.product.price,
                            image: req.body.product.image,
                        },
                    };
                    cartProducts.splice(productIndex, 1);
                    cartProducts.unshift(newProduct);
                    Cart.updateOne(
                        {
                            _id: cartId,
                        },
                        {
                            productCount: cart.productCount + req.body.product.quantity,
                            totalPrice: cart.totalPrice + req.body.product.totalPrice,
                            cartProducts: cartProducts,
                        },
                        (err) => {
                            if (err) {
                                console.log(`Error: ` + err);
                            }
                        }
                    );
                }
            }
        }
    });
}

function getCarts(req, res) {
    const cartId = req.userId;
    Cart.findById(cartId, (err, doc) => {
        if (err) {
            res.status(409).json({
                message: "error cant get cart",
            });
        } else {
            if (!doc) {
                res.status(404).json({
                    message: "no cart found",
                });
            } else {
                res.status(201).json({
                    message: "success get cart",
                    cart: doc,
                });
            }
        }
    });
}

function deleteCarts(req, res) {
    const cartId = req.userId;
    const productId = req.params.id;

    Cart.findById(cartId, (err, cart) => {
        if (err) {
            res.status(500).json({
                message: "error",
            });
        } else {
            if (!cart) {
                res.status(404).json({
                    message: "no cart found",
                });
            } else {
                const cartProducts = cart.cartProducts;
                let productIndex = -1;
                let productQuantity = 0;
                let productTotalPrice = 0;
                for (let i = 0; i < cartProducts.length; i++) {
                    if (cartProducts[i]._id === productId) {
                        productIndex = i;
                        productQuantity = cartProducts[i].quantity;
                        productTotalPrice = cartProducts[i].totalProductPrice;
                        break;
                    }
                }
                if (productIndex >= 0) {
                    cartProducts.splice(productIndex, 1);
                    Cart.updateOne(
                        {
                            _id: cartId,
                        },
                        {
                            cartProducts: cartProducts,
                            productCount: cart.productCount - productQuantity,
                            totalPrice: cart.totalPrice - productTotalPrice,
                        },
                        (err) => {
                            if (err) {
                                res.status(402).json({
                                    message: "error cant delete the element",
                                });
                            } else {
                                Product.findById(productId, (err, product) => {
                                    if (err) {
                                        res.status(502);
                                    } else {
                                        if (!product) {
                                            res.status(402);
                                        } else {
                                            Product.updateMany(
                                                {
                                                    _id: product._id,
                                                },
                                                {
                                                    quantity: product.quantity + productQuantity,
                                                },
                                                (err) => {
                                                    if (err) {
                                                        res.json({
                                                            message: "error cant back th eproduct",
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                    }
                                });
                            }
                        }
                    );
                } else {
                    res.status(404).json({
                        message: "this product is not in the cart",
                    });
                }
            }
        }
    });
}

function changeQuantity(req, res) {
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
                    let newProductTotalPrice =
                        cart.cartProducts[productIndex].product.price * newQuantity;
                    let theNewProductTotalPrice =
                        cart.cartProducts[productIndex].totalProductPrice -
                        newProductTotalPrice;

                    let newProduct = {
                        _id: cart.cartProducts[productIndex]._id,
                        quantity: newQuantity,
                        totalProductPrice: newProductTotalPrice,
                        product: cart.cartProducts[productIndex].product,
                    };
                    cart.cartProducts.splice(productIndex, 1);
                    cart.cartProducts.unshift(newProduct);
                    Cart.updateOne(
                        {
                            _id: cart._id,
                        },
                        {
                            totalPrice: cart.totalPrice - theNewProductTotalPrice,
                            productCount: cart.productCount - theNewProductQuantity,
                            cartProducts: cart.cartProducts,
                            
                        },
                        (err) => {
                            if (err) {
                                res.status(400);
                            } else {
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
                                                Product.updateOne(
                                                    {
                                                        _id: product._id,
                                                    },
                                                    {
                                                        quantity: product.quantity + theNewProductQuantity,
                                                    },
                                                    (err) => {
                                                        if (err) {
                                                            res.status(400);
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        }
    });
}

module.exports = {
    UserCart,
    getCarts,
    deleteCarts,
    changeQuantity,
};
