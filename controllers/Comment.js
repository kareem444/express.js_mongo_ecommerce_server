const Comment = require("../models/Comment");
const User = require("../models/User");

function create(req, res) {
    const userId = req.userId;
    const productId = req.params.id;
    const comment = req.body.comment;

    User.findById(userId, (err, user) => {
        if (err) {
            res.status(500).json({
                mesage: "no user found",
            });
        } else {
            makeComment(productId, user, comment, res);
        }
    });
}

function makeComment(productId, user, comment, res) {
    Comment.findById(productId, (err, response) => {
        if (err) {
            res.status(500).json({
                mesage: "some thing wrong",
            });
        } else {
            if (!response) {
                const theComment = {
                    _id: productId,
                    commentCount: 1,
                    comment: [
                        {
                            userId: user._id,
                            userName: user.name,
                            body: comment,
                        },
                    ],
                };
                Comment.create(theComment).then((comment) => {
                    res.status(201).json({
                        message: "success make comment",
                        first_comment: true,
                        comment,
                    });
                });
            } else {
                Comment.updateOne(
                    {
                        _id: productId,
                    },
                    {
                        commentCount: response.commentCount + 1,
                        comment: [
                            {
                                userId: user._id,
                                userName: user.name,
                                body: comment,
                            },
                            ...response.comment,
                        ],
                    },
                    (err) => {
                        if (err) {
                            res.status(401).json({
                                message: "cant make comment",
                            });
                        } else {
                            res.status(201).json({
                                message: "success make comment",
                                first_comment: false
                            });
                        }
                    }
                );
            }
        }
    });
}

module.exports = {
    create,
};
