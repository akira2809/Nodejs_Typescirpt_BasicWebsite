// app.ts
import { Product, getProducts } from './api/product';

class ProductDisplay {
    private productList: HTMLElement;
    private loading: HTMLElement;
    private error: HTMLElement;

    constructor() {
        this.productList = document.getElementById('productList')!;
        this.loading = document.getElementById('loading')!;
        this.error = document.getElementById('error')!;
        this.initialize();
    }

    private async initialize(): Promise<void> {
        try {
            await this.loadProducts();
        } catch (error) {
            this.showError('Có lỗi khi tải sản phẩm');
        }
    }

    private async loadProducts(): Promise<void> {
        try {
            const products = await getProducts();
            this.displayProducts(products);
        } catch (error) {
            throw error;
        } finally {
            this.loading.style.display = 'none';
        }
    }

    private displayProducts(products: Product[]): void {
        this.productList.innerHTML = products.map(product => this.createProductCard(product)).join('');
    }

    private createProductCard(product: Product): string {
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

    private formatPrice(price: number): string {
        return price.toLocaleString('vi-VN');
    }

    private showError(message: string): void {
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
(window as any).handleBuyProduct = (productId: number) => {
    console.log(`Mua sản phẩm có ID: ${productId}`);
    // Thêm logic xử lý mua hàng ở đây
    alert(`Đã thêm sản phẩm ${productId} vào giỏ hàng!`);
};