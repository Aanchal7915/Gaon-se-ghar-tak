// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/recent', productController.getRecentProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/bestseller', productController.getBestsellerProducts);

router.get('/gender/:gender', productController.getProductsByGender);
router.get('/search', productController.searchProducts);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, admin, upload.array('images', 10), productController.createProduct);
router.put('/:id', protect, admin, upload.array('images', 10), productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/subcategory/:subCategory', productController.getProductsBySubCategory);


module.exports = router;