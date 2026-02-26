const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    dailyOrderLimit: { type: Number, default: 50 },
    // more settings could follow
}, { timestamps: true });

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
