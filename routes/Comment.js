const express = require('express');
const auth = require('../middleware/ChekAuth');
const { create } = require('../controllers/Comment');
const router = express.Router()

router.post('/:id', auth, create);

module.exports = router