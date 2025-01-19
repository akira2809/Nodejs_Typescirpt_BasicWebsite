var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// app.ts
import { getProducts } from './api/product';
class ProductDisplay {
    constructor() {
        this.productList = document.getElementById('productList');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.loadProducts();
            }
            catch (error) {
                this.showError('Có lỗi khi tải sản phẩm');
            }
        });
    }
    loadProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield getProducts();
                this.displayProducts(products);
            }
            catch (error) {
                throw error;
            }
            finally {
                this.loading.style.display = 'none';
            }
        });
    }
    displayProducts(products) {
        this.productList.innerHTML = products.map(product => this.createProductCard(product)).join('');
    }
    createProductCard(product) {
        return `
            <div class="product-card" data-id="${product.id}">
                <img 
                    src="${product.image}" 
                    alt="${product.name}"
                    class="product-image"
                    onerror="this.src='/api/placeholder/150/150'"
                >
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>Giá: ${this.formatPrice(product.price)} VNĐ</strong></p>
                <p>Còn lại: ${product.stock} sản phẩm</p>
                <button onclick="handleBuyProduct(${product.id})">Mua ngay</button>
            </div>
        `;
    }
    formatPrice(price) {
        return price.toLocaleString('vi-VN');
    }
    showError(message) {
        this.error.textContent = message;
        this.error.style.display = 'block';
        this.loading.style.display = 'none';
    }
}
// Khởi tạo ứng dụng
window.addEventListener('DOMContentLoaded', () => {
    new ProductDisplay();
});
// Xử lý sự kiện mua hàng (có thể thêm vào giỏ hàng hoặc chuyển đến trang thanh toán)
window.handleBuyProduct = (productId) => {
    console.log(`Mua sản phẩm có ID: ${productId}`);
    // Thêm logic xử lý mua hàng ở đây
    alert(`Đã thêm sản phẩm ${productId} vào giỏ hàng!`);
};
//# sourceMappingURL=index.js.map