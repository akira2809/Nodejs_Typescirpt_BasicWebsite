const pool = require('../config/db');

// Lấy tất cả sản phẩm
async function getAllProducts() {
    try {
        const res = await pool.query(`
             SELECT p.* , c.name as categoryName
            FROM products p
            JOIN product_categories pc ON p.id = pc.product_id
            JOIN categories c ON pc.category_id = c.id`);
        return res.rows;
    } catch (err) {
        console.error('Error fetching products from DB:', err.message);
        throw err;
    }
}

// Lấy sản phẩm theo ID
async function getProductById(id) {
    try {
        const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        return res.rows[0];
    } catch (err) {
        console.error('Error fetching product by ID:', err.message);
        throw err;
    }
}

// Lấy tất cả danh mục
async function getCategory() {
    try {
        const res = await pool.query('SELECT * FROM categories');
        return res.rows;
    } catch (err) {
        console.error('Error fetching categories from DB:', err.message);
        throw err;
    }
}

// Lấy sản phẩm theo danh mục
async function getProductsByCategory(categoryId) {
    try {
        const res = await pool.query(`
            SELECT * 
            FROM products p
            JOIN product_categories pc ON p.id = pc.product_id
            JOIN categories c ON pc.category_id = c.id
            WHERE p.id = $1
        `, [categoryId]);
        return res.rows;
    } catch (err) {
        console.error('Error fetching products by category:', err.message);
        throw err;
    }
}

async function getOneProductsByCategory(categoryId) {
    try {
        const res = await pool.query(`
           SELECT p.* 
            FROM products p
            JOIN product_categories pc ON p.id = pc.product_id
            WHERE pc.category_id = $1
        `, [categoryId]);
        return res.rows;
    } catch (err) {
        console.error('Error fetching products by category:', err.message);
        throw err;
    }
}

async function getOneCategory(categoryId) {
    try {
        const res = await pool.query(`
           SELECT c.* 
            FROM categories c
            WHERE c.id = $1
        `, [categoryId]);
        return res.rows;
    } catch (err) {
        console.error('Error fetching products by category:', err.message);
        throw err;
    }
}

// Tìm kiếm sản phẩm theo từ khóa trong tên sản phẩm
async function searchProducts(keyword) {
    try {
        const res = await pool.query(`
            SELECT * FROM products 
            WHERE name ILIKE $1
        `, [`%${keyword}%`]); // Tìm kiếm không phân biệt chữ hoa, chữ thường
        return res.rows;
    } catch (err) {
        console.error('Error searching products:', err.message);
        throw err;
    }
}

/* ====== CÁC HÀM MỚI THÊM ====== */

// 🆕 Thêm sản phẩm mới
async function createProduct(name, price, description, image, stock, categoryId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Kiểm tra category tồn tại
        if (categoryId) {
            const categoryExists = await client.query('SELECT id FROM categories WHERE id = $1', [categoryId]);
            if (categoryExists.rows.length === 0) {
                throw new Error('Category does not exist');
            }
        } else {
            throw new Error('Category ID is required');
        }

        // Thêm sản phẩm
        const productResult = await client.query(`
            INSERT INTO products (name, price, description, image, stock, category_id) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *
        `, [name, price, description, image, stock, categoryId]);

        // Thêm vào bảng product_categories
        await client.query(`
            INSERT INTO product_categories (product_id, category_id) 
            VALUES ($1, $2)
        `, [productResult.rows[0].id, categoryId]);

        await client.query('COMMIT');
        return productResult.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating product:', err.message);
        throw err;
    } finally {
        client.release();
    }
}


async function updateProduct(id, name, price, description, image, stock, categoryId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Kiểm tra sản phẩm tồn tại
        const checkProduct = await client.query('SELECT * FROM products WHERE id = $1', [id]);
        if (checkProduct.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        // Cập nhật thông tin sản phẩm
        const updateProductQuery = `
            UPDATE products 
            SET name = $1, price = $2, description = $3, image = $4, stock = $5
            WHERE id = $6 RETURNING *
        `;
        const productRes = await client.query(updateProductQuery, 
            [name, price, description, image, stock, id]
        );

        // Cập nhật category trong bảng product_categories
        if (categoryId) {
            // Xóa category cũ
            await client.query('DELETE FROM product_categories WHERE product_id = $1', [id]);
            
            // Thêm category mới
            await client.query(
                'INSERT INTO product_categories (product_id, category_id) VALUES ($1, $2)',
                [id, categoryId]
            );
        }

        await client.query('COMMIT');
        return productRes.rows[0];

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error updating product:', err.message);
        throw err;
    } finally {
        client.release();
    }
}




// 🆕 Xóa sản phẩm
async function deleteProduct(id) {
    try {
        const res = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        return res.rows[0];
    } catch (err) {
        console.error('Error deleting product:', err.message);
        throw err;
    }
}

// Thêm danh mục mới
async function createCategory(name) {
    try {
        const res = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
        return res.rows[0];
    } catch (err) {
        console.error('Error creating category:', err);
        throw err;
    }
}

// Cập nhật danh mục
async function updateCategory(id, name) {
    try {
        const res = await pool.query('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
        return res.rows[0];
    } catch (err) {
        console.error('Error updating category:', err);
        throw err;
    }
}

// Xóa danh mục (Kiểm tra trước khi xóa)
async function deleteCategory(id) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Kiểm tra nếu danh mục có sản phẩm
        const checkRes = await client.query('SELECT COUNT(*) FROM product_categories WHERE category_id = $1', [id]);
        if (parseInt(checkRes.rows[0].count) > 0) {
            throw new Error('Cannot delete category with associated products');
        }

        const res = await client.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
        await client.query('COMMIT');
        return res.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error deleting category:', err);
        throw err;
    } finally {
        client.release();
    }
}



module.exports = {
    getAllProducts,
    getProductById,
    getCategory,
    getProductsByCategory,
    getOneProductsByCategory,
    getOneCategory,
    searchProducts,
    createProduct,  // 🆕 Thêm sản phẩm
    updateProduct,  // 🆕 Cập nhật sản phẩm
    deleteProduct,  // 🆕 Xóa sản phẩm
    createCategory, // 🆕 Thêm danh mục
    updateCategory, // 🆕 Cập nhật danh mục
    deleteCategory, // 🆕 Xóa danh mục
    getProductById
};


