// Payment Controller (Razorpay Integration)
const axios = require('axios');
const crypto = require('crypto');
const Order = require('../models/Order');

// Create Razorpay order
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ message: 'Amount and Order ID are required' });
    }

    // In real implementation, you would call Razorpay API
    // For demo, we'll create a mock order
    const razorpayOrder = {
      id: `order_${Date.now()}`,
      entity: 'order',
      amount: Math.round(amount * 100), // Razorpay expects amount in smallest currency unit
      amount_paid: 0,
      amount_due: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${orderId}`,
      offer_id: null,
      status: 'created',
      attempts: 0,
      notes: {
        ecommerceOrderId: orderId,
      },
      created_at: Math.floor(Date.now() / 1000),
    };

    // Update order with payment details
    await Order.findByIdAndUpdate(orderId, {
      paymentId: razorpayOrder.id,
    });

    res.status(200).json({
      message: 'Razorpay order created',
      order: razorpayOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Verify Razorpay payment
exports.verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // Verify signature (for demo, we'll skip actual verification)
    // In production, verify the signature using Razorpay key
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    //   .digest('hex');
    //
    // if (expectedSignature !== razorpay_signature) {
    //   return res.status(400).json({ message: 'Payment verification failed' });
    // }

    // Update order payment status
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'completed',
        paymentId: razorpay_payment_id,
        orderStatus: 'processing',
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Payment verified successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Payment failure callback
exports.paymentFailure = async (req, res, next) => {
  try {
    const { orderId, reason } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'failed',
        notes: reason || 'Payment failed',
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Payment failure recorded',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get payment details
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).select(
      'paymentStatus paymentId paymentMethod totalAmount'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Payment details retrieved',
      payment: {
        orderId: order._id,
        paymentId: order.paymentId,
        amount: order.totalAmount,
        status: order.paymentStatus,
        method: order.paymentMethod,
      },
    });
  } catch (error) {
    next(error);
  }
};
