const express = require('express')
const router = express.Router()
const ProductsController = require('../controllers/ProductsController')

router.get('/', ProductsController.index);
router.get('/:id', ProductsController.showProduct);

module.exports = router