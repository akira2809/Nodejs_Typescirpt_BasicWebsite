require("dotenv").config();
const PayOS = require("@payos/node");

console.log("🔍 PAYOS_CLIENT_ID:", process.env.PAYOS_CLIENT_ID);
console.log("🔍 PAYOS_API_KEY:", process.env.PAYOS_API_KEY);
console.log("🔍 PAYOS_CHECKSUM_KEY:", process.env.PAYOS_CHECKSUM_KEY);

const payos = new PayOS(
    process.env.PAYOS_CLIENT_ID, // Đảm bảo dùng CLIENT_ID (không phải CLIENT_KEY)
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
);

const createPayment = async (order) => {
    try {
        console.log("🛠 Debug - Order gửi đến PayOS:", JSON.stringify(order, null, 2));

        if (!order || !order.amount || !order.orderCode) {
            throw new Error("🛑 Thiếu dữ liệu cần thiết cho thanh toán!");
        }

        const response = await payos.createPaymentLink(order);
        console.log("✅ Debug - Phản hồi từ PayOS:", response);
        return response;
    } catch (error) {
        console.error("❌ Lỗi khi tạo thanh toán:", error.response?.data || error.message);
        throw error;
    }
};

module.exports = { createPayment };
