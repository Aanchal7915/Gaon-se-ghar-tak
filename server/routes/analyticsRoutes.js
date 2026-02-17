// src/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/today', protect, admin, analyticsController.getTodayAnalytics);
router.get('/monthly', protect, admin, analyticsController.getMonthlyAnalytics);
router.get('/daily', protect, admin, analyticsController.getDailyAnalytics); // New route

module.exports = router;