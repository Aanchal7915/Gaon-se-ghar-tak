// src/middlewares/uploadMiddleware.js
const multer = require('multer');

// Configure Multer to store uploaded files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;