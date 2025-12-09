// Product Routes
const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getCategories,
} = require('../controllers/productController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

// Admin routes
router.post('/', authMiddleware, isAdmin, upload.single('image'), createProduct);
router.put('/:id', authMiddleware, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;