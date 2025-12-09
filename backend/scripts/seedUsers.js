// Seed script - Creates demo users
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const demoUsers = [{
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
        phone: '+1-800-ADMIN-01',
        address: '123 Admin Street, Admin City, AC 12345',
    },
    {
        name: 'Customer User',
        email: 'customer@test.com',
        password: 'password123',
        role: 'customer',
        phone: '+1-800-CUST-001',
        address: '456 Customer Ave, Customer Town, CT 67890',
    },
];

const seedUsers = async() => {
    try {
        await connectDB();
        console.log('✓ MongoDB connected');

        // Clear existing users
        await User.deleteMany({});
        console.log('✓ Cleared existing users');

        // Create users with .save() to trigger pre-save hash
        const createdUsers = [];
        for (const userData of demoUsers) {
            const user = new User(userData);
            await user.save(); // This will trigger pre-save password hash
            createdUsers.push({
                name: user.name,
                email: user.email,
                role: user.role,
                passwordHashed: user.password !== userData.password, // Verify password was hashed
            });
        }

        console.log('✓ Created demo users with hashed passwords');

        console.log('\n👤 Demo Users Created:');
        createdUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Password Hashed: ${user.passwordHashed}`);
        });

        console.log('\n✅ Users seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding users:', error.message);
        console.error(error);
        process.exit(1);
    }
};

seedUsers();