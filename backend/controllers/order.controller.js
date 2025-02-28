const Order = require('../models/order.model');
const { OrderItem } = require('../models/orderitem.model');
const { createPayment } = require('../services/payosService');

exports.createOrder = async (req, res) => {
    try {
        const { user_id, total_amount, items } = req.body;

        if (!user_id || !total_amount || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
        }

        // 1️⃣ Tạo đơn hàng trong DB
        const orderId = await Order.createOrder(user_id, total_amount);
        const orderCode = Number(orderId); // Chuyển orderId thành số

        // Kiểm tra orderCode có hợp lệ không
        if (!Number.isInteger(orderCode) || orderCode <= 0 || orderCode > 9007199254740991) {
            return res.status(400).json({ error: "Mã đơn hàng không hợp lệ" });
        }

        // 2️⃣ Lưu sản phẩm vào order_items
        await Promise.all(items.map(item =>
            OrderItem.addOrderItem(orderId, item.product_id, item.quantity, item.price)
        ));

        // 3️⃣ Gọi PayOS để tạo thanh toán
        const paymentData = {
            orderCode,  // Giữ nguyên dạng số
            amount: Math.round(total_amount), // Đảm bảo amount là số nguyên
            description: `Thanh toán đơn hàng #${orderCode}`,
            returnUrl: "http://127.0.0.1:5501/frontend/html/index.html",
            cancelUrl: "http://127.0.0.1:5501/frontend/html/ProductbyCate.html?category=1",
        };

        console.log("🛠 Debug - Gửi dữ liệu đến PayOS:", JSON.stringify(paymentData, null, 2));
        const paymentResponse = await createPayment(paymentData);

        if (paymentResponse.checkoutUrl) {
            res.status(201).json({
                message: "Đơn hàng đã được tạo thành công",
                order_id: orderId,
                payment_url: paymentResponse.checkoutUrl
            });
        } else {
            res.status(500).json({ error: "Không thể tạo thanh toán PayOS" });
        }
    } catch (error) {
        console.error("❌ Lỗi khi tạo đơn hàng:", error);
        res.status(500).json({ error: "Lỗi server khi tạo đơn hàng" });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;

        if (!orderId) {
            return res.status(400).json({ error: 'Thiếu order ID' });
        }

        // 1️⃣ Lấy thông tin đơn hàng
        const order = await Order.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        }

        // 2️⃣ Lấy danh sách sản phẩm trong đơn hàng
        const items = await OrderItem.getItemsByOrderId(orderId);
        if (!items || items.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm trong đơn hàng' });
        }

        return res.json({ order, items });
    } catch (error) {
        console.error('❌ Lỗi khi lấy chi tiết đơn hàng:', error);
        return res.status(500).json({ error: 'Lỗi server khi lấy đơn hàng' });
    }
};
