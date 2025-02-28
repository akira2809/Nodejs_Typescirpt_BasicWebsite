var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
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
const loadDropdown = () => __awaiter(void 0, void 0, void 0, function* () {
    const categoryMenu = document.querySelector('.dropdown-menu');
    if (!categoryMenu)
        return console.error('Không tìm thấy .dropdown-menu');
    try {
        const categories = yield fetchData('categories/category');
        categoryMenu.innerHTML = categories.length
            ? categories
                .map(({ id, name }) => `<li>
                <a href="ProductbyCate.html?category=${id}" class="dropdown-item item-anchor menuitem">${name}</a>
              </li>`)
                .join('')
            : '<li class="dropdown-item">Không có danh mục nào.</li>';
    }
    catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
        categoryMenu.innerHTML = '<li class="dropdown-item text-danger">Lỗi tải danh mục!</li>';
    }
});
const loadCategoryBar = () => __awaiter(void 0, void 0, void 0, function* () {
    const categoryBar = document.querySelector('.breadcrumb');
    if (!categoryBar)
        return console.error('Không tìm thấy .breadcrumb');
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('products');
        if (!productId) {
            categoryBar.innerHTML = `<li class="breadcrumb-item active">Không có sản phẩm</li>`;
            return;
        }
        const product = yield fetchData('products', productId);
        const category = yield fetchData('categories/product', productId);
        console.log(category);
        categoryBar.innerHTML = `
      <li class="breadcrumb-item">
        <a href="/" class="text-decoration-none text-muted">Trang chủ</a>
      </li>
      <li class="breadcrumb-item">
        <a href="ProductbyCate.html?category=${category[0].id}" class="text-decoration-none text-muted">${category[0].name}</a>
      </li>
      <li class="breadcrumb-item active" aria-current="page">
        ${product.name}
      </li>
    `;
    }
    catch (error) {
        console.error('Lỗi khi tải breadcrumb:', error);
        categoryBar.innerHTML = `<li class="breadcrumb-item active text-danger">Lỗi tải dữ liệu</li>`;
    }
});
const loadProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const productCarousel = document.querySelector('#new-arrivals-section .swiper-wrapper');
    if (!productCarousel)
        return console.error('Không tìm thấy .swiper-wrapper');
    try {
        const products = yield fetchData('products');
        renderProduct(products);
    }
    catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        productCarousel.innerHTML =
            '<p class="error-message">Không thể tải sản phẩm. Vui lòng thử lại sau!</p>';
    }
});
const renderProduct = (products) => {
    const productCarousel = document.querySelector('#new-arrivals-section .swiper-wrapper');
    if (!productCarousel)
        return console.error('Không tìm thấy .swiper-wrapper');
    productCarousel.innerHTML = products.length
        ? products
            .map(({ id, image, name, price }) => `
      <div class="swiper-slide">
        <div class="product-item image-zoom-effect link-effect">
          <div class="image-holder position-relative">
            <a href="detail.html?products=${id}">
              <img src="${image}" alt="${name}" class="product-image img-fluid">
            </a>
            <a href="#" class="btn-icon btn-wishlist">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <use xlink:href="#heart"></use>
              </svg>
            </a>
            <div class="product-content">
              <h5 class="text-uppercase fs-5 mt-3">
                <a href="detail.html?products=${id}">${name}</a>
              </h5>
              <a href="#" class="text-decoration-none" data-after="Add to cart">
                <span>${price.toLocaleString('vi-VN')} VND</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `)
            .join('')
        : '<p class="no-products">Không có sản phẩm nào.</p>';
};
// 🛒 Lấy giỏ hàng từ localStorage
const getCart = () => {
    return JSON.parse(localStorage.getItem('cart') || '[]');
};
// 💾 Lưu giỏ hàng vào localStorage
const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};
const updateCount = () => {
    const cartCountElement = document.querySelector('.cart-count');
    let cart = getCart();
    cartCountElement.textContent = `(${cart.length})`;
};
// 🔄 Cập nhật giao diện giỏ hàng trong offcanvas
const updateCartUI = () => {
    const cartList = document.querySelector('#offcanvasCart .list-group');
    const totalPriceElement = document.querySelector('#offcanvasCart strong');
    const badgeElement = document.querySelector('#offcanvasCart .badge');
    if (!cartList || !totalPriceElement || !badgeElement) {
        console.warn("⚠️ Không tìm thấy phần tử cần cập nhật trong DOM!");
        return;
    }
    const cart = getCart();
    cartList.innerHTML = '';
    let total = 0;
    let totalItems = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        totalItems += item.quantity;
        cartList.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <img src="${item.image}" alt="${item.name}" width="50" class="me-3">
          <div>
            <h6 class="my-0">${item.name} (${item.quantity})</h6>
            <small class="text-body-secondary">${item.price.toLocaleString('vi')} VND</small>
          </div>
        </div>
        <div>
          <span class="text-body-secondary">${(item.price * item.quantity).toLocaleString('vi')} VND</span>
          <button class="btn btn-sm btn-danger ms-2 remove-item" data-index="${index}">&times;</button>
        </div>
      </li>
    `;
    });
    totalPriceElement.innerText = `${total.toLocaleString('vi')} VND`;
    badgeElement.innerText = cart.length.toString();
    // ✨ Lưu giỏ hàng vào localStorage để không bị mất khi chuyển trang
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCount();
};
// ➕ Thêm sản phẩm vào giỏ hàng
const addToCart = (product) => {
    let cart = getCart();
    const existingItem = cart.find((item) => item.id === product.id.toString());
    if (existingItem) {
        existingItem.quantity += 1;
    }
    else {
        cart.push({
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    saveCart(cart);
    updateCount();
    updateCartUI();
    // 🔥 Gọi cập nhật giao diện ngay sau khi thêm sản phẩm
};
// 🗑 Xóa sản phẩm khỏi giỏ hàng
document.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('remove-item')) {
        const index = parseInt(target.dataset.index);
        let cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        updateCartUI();
        updateCount(); // 🔥 Cập nhật số lượng ngay lập tức
    }
});
// 📥 Load chi tiết sản phẩm và thêm nút "Thêm vào giỏ"
const loadProductDetail = () => __awaiter(void 0, void 0, void 0, function* () {
    const productDetailSection = document.querySelector('.product-section .container');
    if (!productDetailSection) {
        console.error('Không tìm thấy .product-section .container');
        return;
    }
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('products');
        if (!productId) {
            productDetailSection.innerHTML = '<p class="error-message">Không tìm thấy sản phẩm</p>';
            return;
        }
        const product = yield fetchData('products', productId);
        productDetailSection.innerHTML = `
        <div class="row">
        <!-- Product Images -->
        <div class="col-lg-6 product-images">
          <div class="row">
            <div class="col-10">
              <div class="main-image">
                <img src="${product.image}" class="img-fluid" />
              </div>
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="col-lg-6 ps-lg-5">
          <div class="product-info">
            <h1 class="mb-3">${product.name}</h1>

            <div class="product-rating mb-3">
              <i class="fas fa-star text-warning"></i>
              <i class="fas fa-star text-warning"></i>
              <i class="fas fa-star text-warning"></i>
              <i class="fas fa-star text-warning"></i>
              <i class="fas fa-star-half-alt text-warning"></i>
              <span class="ms-2 text-muted">(150 đánh giá)</span>
            </div>

            <div class="product-price mb-4">
              <span class="sale-price">${product.price.toLocaleString('vi-VN')} VND</span>
              <span class="original-price">1.199.000₫</span>
              <span class="badge bg-danger ms-2">-33%</span>
            </div>

            <div class="product-color mb-4">
              <h6 class="mb-3">Màu sắc</h6>
              <div class="color-options">
                <input type="radio" class="btn-check" name="color" id="color-1" checked />
                <label class="btn btn-outline-dark rounded-circle p-3 me-2" for="color-1"></label>

                <input type="radio" class="btn-check" name="color" id="color-2" />
                <label class="btn btn-outline-secondary rounded-circle p-3 me-2" for="color-2"></label>

                <input type="radio" class="btn-check" name="color" id="color-3" />
                <label class="btn btn-outline-danger rounded-circle p-3" for="color-3"></label>
              </div>
            </div>

            <div class="product-size mb-4">
              <h6 class="mb-3">Kích thước</h6>
              <div class="size-select">
                <input type="radio" class="btn-check" name="size" id="size-s" checked />
                <label class="btn" for="size-s">S</label>

                <input type="radio" class="btn-check" name="size" id="size-m" />
                <label class="btn" for="size-m">M</label>

                <input type="radio" class="btn-check" name="size" id="size-l" />
                <label class="btn" for="size-l">L</label>

                <input type="radio" class="btn-check" name="size" id="size-xl" />
                <label class="btn" for="size-xl">XL</label>
              </div>
            </div>

            <div class="product-quantity mb-4">
              <h6 class="mb-3">Số lượng</h6>
              <div class="d-flex align-items-center">
                <button class="btn btn-outline-secondary px-3" onclick="decreaseQty()">-</button>
                <input type="number" class="form-control text-center mx-2 qty-input" value="1" min="1" />
                <button class="btn btn-outline-secondary px-3" onclick="increaseQty()">+</button>
              </div>
            </div>

            <div class="product-actions d-flex gap-2 mb-4">
            
<button class="btn btn-primary  flex-grow-1"" id="add-to-cart" data-product-id="${product.id}">Thêm vào giỏ</button>

              <button class="btn btn-danger flex-grow-1">Mua ngay</button>
              <button class="btn btn-wishlist">
                <i class="far fa-heart"></i>
              </button>
            </div>

            <div class="product-meta">
              <p class="mb-2">
                <strong>SKU:</strong> <span class="text-muted">KF876543</span>
              </p>
              <p class="mb-0">
                <strong>Tags:</strong>
                <a href="#" class="text-decoration-none">áo len</a>,
                <a href="#" class="text-decoration-none">thời trang</a>
              </p>
              <a href="#" class="text-decoration-none">Số lượng: ${product.stock}</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Details Tabs -->
      <div class="row mt-5">
        <div class="col-12">
          <ul class="nav nav-tabs product-details-tabs mb-4" id="productTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#description">
                Mô tả
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#additional">
                Thông tin thêm
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#reviews">
                Đánh giá (150)
              </button>
            </li>
          </ul>

          <div class="tab-content" id="productTabsContent">
            <div class="tab-pane fade show active" id="description">
              <p>${product.description}</p>
              <ul class="list-unstyled">
                <li>
                  <i class="fas fa-check text-success me-2"></i>Chất liệu len merino cao cấp
                </li>
                <li>
                  <i class="fas fa-check text-success me-2"></i>Thiết kế thời trang, hiện đại
                </li>
                <li>
                  <i class="fas fa-check text-success me-2"></i>Giữ ấm tốt trong mùa lạnh
                </li>
                <li>
                  <i class="fas fa-check text-success me-2"></i>Dễ dàng phối đồ
                </li>
              </ul>
            </div>
            <div class="tab-pane fade" id="additional">
              <table class="table">
                <tbody>
                  <tr>
                    <th>Chất liệu</th>
                    <td>100% len merino</td>
                  </tr>
                  <tr>
                    <th>Xuất xứ</th>
                    <td>Việt Nam</td>
                  </tr>
                  <tr>
                    <th>Hướng dẫn giặt</th>
                    <td>Giặt tay, không sử dụng máy sấy</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="tab-pane fade" id="reviews">
              <!-- Review content here -->
            </div>
          </div>
        </div>
      </div>
    `;
        document.getElementById('add-to-cart').onclick = () => addToCart(product);
    }
    catch (error) {
        console.error('Lỗi khi tải chi tiết sản phẩm:', error);
        productDetailSection.innerHTML = '<p class="error-message text-danger">Lỗi tải chi tiết sản phẩm</p>';
    }
});
//checkout
// 🛒 Xử lý sự kiện nhấn nút thanh toán
(_a = document.querySelector("#checkout-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const cart = getCart() || [];
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
        alert("Vui lòng đăng nhập trước khi thanh toán!");
        return;
    }
    if (!Array.isArray(cart) || cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }
    const orderData = {
        user_id: userId,
        total_amount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
        })),
    };
    try {
        const response = yield fetch(`${BASE_URL}/products/orders/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
        });
        const responseData = yield response.json();
        if (!response.ok) {
            throw new Error(responseData.error || "Có lỗi xảy ra khi đặt hàng.");
        }
        console.log("✅ Đơn hàng đã tạo:", responseData);
        // ✅ Nếu có URL thanh toán từ PayOS, chuyển hướng người dùng
        if (responseData.payment_url) {
            window.location.href = responseData.payment_url;
        }
        else {
            alert("Đặt hàng thành công nhưng không có link thanh toán!");
        }
    }
    catch (error) {
        console.error("❌ Lỗi khi đặt hàng:", error);
        alert("Thanh toán thất bại: " + (error instanceof Error ? error.message : String(error)));
    }
}));
(_b = document.getElementById("logout-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    localStorage.removeItem("token");
    alert("Bạn đã đăng xuất!");
    window.location.href = "login.html";
});
document.addEventListener("DOMContentLoaded", () => {
    const orderId = getOrderIdFromURL(); // Lấy order_id từ URL
    if (!orderId) {
        showError("Không tìm thấy Order ID trong URL.");
        return;
    }
    fetchOrderDetails(orderId);
});
// Hàm lấy order_id từ URL (kiểm tra nhiều cách)
function getOrderIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    let orderId = params.get("order_id");
    // Nếu không tìm thấy trong query params, thử lấy từ hash
    if (!orderId && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        orderId = hashParams.get("order_id");
    }
    // Nếu vẫn không có, thử lấy từ path (dạng /orders/:orderId)
    if (!orderId) {
        const pathSegments = window.location.pathname.split("/");
        if (pathSegments.length > 2 && pathSegments[1] === "orders") {
            orderId = pathSegments[2];
        }
    }
    return orderId;
}
// Gọi API để lấy thông tin đơn hàng
function fetchOrderDetails(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://localhost:3000/orders/${orderId}`);
            if (!response.ok)
                throw new Error("Failed to fetch order details");
            const data = yield response.json();
            if (!data || !data.order || !data.items) {
                throw new Error("Dữ liệu đơn hàng không hợp lệ.");
            }
            displayOrderDetails(data);
        }
        catch (error) {
            console.error("Error fetching order details:", error);
            showError("Không thể lấy thông tin đơn hàng. Vui lòng thử lại!");
        }
    });
}
// Hiển thị thông tin đơn hàng
function displayOrderDetails(order) {
    const orderContainer = document.getElementById("order-details");
    if (!orderContainer)
        return;
    orderContainer.innerHTML = `
    <h2>Order ID: ${order.order.order_id}</h2>
    <p>User ID: ${order.order.user_id}</p>
    <p>Total Amount: $${order.order.total_amount.toFixed(2)}</p>
    <h3>Items:</h3>
    <ul id="order-items"></ul>
  `;
    const itemsContainer = document.getElementById("order-items");
    if (!itemsContainer)
        return;
    itemsContainer.innerHTML = order.items.map((item) => `
    <li>
      <strong>Product ID:</strong> ${item.product_id} -
      <strong>Quantity:</strong> ${item.quantity} -
      <strong>Price:</strong> $${item.price.toFixed(2)}
    </li>
  `).join("");
}
// Hiển thị thông báo lỗi
function showError(message) {
    const orderContainer = document.getElementById("order-details");
    if (orderContainer) {
        orderContainer.innerHTML = `<p style="color: red;">${message}</p>`;
    }
}
// ⏳ Chạy khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetail();
    updateCartUI();
    loadDropdown();
    loadProducts();
    loadCategoryBar();
});
export {};
