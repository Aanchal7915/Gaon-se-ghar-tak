const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
    try {
        const { name, phone, preferredDate, preferredTime, message } = req.body;
        const appointment = new Appointment({
            name, phone, preferredDate, preferredTime, message
        });
        await appointment.save();
        res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
