// const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOTP = async (email, otp) => {
  const msg = {
    to: email,
    from: {
      email: process.env.EMAIL_FROM,
      name: process.env.FROM_NAME,
    },
    subject: 'Your OTP for Gaon Se Ghar Tak',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h1 style="color: #2c3e50; text-align: center;">Your One-Time Password</h1>
        <div style="background-color: #f7f9fb; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <p style="font-size: 16px; color: #555;">Use the following OTP to verify your account:</p>
          <h2 style="font-size: 32px; color: #3498db; letter-spacing: 5px; margin: 10px 0;">${otp}</h2>
          <p style="font-size: 14px; color: #888;">This OTP is valid for 10 minutes.</p>
        </div>
        <p style="font-size: 14px; color: #777; line-height: 1.6;">
          If you did not request this OTP, please ignore this email.
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          Gaon Se Ghar Tak - Connecting you to your roots.
        </p>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    console.log('OTP Email sent successfully via SendGrid');
  } catch (error) {
    console.error('SendGrid email error:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw new Error('Failed to send OTP email.');
  }
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
