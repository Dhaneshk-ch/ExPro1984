// Order Controller
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create order from cart
exports.createOrder = async(req, res, next) => {
    try {
        const userId = req.userId;
        const { shippingAddress, paymentMethod, items: requestItems } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }

        // If items are provided in the request body (frontend sends cart), use them.
        // Otherwise fall back to server-side cart stored in DB.
        let cart = null;
        let itemsToProcess = [];

        if (requestItems && Array.isArray(requestItems) && requestItems.length > 0) {
            itemsToProcess = requestItems;
        } else {
            cart = await Cart.findOne({ userId }).populate('items.productId');
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }
            // Convert cart.items into a normalized array { productId, quantity }
            itemsToProcess = cart.items.map((it) => ({ productId: it.productId._id || it.productId, quantity: it.quantity }));
        }

        // Calculate total and prepare order items
        let totalAmount = 0;
        const orderItems = [];

        // Validate products and stock based on itemsToProcess
        for (const item of itemsToProcess) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productId}` });
            }

            // Check stock
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}`,
                });
            }

            totalAmount += product.price * item.quantity;
            orderItems.push({
                productId: product._id,
                productName: product.name,
                quantity: item.quantity,
                price: product.price,
            });
        }

        // Create order
        const order = new Order({
            userId,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'razorpay',
        });

        await order.save();

        // Clear cart
        await Cart.findOneAndUpdate({ userId }, { items: [] });

        res.status(201).json({
            message: 'Order created successfully',
            order,
        });
    } catch (error) {
        next(error);
    }
};

// Get user orders
exports.getUserOrders = async(req, res, next) => {
    try {
        const userId = req.userId;

        const orders = await Order.find({ userId })
            .populate('items.productId', 'name imageUrl')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'User orders retrieved',
            count: orders.length,
            orders,
        });
    } catch (error) {
        next(error);
    }
};

// Get all orders (Admin only)
exports.getAllOrders = async(req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        let filter = {};
        if (status) {
            filter.orderStatus = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(filter)
            .populate('userId', 'name email phone')
            .populate('items.productId', 'name')
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Order.countDocuments(filter);

        res.status(200).json({
            message: 'All orders retrieved',
            count: orders.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            orders,
        });
    } catch (error) {
        next(error);
    }
};

// Get single order
exports.getOrder = async(req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email phone address')
            .populate('items.productId', 'name price imageUrl');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            message: 'Order retrieved',
            order,
        });
    } catch (error) {
        next(error);
    }
};

// Update order status (Admin only)
exports.updateOrderStatus = async(req, res, next) => {
    try {
        const { orderStatus } = req.body;
        const orderId = req.params.id;

        if (!orderStatus) {
            return res.status(400).json({ message: 'Order status is required' });
        }

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
            });
        }

        const order = await Order.findByIdAndUpdate(
            orderId, { orderStatus }, { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            message: 'Order status updated',
            order,
        });
    } catch (error) {
        next(error);
    }
};

// Cancel order
exports.cancelOrder = async(req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.orderStatus !== 'pending') {
            return res.status(400).json({
                message: 'Only pending orders can be cancelled',
            });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.status(200).json({
            message: 'Order cancelled successfully',
            order,
        });
    } catch (error) {
        next(error);
    }
};