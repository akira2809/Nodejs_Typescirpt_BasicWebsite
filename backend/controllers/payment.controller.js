// controllers/paymentController.js
const { createPayment } = require('../services/payosService');
const productModel = require('../models/product.model');

const createPaymentHandler = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        // Kiểm tra sản phẩm có tồn tại không
        const product = await productModel.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Tạo đơn hàng thanh toán
        const order = {
            amount: product.price * quantity,
            description: `Purchase of ${product.name}`,
            orderInfo: { productId, quantity }
        };
        
        const paymentResponse = await createPayment(order);
        res.json(paymentResponse);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create payment' });
    }
};

module.exports = { createPaymentHandler };
