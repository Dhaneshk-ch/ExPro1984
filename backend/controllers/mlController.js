/**
 * ML Service Controllers
 * Handle ML service interactions with business logic
 */

const {
    getUserRecommendations,
    getSimilarProducts,
    searchByImage,
    checkHealth,
} = require('../services/mlService');

const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Get personalized recommendations for user
 */
exports.getPersonalizedRecommendations = async(req, res, next) => {
    try {
        const userId = req.userId;
        const top_k = parseInt(req.query.top_k) || 10;

        // Fetch user's order history
        const userOrders = await Order.find({ userId })
            .populate('items.productId')
            .lean();

        if (!userOrders || userOrders.length === 0) {
            // No history – return popular products
            const popular = await Product.find()
                .sort({ rating: -1 })
                .limit(top_k)
                .lean();

            return res.json({
                success: true,
                message: 'No purchase history. Showing popular products.',
                recommendations: popular.map(p => ({
                    _id: p._id,
                    name: p.name,
                    category: p.category,
                    price: p.price,
                    imageUrl: p.imageUrl,
                    rating: p.rating,
                    score: 0.5, // default score
                })),
            });
        }

        // Build user history
        const userHistory = [];
        const seenProductIds = new Set();

        for (const order of userOrders) {
            for (const item of order.items) {
                const product = item.productId;
                if (product && !seenProductIds.has(product._id.toString())) {
                    userHistory.push({
                        productId: product._id.toString(),
                        category: product.category,
                        price: product.price,
                    });
                    seenProductIds.add(product._id.toString());
                }
            }
        }

        // Get ML recommendations
        const recommendations = await getUserRecommendations(
            userId,
            userHistory,
            top_k
        );

        // Enrich products
        const enrichedRecommendations = await Promise.all(
            recommendations.map(async rec => {
                const product = await Product.findById(rec.productId).lean();
                return {
                    ...rec,
                    imageUrl: imageUrl,
                    rating: rating,
                    stock: stock,
                    name: name,
                    category: category,
                    price: price,
                };

            })
        );

        res.json({
            success: true,
            userId,
            recommendationCount: enrichedRecommendations.length,
            recommendations: enrichedRecommendations,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get similar products for a given product
 */
exports.getSimilarProductsList = async(req, res, next) => {
    try {
        const { productId } = req.params;
        const top_k = parseInt(req.query.top_k) || 10;

        const targetProduct = await Product.findById(productId).lean();

        if (!targetProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const similar = await getSimilarProducts(productId, top_k);

        const enrichedSimilar = await Promise.all(
            similar.map(async sim => {
                const product = await Product.findById(sim.productId).lean();
                return {
                    ...sim,
                    imageUrl: imageUrl,
                    rating: rating,
                    stock: stock,
                    name: name,
                    category: category,
                    price: price,
                };
            })
        );

        res.json({
            success: true,
            targetProductId: productId,
            targetProductName: targetProduct.name,
            similarCount: enrichedSimilar.length,
            similar: enrichedSimilar,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Search products by image
 */
exports.searchProductsByImage = async(req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided. Use multipart form-data with "file" field.',
            });
        }

        const top_k = parseInt(req.query.top_k) || 5;

        const results = await searchByImage(req.file.buffer, top_k);

        if (!results || results.length === 0) {
            return res.json({
                success: true,
                message: 'No similar products found',
                results: [],
            });
        }

        const enrichedResults = await Promise.all(
            results.map(async result => {
                const product = await Product.findById(result.productId).lean();
                return {
                    ...result,
                    name: name,
                    category: category,
                    price: price,
                    imageUrl: imageUrl,
                    rating: rating,
                    stock: stock,
                };
            })
        );

        res.json({
            success: true,
            searchCount: enrichedResults.length,
            results: enrichedResults,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get ML service status and statistics
 */
exports.getMLServiceStatus = async(req, res, next) => {
    try {
        const health = await checkHealth();
        const productCount = await Product.countDocuments();

        res.json({
            success: true,
            mlService: {
                status: health.status,
                message: health.message,
            },
            database: {
                productCount,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get trending products (last 30 days)
 */
exports.getTrendingProducts = async(req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const trendingOrders = await Order.find({
                createdAt: { $gte: thirtyDaysAgo },
            })
            .select('items')
            .lean();

        // Count occurrences
        const productCounts = {};

        trendingOrders.forEach(order => {
            order.items.forEach(item => {
                const id = item.productId.toString();
                productCounts[id] = (productCounts[id] || 0) + 1;
            });
        });

        // Sort by frequency
        const topProductIds = Object.entries(productCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([id]) => id);

        const trendingProducts = await Product.find({
            _id: { $in: topProductIds },
        }).lean();

        res.json({
            success: true,
            count: trendingProducts.length,
            period: 'Last 30 days',
            products: trendingProducts,
        });
    } catch (error) {
        next(error);
    }
};