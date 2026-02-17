const User = require('../models/User');
const Product = require('../models/Product');

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(
      (p) => p.toString() !== req.params.productId
    );
    await user.save();
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
