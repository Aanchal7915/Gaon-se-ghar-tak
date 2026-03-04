const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const ReturnReplace = require('../models/ReturnReplace');
const moment = require('moment');

// @desc    Get comprehensive analytics overview
// @route   GET /api/analytics/overview
// @access  Private/Admin
exports.getOverviewAnalytics = async (req, res) => {
    const { month, year, date, startDate, endDate } = req.query;
    try {
        let matchQuery = { isPaid: true };
        let start, end;

        if (date) {
            start = moment(date).startOf('day').toDate();
            end = moment(date).endOf('day').toDate();
        } else if (startDate && endDate) {
            start = moment(startDate).startOf('day').toDate();
            end = moment(endDate).endOf('day').toDate();
        } else if (month && year) {
            start = moment().year(year).month(month - 1).startOf('month').toDate();
            end = moment().year(year).month(month - 1).endOf('month').toDate();
        } else if (year) {
            start = moment().year(year).startOf('year').toDate();
            end = moment().year(year).endOf('year').toDate();
        } else {
            // Default to current month for overview if no filters provided
            start = moment().startOf('month').toDate();
            end = moment().endOf('month').toDate();
        }

        matchQuery.createdAt = { $gte: start, $lte: end };

        // 1. Overview Summary Cards (Matched to period)
        const stats = await Promise.all([
            Order.countDocuments(matchQuery),
            User.countDocuments({ role: 'customer' }),
            Product.countDocuments({}),
            Order.aggregate([
                { $match: matchQuery },
                { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
            ]),
            Order.countDocuments({ ...matchQuery, status: 'pending' }),
            Order.countDocuments({ ...matchQuery, status: 'delivered' }),
            Order.countDocuments({ ...matchQuery, status: 'cancelled' }),
            // Also get some comparison stats (hardcoded for context)
            Order.find({ createdAt: { $gte: moment().startOf('day').toDate() }, isPaid: true }),
            Order.find({ createdAt: { $gte: moment().startOf('week').toDate() }, isPaid: true }),
            Order.find({ createdAt: { $gte: moment().startOf('month').toDate() }, isPaid: true })
        ]);

        const totalRevenue = stats[3][0] ? stats[3][0].totalSales : 0;
        const todaySales = stats[7].reduce((sum, o) => sum + o.totalPrice, 0);
        const weeklySales = stats[8].reduce((sum, o) => sum + o.totalPrice, 0);
        const monthlySales = stats[9].reduce((sum, o) => sum + o.totalPrice, 0);

        // 2. Low Stock Count
        const lowStockProducts = await Product.find({
            'variants.countInStock': { $lt: 10 }
        }).limit(20);

        // 3. Product Analytics (Matched to period, ONLY real products)
        const productAnalytics = await Order.aggregate([
            { $match: matchQuery },
            { $unwind: '$orderItems' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderItems.product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $group: {
                    _id: '$orderItems.product',
                    name: { $first: '$orderItems.name' },
                    totalSold: { $sum: '$orderItems.qty' },
                    revenue: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } }
                }
            },
            { $sort: { totalSold: -1 } }
        ]);

        const topSelling = productAnalytics.slice(0, 10);
        const leastSelling = productAnalytics.slice(-10).reverse();

        // 4. Category-wise Sales (Matched to period)
        const categorySales = await Order.aggregate([
            { $match: matchQuery },
            { $unwind: '$orderItems' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderItems.product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'productDetails.category',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },
            { $unwind: '$categoryDetails' },
            {
                $group: {
                    _id: '$categoryDetails.name',
                    totalSales: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } }
                }
            }
        ]);

        // Out of stock & Returns (ONLY real products)
        const outOfStock = await Product.find({ 'variants.countInStock': { $eq: 0 } });

        // Location-wise Analytics (Sales, Delivered, Cancelled)
        const locationStats = await Order.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: {
                        pincode: '$shippingAddress.postalCode',
                        city: '$shippingAddress.city'
                    },
                    sales: { $sum: '$totalPrice' },
                    orders: { $sum: 1 },
                    delivered: {
                        $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
                    },
                    cancelled: {
                        $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
                    }
                }
            }
        ]);

        // Integrate Returns into Location Stats
        const returnStats = await ReturnReplace.aggregate([
            { $match: { type: 'return' } },
            {
                $lookup: {
                    from: 'orders',
                    localField: 'order',
                    foreignField: '_id',
                    as: 'orderDetails'
                }
            },
            { $unwind: '$orderDetails' },
            {
                $group: {
                    _id: {
                        pincode: '$orderDetails.shippingAddress.postalCode',
                        city: '$orderDetails.shippingAddress.city'
                    },
                    returns: { $sum: 1 }
                }
            }
        ]);

        const locationAnalytics = locationStats.map(stat => {
            const ret = returnStats.find(r => r._id.pincode === stat._id.pincode) || { returns: 0 };
            return {
                pincode: stat._id.pincode,
                city: stat._id.city,
                sales: stat.sales,
                orders: stat.orders,
                delivered: stat.delivered,
                cancelled: stat.cancelled,
                returns: ret.returns
            };
        });

        const mostReturned = await ReturnReplace.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'originalItem.product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            { $group: { _id: '$originalItem.product', name: { $first: '$originalItem.name' }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            overview: {
                totalRevenue,
                todaySales,
                weeklySales,
                monthlySales,
                totalOrders: stats[0],
                totalCustomers: stats[1],
                totalProducts: stats[2],
                pendingOrders: stats[4],
                deliveredOrders: stats[5],
                cancelledOrders: stats[6],
                lowStockCount: lowStockProducts.length
            },
            productAnalytics: {
                topSelling,
                leastSelling,
                outOfStock,
                categorySales,
                mostReturned
            },
            inventory: {
                lowStockProducts
            },
            locationAnalytics
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

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

// @desc    Get sales analytics with flexible filtering
// @route   GET /api/analytics/daily
// @access  Private/Admin
exports.getDailyAnalytics = async (req, res) => {
    const { month, year, date, startDate, endDate } = req.query;
    try {
        let matchQuery = { isPaid: true };
        let start, end;
        let groupBy = { day: { $dayOfMonth: '$createdAt' }, month: { $month: '$createdAt' }, year: { $year: '$createdAt' } };

        if (date) {
            start = moment(date).startOf('day').toDate();
            end = moment(date).endOf('day').toDate();
        } else if (startDate && endDate) {
            start = moment(startDate).startOf('day').toDate();
            end = moment(endDate).endOf('day').toDate();
        } else if (month && year) {
            start = moment().year(year).month(month - 1).startOf('month').toDate();
            end = moment().year(year).month(month - 1).endOf('month').toDate();
        } else if (year) {
            start = moment().year(year).startOf('year').toDate();
            end = moment().year(year).endOf('year').toDate();
            // Group by month if only year is selected
            groupBy = { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } };
        } else {
            // Default to current month
            start = moment().startOf('month').toDate();
            end = moment().endOf('month').toDate();
        }

        matchQuery.createdAt = { $gte: start, $lte: end };

        const analytics = await Order.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: groupBy,
                    totalSales: { $sum: '$totalPrice' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        const totals = await Order.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totalPrice' },
                    orderCount: { $sum: 1 }
                }
            }
        ]);

        res.json({
            data: analytics,
            totals: totals[0] || { totalSales: 0, orderCount: 0 }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

