const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

const categoriesToAdd = [
    {
        name: "Beverages",
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=60"
    },
    {
        name: "Personal Care",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=500&q=60"
    },
    {
        name: "Cleaning & Household",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=60"
    }
];

const addCats = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        for (const cat of categoriesToAdd) {
            await Category.findOneAndUpdate(
                { name: cat.name },
                { name: cat.name, image: cat.image },
                { upsert: true, new: true }
            );
            console.log(`Added/Updated Category: ${cat.name}`);
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

addCats();
