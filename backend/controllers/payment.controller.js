// controllers/paymentController.js
const { createPayment } = require('../services/payosService');
const productModel = require('../models/product.model');
const orderModel = require('../models/order.model');

const createPaymentHandler = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        // Kiểm tra sản phẩm có tồn tại không
        const product = await productModel.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Tạo đơn hàng trong database
        const orderData = {
            productId,
            quantity,
            amount: product.price * quantity,
            status: 'pending' // Trạng thái chờ thanh toán
        };
        const order = await orderModel.createOrder(orderData);

        // Tạo đơn hàng thanh toán PayOS
        const payosOrder = {
            amount: order.amount,
            description: `Purchase of ${product.name}`,
            returnUrl: `http://localhost:3000/payment-success?orderId=${order.id}`, // Redirect sau khi thanh toán thành công
            cancelUrl: `http://localhost:3000/payment-failed?orderId=${order.id}`,
            orderInfo: { orderId: order.id, productId, quantity }
        };

        const paymentResponse = await createPayment(payosOrder);

        // Trả về link thanh toán để frontend redirect
        res.json({ paymentUrl: paymentResponse.checkoutUrl });

    } catch (error) {
        res.status(500).json({ error: 'Failed to create payment' });
    }
};

module.exports = { createPaymentHandler };
