// Product Controller
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// Create product (Admin only)
exports.createProduct = async(req, res, next) => {
    try {
        const { name, description, price, category, stock } = req.body;

        // Validation
        if (!name || !description || !price || !category || stock === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Handle image upload
        let imageUrl = 'https://via.placeholder.com/300';
        let imagePath = null;

        if (req.file) {
            imagePath = req.file.filename;
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const product = new Product({
            name,
            description,
            price: parseFloat(price),
            category,
            stock: parseInt(stock),
            imageUrl,
            imagePath,
            createdBy: req.userId,
        });

        await product.save();

        res.status(201).json({
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        // Delete uploaded file if product creation fails
        if (req.file) {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        next(error);
    }
};

// Get all products
exports.getAllProducts = async(req, res, next) => {
    try {
        const { category, minPrice, maxPrice, search, page = 1, limit = 50 } = req.query;

        // Build filter
        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(filter)
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            message: 'Products retrieved',
            count: products.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            products,
        });
    } catch (error) {
        next(error);
    }
};

// Get single product
exports.getProduct = async(req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('createdBy', 'name email');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product retrieved',
            product,
        });
    } catch (error) {
        next(error);
    }
};

// Update product (Admin only)
exports.updateProduct = async(req, res, next) => {
    try {
        const { name, description, price, category, stock } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update fields
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = parseFloat(price);
        if (category) product.category = category;
        if (stock !== undefined) product.stock = parseInt(stock);

        // Handle image update
        if (req.file) {
            // Delete old image if exists
            if (product.imagePath) {
                const oldFilePath = path.join(__dirname, '../uploads', product.imagePath);
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            }

            product.imagePath = req.file.filename;
            product.imageUrl = `/uploads/${req.file.filename}`;
        }

        await product.save();

        res.status(200).json({
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        // Delete uploaded file if update fails
        if (req.file) {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        next(error);
    }
};

// Delete product (Admin only)
exports.deleteProduct = async(req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete image file
        if (product.imagePath) {
            const filePath = path.join(__dirname, '../uploads', product.imagePath);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }

        res.status(200).json({
            message: 'Product deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Get product categories
exports.getCategories = async(req, res, next) => {
    try {
        const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Food', 'Other'];
        res.status(200).json({
            message: 'Categories retrieved',
            categories,
        });
    } catch (error) {
        next(error);
    }
};