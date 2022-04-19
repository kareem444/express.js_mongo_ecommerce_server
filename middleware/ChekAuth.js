const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        res.status(403).json({
            message: "no token valid",
        });
        return;
    } else {
        jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized!",
                });
            }
            req.userId = decoded.id;
            next();
        });
    }
}

module.exports = auth;
