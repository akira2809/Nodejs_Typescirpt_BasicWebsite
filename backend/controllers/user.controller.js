const pool = require('../config/db');

// Lấy tất cả người dùng
async function getAllUsers(req, res) {
    try {
        const results = await pool.query('SELECT * FROM users');
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).send(error.message);
    }
}

module.exports = { getAllUsers };
