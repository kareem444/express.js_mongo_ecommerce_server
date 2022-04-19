const express = require('express');
const { SignUp, SignIn, UserInfo} = require('../controllers/Auth');
const { UserCart } = require('../controllers/Cart');
const {CheckProductQuantity} = require('../middleware/CheckproductQuantity');
const { CheckSignUp, CheckConfirmPassword } = require('../middleware/CheckSignUp');
const auth = require('../middleware/ChekAuth');
const router = express.Router()


router.post('/signup', [CheckSignUp, CheckConfirmPassword], SignUp);
router.post('/signin', SignIn);
router.get('/', auth, UserInfo);
router.post('/cart', [auth , CheckProductQuantity], UserCart);

module.exports = router