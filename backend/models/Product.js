// Product Model
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true,
        minlength: 3,
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
        minlength: 10,
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: 0,
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Food', 'Other'],
    },
    stock: {
        type: Number,
        required: [true, 'Please provide stock quantity'],
        default: 0,
        min: 0,
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/300',
    },
    imagePath: {
        type: String,
        default: null,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviews: [{
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        rating: Number,
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }, ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);