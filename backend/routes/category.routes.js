const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/product.controller');

// 🔹 Lấy tất cả danh mục
router.get('/category', categoryController.getCategory);

// 🔹 Lấy một danh mục theo ID
router.get('/:id', categoryController.getOneCategory);

// 🔹 Lấy sản phẩm theo category_id
router.get('/product/:id', categoryController.getProductsByCategory);

// 🔹 Thêm danh mục mới
router.post('/add', categoryController.createCategory);

// 🔹 Cập nhật danh mục
router.put('/update/:id', categoryController.updateCategory);

// 🔹 Xóa danh mục
router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;
