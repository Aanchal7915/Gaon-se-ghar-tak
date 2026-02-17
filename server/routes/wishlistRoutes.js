// src/routes/wishlistRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishlistController");

router.get("/", protect, getWishlist);
router.post("/:productId", protect, addToWishlist);
router.delete("/:productId", protect, removeFromWishlist);

module.exports = router;
