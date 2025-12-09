// Update product images script
// Replaces product.imageUrl with Unsplash source URLs generated from product name/category
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const stopwords = ['the', 'and', 'with', 'of', 'for', 'set', 'pack', 'a', 'an', 'in', 'on', 'by', 'to', 'from', 'kit', 'edition', 'premium'];

// Manual overrides for better keywords when product name is ambiguous
const overrides = {
    'USB-C Cable': 'usb-c cable,charging cable,usb cable',
    'Phone Charger': 'phone charger,usb charger,wall charger',
    'Power Bank': 'power bank,portable charger',
    'Wireless Mouse': 'wireless mouse,computer mouse',
    'Wireless Headphones': 'wireless headphones,headphones',
    'Smart Watch': 'smartwatch,fitness watch',
    'Portable Speaker': 'portable speaker,bluetooth speaker',
    'External SSD': 'external ssd,portable ssd',
    'Coffee Maker': 'coffee maker,coffee machine',
    'Organic Coffee Beans': 'coffee beans,coffee',
    'Olive Oil': 'olive oil,oil bottle,olive',
    'Coconut Milk': 'coconut milk,cooking coconut',
    'Almond Butter': 'almond butter,spread',
    'Protein Powder': 'protein powder,supplement',
    'Running Shoes': 'running shoes,sports shoes',
    'Yoga Mat': 'yoga mat,exercise mat',
    'Dumbbells Set': 'dumbbells,weights',
    'Monitor': 'computer monitor,display screen',
    'Desk Chair': 'office chair,ergonomic chair',
    'Bookshelf': 'bookshelf,bookcase',
    'Bed Sheet Set': 'bed sheets,bedding',
    'Throw Pillow': 'throw pillow,decorative pillow',
    'Area Rug': 'area rug,carpet',
    'Desk Lamp': 'desk lamp,table lamp',
    'Yoga Block': 'yoga block,exercise prop',
    'Treadmill': 'treadmill,exercise treadmill',
    'Protein Powder': 'protein powder,supplement',
    'Dark Chocolate': 'dark chocolate,chocolate bar',
    'Green Tea': 'green tea,tea leaves',
    'Honey': 'honey,jar of honey',
    'Spice Set': 'spices,spice set',
    'Herbal Tea Set': 'herbal tea,tea set',
};

const generateKeywords = (name, category) => {
    if (!name) return category || 'product';
    if (overrides[name]) return overrides[name];

    const cleaned = name.toLowerCase().replace(/[:'",\.\(\)]/g, '');
    const words = cleaned.split(/\s+/).filter(w => w && !stopwords.includes(w));
    // keep first 3 meaningful words
    const selected = words.slice(0, 3);

    // category fallbacks
    const categoryMap = {
        Electronics: 'electronics,gadgets',
        Clothing: 'clothing,fashion',
        Books: 'books,reading',
        Home: 'home,interior',
        Sports: 'sports,fitness',
        Food: 'food,groceries,cooking',
    };
    const fallback = categoryMap[category] || (category ? category.toLowerCase() : 'product');

    // ensure fallback included
    if (!selected.includes(category && category.toLowerCase())) {
        selected.push(...fallback.split(','));
    }

    // unique and short
    const uniq = Array.from(new Set(selected)).slice(0, 4);
    return uniq.join(',');
};

const generateImageUrl = (name, category) => {
    const q = generateKeywords(name, category);
    // Unsplash Source returns a random image matching the query
    return `https://source.unsplash.com/600x600/?${encodeURIComponent(q)}`;
};

const run = async() => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const products = await Product.find({}).lean();
        console.log(`Found ${products.length} products`);

        let updated = 0;

        for (const p of products) {
            const name = p.name;
            const category = p.category || '';

            const newUrl = generateImageUrl(name, category);

            // Update only if different or missing
            if (!p.imageUrl || !p.imageUrl.includes('source.unsplash.com') || p.imageUrl !== newUrl) {
                await Product.updateOne({ _id: p._id }, { $set: { imageUrl: newUrl } });
                updated++;
                console.log(`Updated ${name} -> ${newUrl}`);
            }
        }

        console.log(`Done. Updated ${updated} products.`);
        process.exit(0);
    } catch (err) {
        console.error('Error updating product images:', err);
        process.exit(1);
    }
};

run();