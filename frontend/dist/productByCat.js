var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_URL = 'http://127.0.0.1:3000';
const fetchData = (endpoint, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = id ? `${BASE_URL}/${endpoint}/${id}` : `${BASE_URL}/${endpoint}`;
        const response = yield fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok)
            throw new Error(`Lỗi tải ${endpoint}: ${response.statusText}`);
        return yield response.json();
    }
    catch (error) {
        console.error(`Lỗi khi tải ${endpoint}:`, error);
        throw error;
    }
});
const loadProductCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const dom = document.getElementById('product-list');
    // const categoryTitle = document.getElementById('bobo')!;
    dom.innerHTML = '';
    const urlParams = new URLSearchParams(window.location.search);
    const id = Number(urlParams.get('category'));
    if (!id) {
        // categoryTitle.textContent = "Danh mục không hợp lệ";
        // return;
    }
    try {
        // Lấy thông tin danh mục
        // const category: CategoryResponse = await fetchData<CategoryResponse>('categories', id);
        //   console.log(category);
        // if (!category || !category.name) {
        //   categoryTitle.textContent = "Danh mục không tồn tại";
        //   return;
        // }
        // // Cập nhật tên danh mục vào DOM
        // categoryTitle.textContent = category.name;
        // Lấy danh sách sản phẩm của category
        const products = yield fetchData('products/category', id);
        if (products.length === 0) {
            dom.innerHTML = "<p class='text-center text-muted'>Không có sản phẩm nào.</p>";
            return;
        }
        products.forEach((product) => {
            dom.innerHTML += `
        <div class="col">
          <div class="product-item image-zoom-effect link-effect">
            <div class="image-holder position-relative overflow-hidden rounded">
              <a href="detail.html?products=${product.id}">
                <img src="${product.image}" 
                     class="product-image img-fluid w-100" 
                     alt="${product.name}"
                     style="height: 300px; object-fit: cover;">
              </a>
              <div class="product-overlay d-flex">
                <a href="#" class="btn-icon btn-wishlist me-2">
                  <i class="far fa-heart"></i>
                </a>
                <a href="#" class="btn-icon btn-cart">
                  <i class="fas fa-shopping-cart"></i>
                </a>
              </div>
            </div>
            <div class="product-content text-center py-3">
              <h3 class="product-title fs-6 mb-2">
                <a href="detail.html?products=${product.id}" class="text-dark text-decoration-none">
                  ${product.name}
                </a>
              </h3>
              <div class="product-price">
                <span class="text-danger fw-bold">${product.price.toLocaleString()}đ</span>
              </div>
            </div>
          </div>
        </div>`;
        });
    }
    catch (error) {
        // categoryTitle.textContent = "Lỗi khi tải danh mục";
        console.error("Lỗi tải danh mục hoặc sản phẩm:", error);
    }
});
loadProductCategory();
export {};
