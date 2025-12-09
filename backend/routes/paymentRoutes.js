// Payment Routes
const express = require('express');
const router = express.Router();
const {
    createRazorpayOrder,
    verifyRazorpayPayment,
    paymentFailure,
    getPaymentDetails,
} = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Payment routes
router.post('/create-order', authMiddleware, createRazorpayOrder);
router.post('/verify', authMiddleware, verifyRazorpayPayment);
router.post('/failure', authMiddleware, paymentFailure);
router.get('/:orderId', authMiddleware, getPaymentDetails);

module.exports = router;