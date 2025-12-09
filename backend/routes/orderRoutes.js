// Order Routes
const express = require('express');
const router = express.Router();
const {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
} = require('../controllers/orderController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

// Customer routes
router.post('/create', authMiddleware, createOrder);
router.get('/my', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getOrder);
router.post('/:id/cancel', authMiddleware, cancelOrder);

// Admin routes
router.get('/', authMiddleware, isAdmin, getAllOrders);
router.put('/:id/status', authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;