const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config();

const Product = require('./models/Product');

// Use the exact URI from .env
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://sohamdang0:boEucvJOU0v2OjHr@cluster0.gpf0a.mongodb.net/gaon";

async function addProducts() {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");

        const products = [
            {
                name: "Premium Handwash",
                description: "Organic herbal handwash for clean and soft hands.",
                images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"],
                brand: "PureLife",
                category: "6994477516bd62ecddc5bdb7", // Personal Care ID from your DB
                gender: "standard",
                subCategory: "Soap",
                variants: [{ size: "500ml", price: 150, countInStock: 20 }]
            },
            {
                name: "Natural Floor Cleaner",
                description: "Pesticide-free natural floor cleaner for a healthy home.",
                images: ["https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80"],
                brand: "EcoGreen",
                category: "6994477516bd62ecddc5bdb8", // Cleaning & Household ID from your DB
                gender: "standard",
                subCategory: "Cleaner",
                variants: [{ size: "1L", price: 299, countInStock: 15 }]
            }
        ];

        for (const p of products) {
            const newProduct = new Product(p);
            await newProduct.save();
            console.log(`Added product: ${p.name}`);
        }

        mongoose.connection.close();
        console.log("Database updated successfully");
    } catch (err) {
        console.error("Error updating database:", err);
        process.exit(1);
    }
}

addProducts();
