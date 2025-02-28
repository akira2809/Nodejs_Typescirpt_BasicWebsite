const express = require("express");
const router = express.Router();
const cartController = require("../controllers/order.controller");

router.post("/add", cartController.addToCart);
router.get("/", cartController.getCart);

// Tạo đơn hàng + trả về URL thanh toán
router.post("/create", cartController.createOrder);

// Lấy chi tiết đơn hàng
router.get("/:id", cartController.getOrderDetails);

module.exports = router;
