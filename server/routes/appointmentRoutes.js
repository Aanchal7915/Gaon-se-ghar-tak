const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', appointmentController.createAppointment);
router.get('/', protect, admin, appointmentController.getAppointments);

module.exports = router;
