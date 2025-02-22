const db = require('../config/db');

const OrderItem = {
  addOrderItem: async (order_id, product_id, quantity, price) => {
    try {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order_id, product_id, quantity, price]
      );
    } catch (error) {
      console.error('Lỗi khi thêm order item:', error);
      throw new Error('Không thể thêm sản phẩm vào đơn hàng');
    }
  }
};

const getItemsByOrderId = async (order_id) => {
  try {
    const result = await db.query(
      `SELECT oi.id, oi.order_id, oi.product_id, p.name AS product_name, oi.quantity, oi.price
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách order items:', error);
    throw new Error('Không thể lấy danh sách sản phẩm');
  }
};

module.exports = { OrderItem, getItemsByOrderId };
