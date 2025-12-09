// Auth Controller
const User = require('../models/User');
const { generateToken } = require('../config/jwt');

// Register user (Customer)
exports.register = async(req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create user
        const user = new User({
            name,
            email,
            password,
            role: 'customer',
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Login user (Customer & Admin)
exports.login = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user with password field (select: false by default)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({ message: 'Your account has been deactivated' });
        }

        // Compare passwords
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get current user profile
exports.getProfile = async(req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Profile retrieved',
            user,
        });
    } catch (error) {
        next(error);
    }
};

// Update user profile
exports.updateProfile = async(req, res, next) => {
    try {
        const { name, phone, address } = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId, {
                ...(name && { name }),
                ...(phone && { phone }),
                ...(address && { address }),
            }, { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Profile updated successfully',
            user,
        });
    } catch (error) {
        next(error);
    }
};

// Get all users (Admin only)
exports.getAllUsers = async(req, res, next) => {
    try {
        const users = await User.find({ role: 'customer' }).select('-password');

        res.status(200).json({
            message: 'Users retrieved',
            count: users.length,
            users,
        });
    } catch (error) {
        next(error);
    }
};