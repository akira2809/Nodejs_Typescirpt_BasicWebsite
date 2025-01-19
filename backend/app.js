const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRouter = require('./routes/user.routes');
const productRouter = require('./routes/product.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRouter);
app.use('/products', productRouter);

module.exports = app; // Export ứng dụng để sử dụng ở nơi khác
