// models/product.model.js
const pool = require('../config/db'); // Kết nối với PostgreSQL Pool

// Lấy tất cả sản phẩm
async function getAllProducts() {
    try {
        const result = await pool.query('SELECT * FROM products');
        return result.rows;
    } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
    }
}

// Lấy một sản phẩm theo ID
async function getProductById(id) {
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        return result.rows[0]; // Trả về sản phẩm đầu tiên (nếu có)
    } catch (error) {
        throw new Error('Error fetching product: ' + error.message);
    }
}
module.exports = {
    getAllProducts,
    getProductById,
};
