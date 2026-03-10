const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://gaonseghartak31_db_user:euKS9PsZSarJeQju@cluster0.zwcynb.mongodb.net/gaon-se-ghar-tak";

const normalizeSize = (size) => size ? size.toLowerCase().replace(/\([^)]*\)/g, '').replace(/[^a-z0-9]/g, '').trim() : '';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to DB");
        const db = mongoose.connection.db;

        const products = await db.collection('products').find({}).toArray();
        for (const p of products) {
            let updated = false;

            // 1. sync countInStock using normalized sizes
            if (p.variants && p.pincodePricing) {
                const newVariants = p.variants.map(v => {
                    const normVSize = normalizeSize(v.size);
                    const sum = p.pincodePricing.filter(
                        pc => normalizeSize(pc.size) === normVSize
                    ).reduce((acc, pc) => acc + (Number(pc.inventory) || 0), 0);

                    // Also grab the first matching pincode price/originalPrice fallback just in case
                    const matchingPc = p.pincodePricing.find(pc => normalizeSize(pc.size) === normVSize);

                    if (sum > 0 && v.countInStock !== sum) {
                        updated = true;
                        return {
                            ...v,
                            countInStock: sum,
                            price: matchingPc && matchingPc.price ? matchingPc.price : v.price,
                            originalPrice: matchingPc && matchingPc.originalPrice ? matchingPc.originalPrice : v.originalPrice
                        };
                    }
                    return v;
                });

                if (updated) {
                    await db.collection('products').updateOne({ _id: p._id }, { $set: { variants: newVariants } });
                    console.log("Synced stock for: ", p.name);
                }
            }
        }
        mongoose.disconnect();
    })
    .catch(err => { console.error(err); process.exit(1); });
