// routes/product.routes.js
const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
} = require('../controllers/product.controller');

// Các route cho sản phẩm
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);

module.exports = router;
