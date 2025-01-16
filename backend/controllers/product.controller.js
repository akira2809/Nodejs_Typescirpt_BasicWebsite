const pool = require('../config/db');

async function getAllProducts(req, res) {
    try {
        const results = await pool.query('SELECT * FROM products');
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).send(error.message);
    }
}
async  function getProducts(req, res) {
    try {
        const results = await pool.query('SELECT * FROM products where id =1');
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).send(error.message);
    }
}

module.exports = { getAllProducts  , getProducts};
