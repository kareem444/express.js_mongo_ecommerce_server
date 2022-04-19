const express = require('express');
const { getCarts, deleteCarts , changeQuantity } = require('../controllers/Cart');
const { CheckProductChangeQuantity } = require('../middleware/CheckProductQuantity');
const auth = require('../middleware/ChekAuth');
const router = express.Router()

router.get("/", auth, getCarts);
router.delete("/:id", auth, deleteCarts);
router.put("/:id", [auth, CheckProductChangeQuantity], changeQuantity);


module.exports = router
