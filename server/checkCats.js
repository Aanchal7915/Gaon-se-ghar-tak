const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

const checkCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const categories = await Category.find({});
        console.log('Existing Categories:', categories);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkCategories();
