// api.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import api from '../axiosConfig';
// Lấy một sản phẩm theo id
function getProduct(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield api.get(`/products/${id}`);
            return product;
        }
        catch (error) {
            console.error('Lỗi khi lấy thông tin sản phẩm:', error);
            throw error;
        }
    });
}
// Lấy danh sách sản phẩm
function getProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield api.get('/products');
            return products;
        }
        catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            throw error;
        }
    });
}
// Tạo sản phẩm mới
function createProduct(productData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newProduct = yield api.post('/products', productData);
            return newProduct;
        }
        catch (error) {
            console.error('Lỗi khi tạo sản phẩm:', error);
            throw error;
        }
    });
}
// Cập nhật sản phẩm
function updateProduct(id, productData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedProduct = yield api.put(`/products/${id}`, productData);
            return updatedProduct;
        }
        catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            throw error;
        }
    });
}
// Xóa sản phẩm
function deleteProduct(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield api.delete(`/products/${id}`);
        }
        catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            throw error;
        }
    });
}
// Tìm kiếm sản phẩm
function searchProducts(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield api.get('/products/search', {
                params: { q: searchTerm }
            });
            return products;
        }
        catch (error) {
            console.error('Lỗi khi tìm kiếm sản phẩm:', error);
            throw error;
        }
    });
}
// Lấy sản phẩm theo danh mục
function getProductsByCategory(category) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield api.get(`/products/category/${category}`);
            return products;
        }
        catch (error) {
            console.error('Lỗi khi lấy sản phẩm theo danh mục:', error);
            throw error;
        }
    });
}
export { getProduct, getProducts, createProduct, updateProduct, deleteProduct, searchProducts, getProductsByCategory };
//# sourceMappingURL=api.js.map