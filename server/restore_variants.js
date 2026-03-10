const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://gaonseghartak31_db_user:euKS9PsZSarJeQju@cluster0.zwcynb.mongodb.net/gaon-se-ghar-tak";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to DB");
        const db = mongoose.connection.db;

        const products = await db.collection('products').find({ name: /Watermelon/i }).toArray();
        for (const p of products) {
            const newVariants = [
                {
                    size: "1 PC (3KG)",
                    price: 80,
                    originalPrice: 80,
                    discount: 0,
                    countInStock: 119
                },
                {
                    size: "1 PC (2KG)",
                    price: 60,
                    originalPrice: 60,
                    discount: 0,
                    countInStock: 119
                }
            ];
            await db.collection('products').updateOne({ _id: p._id }, { $set: { variants: newVariants } });
            console.log("Restored variants for: ", p.name);
        }
        mongoose.disconnect();
    })
    .catch(err => { console.error(err); process.exit(1); });
