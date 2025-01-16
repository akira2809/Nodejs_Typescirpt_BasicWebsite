const express = require('express');
const { getAllUsers } = require('../controllers/user.controller');

const router = express.Router();

// Route lấy danh sách người dùng
router.get('/', getAllUsers);

module.exports = router;
