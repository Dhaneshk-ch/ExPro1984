// Cart Routes
const express = require('express');
const router = express.Router();
const {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All cart routes require authentication
router.post('/add', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.put('/update', authMiddleware, updateCartItem);
router.post('/remove', authMiddleware, removeFromCart);
router.delete('/clear', authMiddleware, clearCart);

module.exports = router;