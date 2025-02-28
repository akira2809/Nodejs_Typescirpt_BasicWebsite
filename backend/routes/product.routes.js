const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const orderController = require('../controllers/order.controller');

// Route để lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);

// Route để lấy sản phẩm theo ID
router.get('/:id', productController.getProductById);

// Route lấy tất cả danh mục
router.get("/category", productController.getCategory);

// Route để lấy sản phẩm theo danh mục
router.get("/category/:categoryId", productController.getOneProductsByCategory);


router.get('/search', productController.searchProducts);

router.post('/orders/create', orderController.createOrder);

router.get('/orders/:id', orderController.getOrderDetails);

// Thêm sản phẩm mới (upload ảnh)
router.post('/create', productController.createProduct);

// Cập nhật sản phẩm (upload ảnh)
router.put('/update/:id', productController.updateProduct);

// Xóa sản phẩm
router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;
