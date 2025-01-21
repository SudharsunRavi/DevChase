const router= require('express').Router();
const { createOrder, verifyPayment } = require('../controllers/payment.controller');
const verifiedUser = require('../middlewares/auth.middleware');

router.post('/order', verifiedUser, createOrder)
router.post('/verify', verifyPayment)

module.exports = router;