/**
 * ML Service Routes
 * Expose ML service endpoints through Node.js backend
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
    getUserRecommendations,
    getSimilarProducts,
    searchByImage,
    checkHealth,
} = require('../services/mlService');

// Multer setup for image uploads
const upload = multer({ storage: multer.memoryStorage() });

/**
 * GET /ml/health
 * Check ML service health
 */
router.get('/health', async(req, res, next) => {
    try {
        const health = await checkHealth();
        res.json(health);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /ml/recommendations/user
 * Get personalized recommendations for logged-in user
 * Query params: top_k (optional, default 10)
 */
router.get('/recommendations/user', authMiddleware, async(req, res, next) => {
    try {
        const userId = req.userId;
        const topK = parseInt(req.query.top_k) || 10;

        // Get user's order history from database
        const Order = require('../models/Order');
        const orders = await Order.find({ userId }).select('items').lean();

        // Extract product history
        const userHistory = [];
        const Product = require('../models/Product');

        for (const order of orders) {
            for (const item of order.items) {
                const product = await Product.findById(item.productId).lean();
                if (product) {
                    userHistory.push({
                        productId: product._id.toString(),
                        category: product.category,
                        price: product.price,
                    });
                }
            }
        }

        // Get recommendations
        const recommendations = await getUserRecommendations(userId, userHistory, topK);

        res.json({
            success: true,
            userId,
            recommendationCount: recommendations.length,
            recommendations,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /ml/recommendations/similar/:productId
 * Get similar products for a given product
 * Query params: top_k (optional, default 10)
 */
router.get('/recommendations/similar/:productId', async(req, res, next) => {
    try {
        const { productId } = req.params;
        const topK = parseInt(req.query.top_k) || 10;

        // Verify product exists
        const Product = require('../models/Product');
        const product = await Product.findById(productId).lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Get similar products
        const similar = await getSimilarProducts(productId, topK);

        res.json({
            success: true,
            productId,
            productName: product.name,
            similarCount: similar.length,
            similar,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /ml/image-search
 * Search for products by image
 * Accepts multipart form-data with "file" field
 * Query params: top_k (optional, default 5)
 */
router.post('/image-search', upload.single('file'), async(req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided',
            });
        }

        const topK = parseInt(req.query.top_k) || 5;

        // Search by image
        const results = await searchByImage(req.file.buffer, topK);

        res.json({
            success: true,
            searchCount: results.length,
            results,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /ml/stats
 * Get ML service statistics
 */
router.get('/stats', async(req, res, next) => {
    try {
        const mlService = require('../services/mlService');

        const productCount = await mlService.getProductCount();
        const health = await checkHealth();

        res.json({
            success: true,
            mlService: health,
            products: {
                count: productCount,
            },
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;