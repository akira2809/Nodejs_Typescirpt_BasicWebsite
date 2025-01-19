var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchUsers, fetchProducts } from './api'; // Đường dẫn đúng tới tệp api.ts của bạn
const userListElement = document.getElementById('userList');
const productListElement = document.getElementById('productList');
// Hàm hiển thị danh sách người dùng
const displayUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield fetchUsers();
        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.name} - ${user.email}`;
            userListElement.appendChild(listItem);
        });
    }
    catch (error) {
        console.error('Lỗi khi hiển thị người dùng:', error);
    }
});
// Hàm hiển thị danh sách sản phẩm
const displayProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield fetchProducts();
        products.forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = `${product.name} - ${product.price}`;
            productListElement.appendChild(listItem);
        });
    }
    catch (error) {
        console.error('Lỗi khi hiển thị sản phẩm:', error);
    }
});
// Gọi hàm khi trang được tải
window.onload = () => {
    displayUsers();
    displayProducts();
};
//# sourceMappingURL=api.js.map