const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: 'c:/Users/Karan/Desktop/Shoes-ecommerce-main/shoe/server/.env' });

const Product = require('c:/Users/Karan/Desktop/Shoes-ecommerce-main/shoe/server/models/Product');
const Category = require('c:/Users/Karan/Desktop/Shoes-ecommerce-main/shoe/server/models/Category');

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // 1. Find or Create Category
        let category = await Category.findOne({ name: 'Grocery' });
        if (!category) {
            category = await Category.create({
                name: 'Grocery',
                image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
            });
            console.log('Created Grocery Category');
        }

        // 2. Add Chakki Aatta as Upcoming
        const productData = {
            name: 'Chakki Fresh Aatta',
            description: '100% Whole Wheat Chakki Fresh Aatta with no added maida.',
            brand: 'Farm Fresh',
            category: category._id,
            gender: 'standard',
            subCategory: 'Grains',
            images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'],
            variants: [{
                size: '5kg',
                price: 245,
                originalPrice: 280,
                countInStock: 50
            }],
            isComingSoon: true, // Mark as Upcoming
            isFeatured: false,
            isBestseller: false
        };

        const newProduct = await Product.create(productData);
        console.log('Successfully added testing product:', newProduct.name);

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
