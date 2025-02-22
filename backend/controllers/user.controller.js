const { sendOTP, sendVerifyEmail , sendNewPassword } = require("../services/mailer");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { verifyToken, createToken } = require("../middleware/auth");

const SECRET_KEY = process.env.SECRET_KEY;
// Thay bằng key bí mật thật

/**
 * Lấy tất cả người dùng
 */
async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Tạo người dùng mới
 */
async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra thiếu dữ liệu
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Gọi model để tạo user
    const result = await userModel.createUser({ username, email, password });
    const token = createToken({ email: email }, "1h");
    await sendVerifyEmail(email, token);
    // Kiểm tra nếu email đã tồn tại
    if (result.error) {
      return res.status(409).json({ message: result.error });
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("❌ Error creating user:", error.message);

    // Xử lý lỗi PostgreSQL (email đã tồn tại)
    if (error.code === "23505") {
      return res.status(409).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
}

async function checkUser(req, res) {
  try {
    const email = req.query.email; // Lấy email từ query params

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    console.log("Checking email:", email);

    const user = await userModel.checkUser(email);
    console.log("User:", user.rows);
    if (user && user.rows.length > 0) {
      return res.status(409).json({ user: user.rows });
    }

    res.status(200).json({ message: "Available" });
  } catch (error) {
    console.error("❌ Error checking user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Đăng nhập người dùng
 */
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await userModel.login(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Tạo JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ 
      message: "Login successful", 
      token, 
      user_id: user.id  // Thêm user_id vào response
    });
  } catch (error) {
    console.error("❌ Error logging in:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
    const decoded = verifyToken(token);
    // console.log(decoded)
    await userModel.activeAccount(decoded.email);

    res.status(200).json({ message: "tài khoản được kích hoạt " });
  } catch (error) {
    console.error("❌ Error verifying email:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function forgotPassword(req, res) {
  const { email } = req.body;
  const issetUser = await userModel.getUserByEmail(email);
  console.log(issetUser);
  if (!issetUser) {
    return res.json({ message: "email khong ton tai" });
  }
  const code = generateCode();
  const token = createToken({ email, code });
  await sendOTP(email, code);
  await userModel.saveResetToken(email, token);
  res.json({ message: "đã gửi về mail bạn", token: token });
}
async function checkCode(req, res) {
  const { token, code } = req.body;
  const decoded = verifyToken(token);
  if (decoded.code == code) {
    let newPassword = generateRandomPassword(12);
    await userModel.updatePassword(decoded.email, newPassword);
    await sendNewPassword(decoded.email, newPassword);
    return res.json({message: "mat khau moi ve mail cua ban"});
  }
  res.json({message: "mã không đúng "})
}
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000);
}
const generateRandomPassword = (length = 12) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
};


module.exports = {
  getAllUsers,
  createUser,
  checkUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  checkCode,
};
