const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://gaonseghartak31_db_user:euKS9PsZSarJeQju@cluster0.zwcynb.mongodb.net/gaon-se-ghar-tak";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to DB");
        const db = mongoose.connection.db;

        const products = await db.collection('products').find({ name: /Watermelon/i }).toArray();
        for (const p of products) {
            const uniqueSizes = [...new Set(p.pincodePricing.map(pc => pc.size).filter(Boolean))];

            // Filter variants to keep only those present in pincode pricing unique sizes
            const newVariants = p.variants.filter(v => uniqueSizes.includes(v.size));

            if (newVariants.length !== p.variants.length) {
                await db.collection('products').updateOne({ _id: p._id }, { $set: { variants: newVariants } });
                console.log("Fixed variants for: ", p.name);
            }
        }
        mongoose.disconnect();
    })
    .catch(err => { console.error(err); process.exit(1); });
