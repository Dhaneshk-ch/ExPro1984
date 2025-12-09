// Auth Routes
const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, getAllUsers } = require('../controllers/authController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Admin routes
router.get('/users', authMiddleware, isAdmin, getAllUsers);

module.exports = router;