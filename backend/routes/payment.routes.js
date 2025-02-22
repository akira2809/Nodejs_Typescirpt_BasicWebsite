// routes/paymentRoutes.js
const express = require('express');
const { 
    createPaymentHandler, 
    getPaymentInfoHandler, 
    cancelPaymentHandler, 
    updateWebhookHandler 
} = require('../controllers/payment.controller');

const router = express.Router();

// Route để tạo thanh toán
router.post('/create-payment', createPaymentHandler);

// // Route để lấy thông tin thanh toán
// router.get('/payment-info/:paymentId', getPaymentInfoHandler);

// // Route để hủy thanh toán
// router.post('/cancel-payment', cancelPaymentHandler);

// // Route để cập nhật webhook
// router.post('/update-webhook', updateWebhookHandler);

module.exports = router;
