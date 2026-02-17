
const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { protect, admin, deliveryPerson } = require('../middlewares/authMiddleware');

// Admin routes
router.post('/assign', protect, admin, deliveryController.assignOrderToDelivery);
router.get('/pending', protect, admin, deliveryController.getPendingDeliveries);

// Delivery Person routes
router.post('/location', protect, deliveryPerson, deliveryController.updateLiveLocation);
router.get('/my-deliveries', protect, deliveryPerson, deliveryController.getAssignedDeliveries); 

// Add the new route for sending OTP
router.post('/send-otp', protect, deliveryPerson, deliveryController.sendDeliveryOtp);
// You also need a route to update the status after OTP verification
router.post('/update-status', protect, deliveryPerson, deliveryController.updateDeliveryStatus);



// New route for delivered orders
router.get('/delivered-orders', protect, deliveryPerson, deliveryController.getDeliveredOrders); // Line 16

// Admin-specific route for updating delivery status
router.post(
  '/admin/update-status/:id',
  protect,
  admin,
  deliveryController.adminUpdateDeliveryStatus
);

router.get(
  '/cancelled-orders',
  protect,
  deliveryPerson,
  deliveryController.getCancelledOrders
);


module.exports = router;