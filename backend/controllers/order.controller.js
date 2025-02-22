const Order = require('../models/order.model');
const { OrderItem, getItemsByOrderId } = require('../models/orderitem.model');

exports.createOrder = async (req, res) => {
  try {
    const { user_id, total_amount, items } = req.body;

    if (!user_id || !total_amount || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
    }

    // 1️⃣ Tạo đơn hàng
    const orderId = await Order.createOrder(user_id, total_amount);

    // 2️⃣ Thêm từng sản phẩm vào order_items
    await Promise.all(items.map(item =>
      OrderItem.addOrderItem(orderId, item.product_id, item.quantity, item.price)
    ));

    res.status(201).json({ message: 'Đơn hàng đã được tạo thành công', order_id: orderId });
  } catch (error) {
    console.error('❌ Lỗi khi tạo đơn hàng:', error);
    res.status(500).json({ error: 'Lỗi server khi tạo đơn hàng' });
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
    const items = await getItemsByOrderId(orderId);

    res.json({ order, items });
  } catch (error) {
    console.error('❌ Lỗi khi lấy chi tiết đơn hàng:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy đơn hàng' });
  }
};
