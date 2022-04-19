const User = require("../models/User");

function CheckSignUp(req, res, next) {
    User.findOne({
        email: req.body.data.email,
    }).then((doc) => {
        if (!doc) {
            next();
        } else {
            res.status(303).json({
                message: "this email is already exist",
            });
            return;
        }
    });
}

function CheckConfirmPassword(req, res, next) {
    const password = req.body.data.password;
    const confirm_password = req.body.data.confirm_password;

    if (password === confirm_password) {
        next()
    } else {
        res.status(403).json({
            message: "the password dosen't matches",
        });
        return;
    }
}


module.exports = {
    CheckSignUp,
    CheckConfirmPassword
}