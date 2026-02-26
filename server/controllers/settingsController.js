const SystemSettings = require('../models/SystemSettings');

exports.getSettings = async (req, res) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = await SystemSettings.create({ dailyOrderLimit: 50 });
        }
        res.status(200).json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { dailyOrderLimit } = req.body;
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings({ dailyOrderLimit });
        } else {
            if (dailyOrderLimit !== undefined) settings.dailyOrderLimit = dailyOrderLimit;
        }
        await settings.save();
        res.status(200).json({ message: 'Settings updated successfully', settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
