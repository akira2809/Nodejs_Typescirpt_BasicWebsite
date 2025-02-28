const db = require('../config/db');

const Order = {
  createOrder: async (user_id, total_amount) => {
    const result = await db.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id',
      [user_id, total_amount, 'pending']
    );
    return result.rows[0].id;
  },

  getOrderById: async (id) => {
    const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    return result.rows[0];
  },
};


module.exports = Order;
