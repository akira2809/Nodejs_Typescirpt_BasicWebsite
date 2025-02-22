const productModel = require('../models/product.model');
const upload = require('../middleware/multerMiddleware'); // Đường dẫn tới file cloudinar
// Lấy tất cả sản phẩm
async function getAllProducts(req, res) {
    try {
        const products = await productModel.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Lấy sản phẩm theo ID
async function getProductById(req, res) {
    const productId = req.params.id;
    try {
        const product = await productModel.getProductById(productId);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}


// Lấy sản phẩm theo danh mục
async function getProductsByCategory(req, res) {
    const { id } = req.params; // Lấy categoryId từ query param

    try {
        const products = await productModel.getProductsByCategory(id);
        if (products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(404).json({ message: 'No products found for this category' });
        }
    } catch (error) {
        console.error('Error fetching products by category:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}
// Tìm kiếm sản phẩm theo từ khóa
async function searchProducts(req, res) {
    const keyword = req.query.q; // Lấy từ khóa từ query string (?q=...)

    if (!keyword) {
        return res.status(400).json({ message: 'Missing search keyword' });
    }

    try {
        const products = await productModel.searchProducts(keyword);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching products:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getOneProductsByCategory(req, res) {
    const { categoryId } = req.params; // Lấy categoryId từ query param

    try {
        const products = await productModel.getOneProductsByCategory(categoryId);
        // console.log(products);
        if (products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(404).json({ message: 'No products found for this category' });
        }
    } catch (error) {
        console.error('Error fetching products by category:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function getOneCategory(req, res) {
    const { id } = req.params; // Lấy categoryId từ query param

    try {
        const products = await productModel.getOneCategory(id);
        // console.log(products);
        if (products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(404).json({ message: 'No products found for this category' });
        }
    } catch (error) {
        console.error('Error fetching products by category:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}
// Lấy tất cả danh mục
async function getCategory(req, res) {
    try {
        const categories = await productModel.getCategory();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}
// 🔹 Thêm danh mục mới
async function createCategory(req, res) {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Name is required' });

        const category = await productModel.createCategory(name);
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 🔹 Cập nhật danh mục
async function updateCategory(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Category name is required" });
    }

    try {
        const updatedCategory = await productModel.updateCategory(id, name);

        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json(updatedCategory);
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: "Internal server error" });
    }
}


// 🔹 Xóa danh mục
async function deleteCategory(req, res) {
    const { id } = req.params;

    try {
        const deletedCategory = await productModel.deleteCategory(id);

        if (!deletedCategory) {
            return res.status(404).json({ error: "Category not found or cannot be deleted" });
        }

        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Thêm sản phẩm mới (bao gồm ảnh)
async function createProduct(req, res) {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ 
                    message: 'Error uploading image', 
                    error: err.message 
                });
            }

            const { name, price, description, stock, categoryId } = req.body;
            
            // Validate required fields
            if (!name || !price || !stock || !categoryId) {
                return res.status(400).json({ 
                    message: 'Name, price, stock and category ID are required' 
                });
            }

            // Validate numeric values
            if (isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
                return res.status(400).json({ 
                    message: 'Invalid price or stock value' 
                });
            }

            const image = req.file ? req.file.path : null;

            try {
                const newProduct = await productModel.createProduct(
                    name,
                    parseFloat(price),
                    description,
                    image,
                    parseInt(stock),
                    parseInt(categoryId)
                );

                return res.status(201).json({ 
                    message: 'Product created successfully', 
                    product: newProduct 
                });
            } catch (error) {
                if (error.message === 'Category does not exist') {
                    return res.status(400).json({ 
                        message: 'Invalid category ID' 
                    });
                }
                throw error;
            }
        });
    } catch (err) {
        console.error('Error creating product:', err.message);
        return res.status(500).json({ 
            message: 'Internal server error',
            error: err.message 
        });
    }
}
/// 🆕 Cập nhật sản phẩm (bao gồm ảnh)
async function updateProduct(req, res) {
    try {
        const { id } = req.params; // Lấy id từ params thay vì body
        
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ 
                    message: 'Error uploading image', 
                    error: err.message 
                });
            }

            const { name, price, description, stock, categoryId } = req.body;
            
            // Validate dữ liệu đầu vào
            if (!name || !price || !stock) {
                return res.status(400).json({ 
                    message: 'Name, price and stock are required' 
                });
            }

            // Validate giá trị số
            if (isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
                return res.status(400).json({ 
                    message: 'Invalid price or stock value' 
                });
            }

            let image = req.file ? req.file.path : null;

            // Lấy sản phẩm hiện tại
            const existingProduct = await productModel.getProductById(id);
            if (!existingProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Giữ lại ảnh cũ nếu không có ảnh mới
            if (!image) {
                image = existingProduct.image;
            }

            // Gọi hàm update từ model
            const updatedProduct = await productModel.updateProduct(
                id, 
                name, 
                price, 
                description, 
                image, 
                stock, 
                categoryId
            );

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            return res.status(200).json({ 
                message: 'Product updated successfully', 
                product: updatedProduct 
            });
        });
    } catch (err) {
        console.error('❌ Error updating product:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Xóa sản phẩm
async function deleteProduct(req, res) {
    const { id } = req.params;
    try {
        const deletedProduct = await productModel.deleteProduct(id);
        if (deletedProduct) {
            return res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        console.error('Error deleting product:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
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
    createCategory,
    deleteCategory,
    updateCategory,
    createProduct,
    updateProduct,
    deleteProduct
};
