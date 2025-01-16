const { Pool } = require('pg'); // Import Pool từ pg
require('dotenv').config();

// Tạo Pool kết nối PostgreSQL
const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PG_PORT,
});

// Kiểm tra kết nối
pool.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err.stack);
    } else {
        console.log('Connected to PostgreSQL database.');
    }
});

// Export pool để sử dụng ở các file khác
module.exports = pool;
