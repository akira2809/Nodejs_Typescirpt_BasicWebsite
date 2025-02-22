const pool = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * Lấy danh sách tất cả người dùng
 * @returns {Promise<Array>} Danh sách users từ database
 */
async function getAllUsers() {
    try {
        const res = await pool.query('SELECT * FROM users');
        return res.rows;
    } catch (err) {
        console.error('❌ Error fetching users:', err.message);
        throw new Error('Database error: Failed to fetch users.');
    }
}

/**
 * Tạo một người dùng mới
 * @param {Object} user - Thông tin user (username, email, password)
 * @returns {Promise<Object>} Người dùng đã được tạo
 */
async function createUser(user) {
    try {
        // Kiểm tra email có tồn tại không
        const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [user.email]);
        if (emailCheck.rows.length > 0) {
            return { error: 'Email already exists' }; // Trả về lỗi thay vì throw
        }

        // Hash mật khẩu (bất đồng bộ)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Chèn dữ liệu vào DB
        const res = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [user.username, user.email, hashedPassword]
        );

        return res.rows[0]; // Trả về user mới
    } catch (err) {
        console.error('❌ Error creating user:', err.message);
        throw new Error('Database error: Failed to create user.');
    }
}
async function checkUser(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    return await pool.query(query, [email]);
}

async function login(email, password) {
    const query = "SELECT * FROM users WHERE email = $1";
    const res = await pool.query(query, [email]);
    const user = res.rows[0];

    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    return user;
}

/**
 * Lưu token reset mật khẩu vào DB
 */
    async function getUserByEmail(email){
        const query =`SELECT * from users where email = $1`;
       let user = await pool.query(query, [email]);
       return user.rows[0]
    }

async function activeAccount(email) {
    const query = `UPDATE users SET status = 'active' where email = $1`;
    await pool.query(query, [ email]);
}
    
async function saveResetToken(email, token){
        const query = `UPDATE users SET reset_token = $1 where email =$2`;
        await pool.query(query, [ token,email]);
}

async function updatePassword(email , password){
    // Hash mật khẩu (bất đồng bộ)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const query = `UPDATE users SET password = $1 where email =$2`
    await pool.query(query, [ hashedPassword,email]);
    
}

module.exports = {
    getAllUsers,
    createUser,
    checkUser,
    login,
    activeAccount,
    getUserByEmail,
    saveResetToken,
    updatePassword,
};
