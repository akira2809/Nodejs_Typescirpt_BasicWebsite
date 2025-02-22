const app = require('./app'); // Import từ app.js
require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
