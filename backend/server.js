const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRouter = require('./routes/user.routes'); // Import route cho user
const productRouter = require('./routes/product.routes'); // Import route cho product

const app = express();

// Sử dụng middleware để xử lý JSON
app.use(cors());
app.use(express.json());

// Sử dụng các route
app.use('/users', userRouter); // Route cho user
app.use('/products', productRouter); // Route cho product

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
