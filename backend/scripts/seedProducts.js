// Seed script - Creates comprehensive demo products (min 20 per category) with images
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

// Generate image URLs using Unsplash Source with keywords derived from product name and category
// This returns images that are much more likely to match the product (e.g., 'coconut oil' → coconut/oil photos)
const generateImageUrl = (name, category) => {
    const stopwords = ['the', 'and', 'with', 'of', 'for', 'set', 'pack', 'a', 'an', 'in', 'on', 'by', 'to', 'from', 'kit', 'edition'];
    const cleaned = name.toLowerCase().replace(/[:'",]/g, '');
    const nameWords = cleaned.split(/\s+/).filter(w => w && !stopwords.includes(w));
    // Keep up to 3 meaningful words from the name
    let keywords = nameWords.slice(0, 3);
    const categoryMap = {
        Electronics: 'electronics,gadgets',
        Clothing: 'clothing,fashion',
        Books: 'books,reading',
        Home: 'home,interior',
        Sports: 'sports,fitness',
        Food: 'food,groceries,cooking',
    };
    const fallback = categoryMap[category] || (category ? category.toLowerCase() : 'product');

    // Ensure category/fallback is included
    if (!keywords.includes(category && category.toLowerCase())) {
        keywords = keywords.concat(fallback.split(','));
    }

    // Make unique and short list
    const uniq = Array.from(new Set(keywords)).slice(0, 4);
    const q = uniq.join(',');
    return `https://source.unsplash.com/300x300/?${encodeURIComponent(q)}`;
};

const generateProducts = () => {
    const categories = {
        Electronics: [
            { name: 'Wireless Headphones', description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.', price: 4999, stock: 25 },
            { name: 'Smart Watch', description: 'Feature-rich smartwatch with fitness tracking, heart rate monitor, and notifications.', price: 8999, stock: 15 },
            { name: 'USB-C Cable', description: 'Durable USB-C cable with fast charging support and 2-year warranty.', price: 299, stock: 100 },
            { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with precision tracking and 18-month battery life.', price: 899, stock: 45 },
            { name: 'USB Hub', description: '7-port USB 3.0 hub with fast charging capability.', price: 1299, stock: 32 },
            { name: 'Phone Charger', description: 'Fast 65W USB-C PD charger compatible with all devices.', price: 1599, stock: 50 },
            { name: 'Portable Speaker', description: 'Waterproof Bluetooth speaker with 12-hour battery and 360° sound.', price: 2999, stock: 28 },
            { name: 'Keyboard', description: 'Mechanical gaming keyboard with RGB backlight and aluminum frame.', price: 5999, stock: 22 },
            { name: 'Monitor', description: '27-inch 4K monitor with 60Hz refresh rate and USB-C connectivity.', price: 18999, stock: 12 },
            { name: 'HDMI Cable', description: '2m HDMI 2.1 cable supporting 8K resolution.', price: 499, stock: 80 },
            { name: 'Screen Protector', description: 'Tempered glass screen protector for smartphones.', price: 199, stock: 120 },
            { name: 'Phone Stand', description: 'Adjustable aluminum phone stand for desk.', price: 399, stock: 60 },
            { name: 'Webcam', description: '1080p HD webcam with auto-focus and built-in microphone.', price: 2199, stock: 35 },
            { name: 'Laptop Stand', description: 'Adjustable aluminum laptop stand for ergonomic working.', price: 1899, stock: 40 },
            { name: 'Power Bank', description: '20000mAh portable charger with dual USB ports.', price: 1299, stock: 55 },
            { name: 'Microphone', description: 'Professional USB condenser microphone with shock mount.', price: 3499, stock: 18 },
            { name: 'Headphone Amplifier', description: 'Portable DAC/Amp for high-resolution audio.', price: 4999, stock: 10 },
            { name: 'Desk Organizer', description: 'Smart desk organizer with USB charging.', price: 1599, stock: 38 },
            { name: 'USB Flash Drive', description: '256GB USB 3.1 Gen 2 flash drive with 420MB/s speed.', price: 2499, stock: 70 },
            { name: 'External SSD', description: '1TB portable SSD with 1050MB/s read speed.', price: 7999, stock: 25 },
            { name: 'Cable Organizer', description: 'Silicone cable organizer set for wire management.', price: 299, stock: 90 },
            { name: 'Laptop Cooling Pad', description: 'Aluminum laptop cooler with 5 fans and USB power.', price: 1799, stock: 30 },
        ],
        Clothing: [
            { name: 'Cotton T-Shirt', description: 'Comfortable 100% cotton t-shirt in various colors and sizes.', price: 599, stock: 50 },
            { name: 'Winter Jacket', description: 'Warm and stylish winter jacket with waterproof coating.', price: 3999, stock: 20 },
            { name: 'Jeans', description: 'Classic blue denim jeans with comfortable fit.', price: 1499, stock: 35 },
            { name: 'Formal Shirt', description: 'Premium cotton formal shirt for office wear.', price: 1299, stock: 28 },
            { name: 'Polo Shirt', description: 'Classic polo shirt in multiple colors.', price: 899, stock: 45 },
            { name: 'Hoodie', description: 'Cozy fleece-lined hoodie perfect for cold weather.', price: 1699, stock: 32 },
            { name: 'Cargo Pants', description: 'Durable cargo pants with multiple pockets.', price: 1299, stock: 25 },
            { name: 'Dress Pants', description: 'Professional dress pants in black and charcoal.', price: 2199, stock: 22 },
            { name: 'Sweater', description: 'Soft knit sweater available in multiple colors.', price: 1899, stock: 30 },
            { name: 'Tank Top', description: 'Breathable tank top suitable for workouts.', price: 499, stock: 60 },
            { name: 'Shorts', description: 'Comfortable cotton shorts for summer.', price: 799, stock: 55 },
            { name: 'Sweatpants', description: 'Soft sweatpants for casual comfort.', price: 1199, stock: 40 },
            { name: 'Windbreaker', description: 'Lightweight windproof jacket for outdoor activities.', price: 2299, stock: 18 },
            { name: 'Baseball Cap', description: 'Classic baseball cap with adjustable strap.', price: 399, stock: 75 },
            { name: 'Beanie', description: 'Warm winter beanie in various colors.', price: 299, stock: 85 },
            { name: 'Scarf', description: 'Soft wool scarf for winter warmth.', price: 799, stock: 50 },
            { name: 'Socks Set', description: 'Pack of 6 comfortable cotton socks.', price: 449, stock: 100 },
            { name: 'Underwear Set', description: 'Comfortable cotton underwear pack.', price: 699, stock: 90 },
            { name: 'Athletic Wear Set', description: 'Matching athletic shirt and shorts set.', price: 1999, stock: 25 },
            { name: 'Leather Belt', description: 'Premium leather belt with metal buckle.', price: 699, stock: 40 },
            { name: 'Denim Shirt', description: 'Classic denim shirt for casual wear.', price: 1199, stock: 28 },
            { name: 'Linen Shirt', description: 'Breathable linen shirt perfect for summer.', price: 999, stock: 32 },
        ],
        Books: [
            { name: 'JavaScript: The Good Parts', description: 'Essential JavaScript reference by Douglas Crockford for web developers.', price: 499, stock: 30 },
            { name: 'Clean Code', description: 'A Handbook of Agile Software Craftsmanship by Robert C. Martin.', price: 699, stock: 25 },
            { name: 'Design Patterns', description: 'Gang of Four patterns for object-oriented software design.', price: 799, stock: 20 },
            { name: 'The Pragmatic Programmer', description: 'Guide to professional software development practices.', price: 649, stock: 22 },
            { name: 'Eloquent JavaScript', description: 'Modern JavaScript programming guide with interactive examples.', price: 599, stock: 28 },
            { name: 'You Dont Know JS', description: 'Deep dive into JavaScript concepts and mechanics.', price: 549, stock: 26 },
            { name: 'Code Complete', description: 'Practical guide to software construction.', price: 749, stock: 19 },
            { name: 'Refactoring', description: 'Improving the design of existing code.', price: 699, stock: 23 },
            { name: 'The Mythical Man-Month', description: 'Essays on software project management.', price: 449, stock: 21 },
            { name: 'Cracking the Coding Interview', description: 'Interview preparation guide for software engineers.', price: 799, stock: 35 },
            { name: 'Introduction to Algorithms', description: 'Comprehensive guide to algorithm design and analysis.', price: 1299, stock: 15 },
            { name: 'Database Design', description: 'Fundamentals of relational database design.', price: 649, stock: 18 },
            { name: 'Web Security Testing', description: 'OWASP guide to web application security.', price: 849, stock: 17 },
            { name: 'Machine Learning Basics', description: 'Introduction to machine learning concepts and algorithms.', price: 899, stock: 14 },
            { name: 'Python for Data Science', description: 'Practical Python guide for data analysis.', price: 749, stock: 22 },
            { name: 'DevOps Handbook', description: 'Guide to DevOps practices and CI/CD pipelines.', price: 799, stock: 16 },
            { name: 'Microservices Patterns', description: 'Architecture patterns for microservices.', price: 899, stock: 13 },
            { name: 'GraphQL in Action', description: 'Modern API development with GraphQL.', price: 749, stock: 20 },
            { name: 'Docker Cookbook', description: 'Docker containerization recipes and best practices.', price: 649, stock: 24 },
            { name: 'Kubernetes Guide', description: 'Container orchestration with Kubernetes.', price: 799, stock: 18 },
            { name: 'AWS Solutions Architect', description: 'AWS architecture and design patterns.', price: 849, stock: 15 },
            { name: 'Cloud Native Development', description: 'Building applications for the cloud.', price: 799, stock: 19 },
        ],
        Home: [
            { name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness and USB charging port.', price: 1299, stock: 40 },
            { name: 'Coffee Maker', description: 'Automatic coffee maker with programmable timer and thermal carafe.', price: 2999, stock: 18 },
            { name: 'Bedside Table Lamp', description: 'Soft warm light table lamp with touch control.', price: 899, stock: 35 },
            { name: 'Wall Clock', description: 'Modern minimalist wall clock with silent mechanism.', price: 499, stock: 50 },
            { name: 'Picture Frame', description: 'Digital picture frame with 10-inch display.', price: 3499, stock: 12 },
            { name: 'Throw Pillow', description: 'Decorative throw pillow with premium fabric.', price: 599, stock: 45 },
            { name: 'Area Rug', description: '3x5 area rug with modern geometric pattern.', price: 2499, stock: 16 },
            { name: 'Bookshelf', description: '5-tier wooden bookshelf with sturdy construction.', price: 4999, stock: 10 },
            { name: 'Desk Organizer', description: 'Bamboo desk organizer with multiple compartments.', price: 799, stock: 40 },
            { name: 'Plant Pot', description: 'Ceramic flower pot with drainage hole.', price: 399, stock: 60 },
            { name: 'Door Mat', description: 'Non-slip welcome doormat with rubber backing.', price: 349, stock: 55 },
            { name: 'Curtains', description: 'Room darkening curtains with thermal insulation.', price: 1499, stock: 22 },
            { name: 'Bed Sheet Set', description: '100% cotton bed sheet set with deep pockets.', price: 1699, stock: 25 },
            { name: 'Pillow', description: 'Memory foam pillow for comfortable sleep.', price: 1299, stock: 30 },
            { name: 'Comforter', description: 'Warm down comforter for all seasons.', price: 2499, stock: 18 },
            { name: 'Towel Set', description: 'Premium cotton towel set of 4 pieces.', price: 999, stock: 40 },
            { name: 'Bathroom Mirror', description: 'LED bathroom mirror with defog feature.', price: 2499, stock: 14 },
            { name: 'Trash Can', description: 'Stainless steel smart trash can with sensor.', price: 1999, stock: 20 },
            { name: 'Coat Hanger', description: 'Wall-mounted wooden coat hanger rack.', price: 699, stock: 35 },
            { name: 'Shoe Rack', description: 'Metal shoe rack for 8-10 pairs of shoes.', price: 1199, stock: 28 },
            { name: 'Storage Box', description: 'Foldable fabric storage box with handles.', price: 599, stock: 50 },
            { name: 'Desk Chair', description: 'Ergonomic office chair with lumbar support.', price: 5999, stock: 15 },
        ],
        Sports: [
            { name: 'Yoga Mat', description: 'Non-slip yoga mat, 6mm thick, suitable for all types of exercises.', price: 1999, stock: 35 },
            { name: 'Dumbbells Set', description: 'Adjustable dumbbells set 1-5kg with stand.', price: 2499, stock: 20 },
            { name: 'Resistance Bands', description: 'Set of 5 resistance bands for strength training.', price: 699, stock: 45 },
            { name: 'Jump Rope', description: 'Adjustable speed jump rope for cardio training.', price: 399, stock: 60 },
            { name: 'Running Shoes', description: 'Professional running shoes with gel cushioning.', price: 3999, stock: 25 },
            { name: 'Sports Backpack', description: 'Water-resistant sports backpack with ventilation.', price: 1499, stock: 30 },
            { name: 'Water Bottle', description: 'Insulated stainless steel water bottle 1L capacity.', price: 699, stock: 55 },
            { name: 'Gym Bag', description: 'Large gym bag with separate shoe compartment.', price: 1299, stock: 28 },
            { name: 'Swimming Goggles', description: 'UV-protective swimming goggles with anti-fog.', price: 499, stock: 40 },
            { name: 'Bicycle Helmet', description: 'Safety helmet with ventilation and light.', price: 1699, stock: 22 },
            { name: 'Roller Skates', description: 'Adjustable roller skates for all skill levels.', price: 2299, stock: 16 },
            { name: 'Skateboard', description: 'Professional skateboard with grip tape.', price: 2999, stock: 12 },
            { name: 'Tennis Racket', description: 'Graphite tennis racket for intermediate players.', price: 2499, stock: 18 },
            { name: 'Badminton Set', description: 'Complete badminton set with net and shuttles.', price: 1699, stock: 25 },
            { name: 'Basketball', description: 'Official size rubber basketball.', price: 899, stock: 35 },
            { name: 'Football', description: 'Professional synthetic leather football.', price: 1199, stock: 30 },
            { name: 'Cricket Bat', description: 'English willow cricket bat for professionals.', price: 4999, stock: 8 },
            { name: 'Boxing Gloves', description: '12oz professional boxing gloves with padding.', price: 1899, stock: 20 },
            { name: 'Yoga Block', description: 'Foam yoga block for better alignment and support.', price: 399, stock: 50 },
            { name: 'Foam Roller', description: 'High-density foam roller for muscle recovery.', price: 699, stock: 35 },
            { name: 'Exercise Ball', description: '65cm stability ball for core training.', price: 799, stock: 28 },
            { name: 'Treadmill', description: 'Home treadmill with digital display and 12 presets.', price: 19999, stock: 5 },
        ],
        Food: [
            { name: 'Organic Coffee Beans', description: 'Premium organic coffee beans sourced from sustainable farms.', price: 799, stock: 60 },
            { name: 'Protein Powder', description: 'High-protein supplement for muscle building and recovery.', price: 1299, stock: 45 },
            { name: 'Honey', description: 'Pure raw honey with natural enzymes.', price: 349, stock: 70 },
            { name: 'Almond Butter', description: 'Organic almond butter without additives.', price: 449, stock: 50 },
            { name: 'Dark Chocolate', description: '85% dark chocolate bar with antioxidants.', price: 199, stock: 100 },
            { name: 'Green Tea', description: 'Premium loose leaf green tea for health benefits.', price: 299, stock: 60 },
            { name: 'Energy Bars', description: 'Pack of 12 nutritious energy bars.', price: 599, stock: 40 },
            { name: 'Granola', description: 'Homemade granola mix with nuts and fruits.', price: 349, stock: 55 },
            { name: 'Chia Seeds', description: 'Premium organic chia seeds rich in omega-3.', price: 399, stock: 45 },
            { name: 'Quinoa', description: 'Organic white quinoa superfood.', price: 449, stock: 40 },
            { name: 'Almonds', description: 'Roasted and salted premium almonds 500g.', price: 399, stock: 50 },
            { name: 'Dried Berries', description: 'Mix of dried cranberries and blueberries.', price: 299, stock: 55 },
            { name: 'Olive Oil', description: 'Extra virgin olive oil from Mediterranean.', price: 599, stock: 35 },
            { name: 'Apple Cider Vinegar', description: 'Organic apple cider vinegar with mother culture.', price: 299, stock: 45 },
            { name: 'Coconut Milk', description: 'Pure coconut milk without additives.', price: 199, stock: 65 },
            { name: 'Peanut Butter', description: 'Natural peanut butter with no added sugar.', price: 349, stock: 50 },
            { name: 'Oatmeal', description: 'Steel-cut organic oatmeal 1kg.', price: 249, stock: 70 },
            { name: 'Dried Nuts Mix', description: 'Premium mixed nuts without salt.', price: 499, stock: 40 },
            { name: 'Sea Salt', description: 'Unrefined sea salt for cooking.', price: 149, stock: 80 },
            { name: 'Spice Set', description: 'Collection of 12 essential spices.', price: 699, stock: 30 },
            { name: 'Herbal Tea Set', description: 'Assorted herbal tea bags for wellness.', price: 449, stock: 45 },
            { name: 'Ginger Root', description: 'Fresh organic ginger root 500g.', price: 199, stock: 60 },
        ],
    };

    const products = [];
    for (const [category, items] of Object.entries(categories)) {
        items.forEach(item => {
            products.push({
                name: item.name,
                description: item.description,
                price: item.price,
                category: category,
                stock: item.stock,
                imageUrl: generateImageUrl(item.name, category),
                rating: Math.floor(Math.random() * 2) + 4,
            });
        });
    }

    return products;
};

const seedDatabase = async() => {
    try {
        await connectDB();

        // Clear existing products
        await Product.deleteMany({});
        console.log('✓ Cleared existing products');

        // Generate and insert products
        const sampleProducts = generateProducts();
        const createdProducts = await Product.insertMany(sampleProducts);
        console.log(`✓ Created ${createdProducts.length} sample products with images`);

        // Summary by category
        console.log('\n📦 Products by Category:');
        const categories = {};
        createdProducts.forEach(product => {
            if (!categories[product.category]) {
                categories[product.category] = [];
            }
            categories[product.category].push(product.name);
        });

        Object.entries(categories).forEach(([category, products]) => {
            console.log(`\n${category} (${products.length} products):`);
            products.forEach(name => {
                console.log(`  • ${name}`);
            });
        });

        console.log('\n✅ Database seeded successfully with placeholder images!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();