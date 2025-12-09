/**
 * ML Service Integration
 * Handles all communication with the Python FastAPI ML Service
 */

const axios = require('axios');

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const ML_TIMEOUT = 30000; // 30 seconds

// Create axios instance for ML service
const mlClient = axios.create({
    baseURL: ML_URL,
    timeout: ML_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Get recommendations for a user based on their purchase history
 * @param {string} userId - User ID
 * @param {Array} userHistory - Array of purchased products
 * @param {number} topK - Number of recommendations
 * @returns {Promise<Array>} - Recommended products
 */
async function getUserRecommendations(userId, userHistory = [], topK = 10) {
    try {
        const response = await mlClient.post('/recommend/user', {
            userId,
            user_history: userHistory,
            top_k: topK,
        });
        return response.data;
    } catch (error) {
        console.error('Error getting user recommendations:', error.message);
        throw new Error(`ML Service Error: ${error.message}`);
    }
}

/**
 * Get similar products for a given product
 * @param {string} productId - Product ID
 * @param {number} topK - Number of similar products
 * @returns {Promise<Array>} - Similar products
 */
async function getSimilarProducts(productId, topK = 10) {
    try {
        const response = await mlClient.post('/recommend/similar-products', {
            productId,
            top_k: topK,
        });
        return response.data;
    } catch (error) {
        console.error('Error getting similar products:', error.message);
        throw new Error(`ML Service Error: ${error.message}`);
    }
}

/**
 * Search for products by image
 * @param {Buffer|Stream} imageBuffer - Image file buffer
 * @param {number} topK - Number of results
 * @returns {Promise<Array>} - Similar products
 */
async function searchByImage(imageBuffer, topK = 5) {
    try {
        const FormData = require('form-data');
        const form = new FormData();
        form.append('file', imageBuffer, { filename: 'search-image.jpg' });
        form.append('top_k', topK.toString());

        const response = await axios.post(`${ML_URL}/image-search`, form, {
            headers: form.getHeaders(),
            timeout: ML_TIMEOUT,
        });
        return response.data;
    } catch (error) {
        console.error('Error searching by image:', error.message);
        throw new Error(`Image Search Error: ${error.message}`);
    }
}

/**
 * Check ML service health
 * @returns {Promise<Object>} - Health status
 */
async function checkHealth() {
    try {
        const response = await mlClient.get('/health');
        return response.data;
    } catch (error) {
        console.error('ML Service health check failed:', error.message);
        return { status: 'unhealthy', message: error.message };
    }
}

/**
 * Get product count in ML service
 * @returns {Promise<number>} - Product count
 */
async function getProductCount() {
    try {
        const response = await mlClient.get('/products/count');
        return response.data.count;
    } catch (error) {
        console.error('Error getting product count:', error.message);
        return 0;
    }
}

/**
 * Get product details from ML service
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} - Product details
 */
async function getProductDetails(productId) {
    try {
        const response = await mlClient.get(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting product details:', error.message);
        throw new Error(`Product not found: ${productId}`);
    }
}

module.exports = {
    getUserRecommendations,
    getSimilarProducts,
    searchByImage,
    checkHealth,
    getProductCount,
    getProductDetails,
};