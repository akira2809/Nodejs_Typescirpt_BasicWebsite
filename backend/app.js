const express = require("express");
const path = require("path");
require("dotenv").config();

// Import middleware
const corsMiddleware = require("./middleware/cors.middleware");
const loggerMiddleware = require("./middleware/log.middleware");
const errorMiddleware = require("./middleware/error.middleware");

// Import routes
const userRouter = require("./routes/user.routes");
const productRouter = require("./routes/product.routes");
const categoryRouter = require("./routes/category.routes");
const paymentRouter = require("./routes/payment.routes");


const app = express();

// Cấu hình thư mục public để phục vụ các tệp tĩnh
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(loggerMiddleware);
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/payment", paymentRouter);


// Middleware xử lý lỗi
app.use(errorMiddleware);

module.exports = app;
