const express = require('express');
const { getAllProducts , getProducts} = require('../controllers/product.controller');

const router = express.Router();

// Route lấy danh sách sản phẩm
router.get('/', getAllProducts);
router.get('/getProducts', getProducts);

module.exports = router;
