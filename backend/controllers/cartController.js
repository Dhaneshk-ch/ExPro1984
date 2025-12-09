// Cart Controller
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add item to cart
exports.addToCart = async(req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.userId;

        // Validation
        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if product already in cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
        } else {
            cart.items.push({
                productId,
                quantity: parseInt(quantity),
                price: product.price,
            });
        }

        await cart.save();

        res.status(200).json({
            message: 'Item added to cart',
            cart,
        });
    } catch (error) {
        next(error);
    }
};

// Get user cart
exports.getCart = async(req, res, next) => {
    try {
        const userId = req.userId;

        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: 'name price imageUrl stock',
        });

        if (!cart) {
            return res.status(200).json({
                message: 'Cart is empty',
                cart: { items: [], total: 0 },
            });
        }

        // Calculate total
        const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.status(200).json({
            message: 'Cart retrieved',
            cart,
            total,
        });
    } catch (error) {
        next(error);
    }
};

// Update cart item quantity
exports.updateCartItem = async(req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.userId;

        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.productId.toString() === productId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.quantity = parseInt(quantity);
        await cart.save();

        res.status(200).json({
            message: 'Cart item updated',
            cart,
        });
    } catch (error) {
        next(error);
    }
};

// Remove item from cart
exports.removeFromCart = async(req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.userId;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.status(200).json({
            message: 'Item removed from cart',
            cart,
        });
    } catch (error) {
        next(error);
    }
};

// Clear cart
exports.clearCart = async(req, res, next) => {
    try {
        const userId = req.userId;

        await Cart.findOneAndUpdate({ userId }, { items: [] }, { new: true });

        res.status(200).json({
            message: 'Cart cleared',
        });
    } catch (error) {
        next(error);
    }
};