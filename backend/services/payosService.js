// services/payosService.js
require('dotenv').config();
const PayOS = require('@payos/node');

const payos = new PayOS(
    process.env.PAYOS_CLIENT_KEY,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
);

const createPayment = async (order) => {
    try {
        const response = await payos.createPayment(order);
        return response;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
};

module.exports = { createPayment };
