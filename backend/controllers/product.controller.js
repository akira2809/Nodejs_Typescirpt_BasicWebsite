// controllers/product.controller.js
const productModel = require('../models/product.model');

// Lấy tất cả sản phẩm
async function getAllProducts(req, res) {
    try {
        const products = await productModel.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).send(error.message);
    }
}

// Lấy sản phẩm theo ID
async function getProductById(req, res) {
    const productId = req.params.id;
    try {
        const product = await productModel.getProductById(productId);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).send(error.message);
    }
}

module.exports = {
    getAllProducts,
    getProductById,
};
