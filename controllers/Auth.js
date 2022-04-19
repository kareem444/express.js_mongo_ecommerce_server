const User = require("../models/User");
const { SignUpValidation, SignInValidation } = require("../validation/Auth");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");

async function SignUp(req, res) {
    const user = {
        name: req.body.data.name,
        email: req.body.data.email,
        password: req.body.data.password,
    };
    await SignUpValidation.validateAsync(user)
        .then((response) => {
            bcrypt.hash(response.password, 10, function (err, hash) {
                if (!err) {
                    User.create({
                        name: response.name,
                        email: response.email,
                        password: hash,
                    }).then((docs) => {
                        const token = jwt.sign({ id: docs._id }, process.env.SECRET_TOKEN, {
                            expiresIn: 86400, // 24 hours
                        });
                        res.json({
                            message: "success sign up",
                            token,
                            user: docs,
                        });
                    });
                } else {
                    console.log(err);
                }
            });
        })
        .catch((error) => {
            res.status(403).json({
                message: error.details[0].message,
            });
        });
}

async function SignIn(req, res) {
    const user = {
        email: req.body.data.email,
        password: req.body.data.password,
    };
    await SignInValidation.validateAsync(user)
        .then((response) => {
            User.findOne({
                email: response.email,
            }).then((doc) => {
                if (!doc) {
                    res.status(401).json({
                        message: "no such user found",
                    });
                } else {
                    bcrypt.compare(
                        response.password,
                        doc.password,
                        function (err, result) {
                            if (!result) {
                                res.status(401).json({
                                    message: "valid email or password",
                                });
                            } else {
                                const token = jwt.sign(
                                    { id: doc._id },
                                    process.env.SECRET_TOKEN,
                                    {
                                        expiresIn: 86400, // 24 hours
                                    }
                                );
                                res.status(201).json({
                                    message: "success login",
                                    token: token,
                                    user: {
                                        id: doc._id,
                                        name: doc.name,
                                        email: doc.email,
                                    },
                                });
                            }
                        }
                    );
                }
            });
        })
        .catch((error) => {
            res.status(401).json({
                message: "valid email or password",
            });
        });
}

function UserInfo(req, res) {
    const userId = req.userId;

    User.findOne(
        {
            _id: userId,
        },
        "id email name"
    ).then((doc) => {
        if (!doc) {
            console.log("message");
        } else {
            Cart.findById(userId, "productCount", (err, cart) => {
                if (err) {
                    res.status(402).json({
                        message: "cant get the user cart",
                    });
                } else {
                    if (!cart) {
                        res.status(201).json({
                            message: "success getting user",
                            user: doc,
                            userCartproductQuantity: 0,
                        });
                    } else {
                        res.status(201).json({
                            message: "success getting user",
                            user: doc,
                            userCartproductQuantity: cart.productCount,
                        });
                    }
                }
            });
        }
    });
}

module.exports = {
    SignUp,
    SignIn,
    UserInfo,
};
