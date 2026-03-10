const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://gaonseghartak31_db_user:euKS9PsZSarJeQju@cluster0.zwcynb.mongodb.net/gaon-se-ghar-tak";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to DB");
        const db = mongoose.connection.db;
        const products = await db.collection('products').find({ name: /Watermelon/i }).toArray();
        console.log(JSON.stringify(products, null, 2));
        mongoose.disconnect();
    })
    .catch(err => console.error(err));
