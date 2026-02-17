// src/controllers/analyticsController.js
const Order = require('../models/Order');
const moment = require('moment');

// @desc    Get today's sales and order count
// @route   GET /api/analytics/today
// @access  Private/Admin
exports.getTodayAnalytics = async (req, res) => {
    try {
        const startOfToday = moment().startOf('day').toDate();
        const orders = await Order.find({ createdAt: { $gte: startOfToday }, isPaid: true });
        const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        res.json({ totalOrders: orders.length, totalSales });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get monthly sales and order count
// @route   GET /api/analytics/monthly
// @access  Private/Admin
exports.getMonthlyAnalytics = async (req, res) => {
    try {
        const salesByMonth = await Order.aggregate([
            { $match: { isPaid: true } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    totalSales: { $sum: '$totalPrice' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        res.json(salesByMonth);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get daily sales for a specific month
// @route   GET /api/analytics/daily
// @access  Private/Admin
exports.getDailyAnalytics = async (req, res) => {
    const { month, year } = req.query;
    try {
        const dailySales = await Order.aggregate([
            { 
                $match: { 
                    isPaid: true,
                    createdAt: { 
                        $gte: moment().year(year).month(month - 1).startOf('month').toDate(),
                        $lte: moment().year(year).month(month - 1).endOf('month').toDate(),
                    }
                } 
            },
            {
                $group: {
                    _id: { day: { $dayOfMonth: '$createdAt' }, month: { $month: '$createdAt' } },
                    totalSales: { $sum: '$totalPrice' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.day': 1 } }
        ]);
        res.json(dailySales);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

