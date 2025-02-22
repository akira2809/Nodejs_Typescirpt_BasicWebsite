const express = require("express");
const router = express.Router();
const cartController = require("../controllers/order.controller");

router.post("/add", cartController.addToCart);
router.get("/", cartController.getCart);

module.exports = router;
