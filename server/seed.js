const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
require('dotenv').config();

const sampleProducts = [
    {
        name: "Fresh Red Tomatoes",
        description: "Plump, ripe red tomatoes perfect for salads, sauces, and cooking. Sourced from local organic farms.",
        brand: "FarmFresh",
        categoryName: "Vegetables",
        categoryImage: "https://images.unsplash.com/photo-1518977676601-b53f02ac6d3d?auto=format&fit=crop&w=500&q=60",
        gender: "organic", // Matching new enums: standard, organic, premium, budget
        subCategory: "Staples",
        images: [
            "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?auto=format&fit=crop&w=800&q=80"
        ],
        variants: [
            { size: "500g", price: 40, countInStock: 50 },
            { size: "1kg", price: 75, countInStock: 100 }
        ]
    },
    {
        name: "Organic Bananas",
        description: "Sweet and creamy organic bananas. High in potassium and perfect for a quick healthy snack.",
        brand: "FruitJoy",
        categoryName: "Fruits",
        categoryImage: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=60",
        gender: "premium",
        subCategory: "featured",
        images: [
            "https://images.unsplash.com/photo-1571771894821-ad9902d83f4a?auto=format&fit=crop&w=800&q=80"
        ],
        variants: [
            { size: "6 pcs", price: 40, countInStock: 30 },
            { size: "1 dozen", price: 75, countInStock: 20 }
        ]
    },
    {
        name: "Full Cream Milk",
        description: "Fresh and pure full cream milk, pasteurized for safety. Rich in calcium and vitamins.",
        brand: "DairyPure",
        categoryName: "Milk",
        categoryImage: "/milk (2).jpg",
        gender: "standard",
        subCategory: "Essential",
        images: [
            "https://images.unsplash.com/photo-1563636619-e9107da5a76b?auto=format&fit=crop&w=800&q=80"
        ],
        variants: [
            { size: "500ml", price: 33, countInStock: 100 },
            { size: "1L", price: 65, countInStock: 50 }
        ]
    },
    {
        name: "Potato Chips - Classic Salted",
        description: "Crunchy and Delicious classic salted potato chips. Perfect for parties and snacking.",
        brand: "SnackTime",
        categoryName: "Ghee",
        categoryImage: "/ghee.jpg",
        gender: "budget",
        subCategory: "Party",
        images: [
            "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80"
        ],
        variants: [
            { size: "Small", price: 20, countInStock: 200 },
            { size: "Family Pack", price: 50, countInStock: 100 }
        ]
    },
    {
        name: "Fresh Carrots",
        description: "Crunchy and sweet orange carrots. Hand-picked and washed, ready for cooking or snacking.",
        brand: "FarmFresh",
        categoryName: "Vegetables",
        categoryImage: "https://images.unsplash.com/photo-1518977676601-b53f02ac6d3d?auto=format&fit=crop&w=500&q=60",
        gender: "organic",
        subCategory: "Staples",
        images: [
            "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80"
        ],
        variants: [
            { size: "500g", price: 30, countInStock: 60 }
        ]
    },
    {
        name: "Brown Bread - Whole Wheat",
        description: "Healthy and soft whole wheat brown bread. No added preservatives, baked fresh daily.",
        brand: "WheatBakes",
        categoryName: "Bakery",
        categoryImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=60",
        gender: "standard",
        subCategory: "featured",
        images: [
            "https://images.unsplash.com/photo-1533777419517-3e4017e2e15a?auto=format&fit=crop&w=800&q=80"
        ],
        variants: [
            { size: "400g", price: 45, countInStock: 40 }
        ]
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Product.deleteMany({});
        await Category.deleteMany({});
        console.log('Cleared existing product and category data');

        for (const p of sampleProducts) {
            let category = await Category.findOne({ name: p.categoryName });
            if (!category) {
                category = await Category.create({
                    name: p.categoryName,
                    image: p.categoryImage
                });
                console.log(`Created Category: ${p.categoryName}`);
            }

            const product = new Product({
                name: p.name,
                description: p.description,
                brand: p.brand,
                category: category._id,
                gender: p.gender,
                subCategory: p.subCategory,
                images: p.images,
                variants: p.variants
            });

            await product.save();
            console.log(`Created Product: ${p.name}`);
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
