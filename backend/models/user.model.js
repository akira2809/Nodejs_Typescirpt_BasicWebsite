const pool = require('../config/db');

exports.getAll = (callback) => {
    const query = 'SELECT * FROM users';
    pool.query(query, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results.rows); // PostgreSQL trả về dữ liệu trong `rows`
        }
    });
};

exports.create = (user, callback) => {
    const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
    const values = [user.name, user.email];

    pool.query(query, values, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results.rows[0]); // Trả về bản ghi được tạo
        }
    });
};
