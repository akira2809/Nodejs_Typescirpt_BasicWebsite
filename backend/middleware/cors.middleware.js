const cors = require("cors");

const allowedOrigins = [
  "http://127.0.0.1:5501",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  process.env.CLIENT_URL, // Load từ biến môi trường nếu có
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);
