// src/services/otpService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Rohtak Shoes E-commerce',
    html: `
      <h1>Your One-Time Password</h1>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
    `
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };

// {
//   "name": "server",
//   "version": "1.0.0",
//   "main": "server.js",
//   "scripts": {
//     "start": "node src/server.js",
//     "dev": "nodemon src/server.js"
//   },
//   "keywords": [],
//   "author": "",
//   "license": "ISC",
//   "description": "",
//   "dependencies": {
//     "bcryptjs": "^3.0.2",
//     "cloudinary": "^2.7.0",
//     "cookie-parser": "^1.4.7",
//     "dotenv": "^17.2.2",
//     "express": "^5.1.0",
//     "jsonwebtoken": "^9.0.2",
//     "moment": "^2.30.1",
//     "mongoose": "^8.18.1",
//     "multer": "^2.0.2",
//     "nodemailer": "^7.0.6",
//     "razorpay": "^2.9.6",
//     "socket.io": "^4.8.1"
//   },
//   "devDependencies": {
//     "nodemon": "^3.1.10"
//   }
// }
