// Authentication Middleware
const { verifyToken } = require('../config/jwt');

// Verify if user is authenticated
const authMiddleware = (req, res, next) => {
    try {
        // Optional chaining fixed
        const authHeader = req.headers.authorization;
        const token = authHeader.startsWith('Bearer ') ?
            authHeader.split(' ')[1] :
            null;

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Authentication failed',
            error: error.message,
        });
    }
};

// Verify if user is admin
const isAdmin = (req, res, next) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin role required.',
            });
        }
        next();
    } catch (error) {
        res.status(403).json({
            success: false,
            message: 'Authorization failed',
            error: error.message,
        });
    }
};

// Verify if user is customer
const isCustomer = (req, res, next) => {
    try {
        if (req.userRole !== 'customer') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Customer role required.',
            });
        }
        next();
    } catch (error) {
        res.status(403).json({
            success: false,
            message: 'Authorization failed',
            error: error.message,
        });
    }
};

module.exports = {
    authMiddleware,
    isAdmin,
    isCustomer,
};