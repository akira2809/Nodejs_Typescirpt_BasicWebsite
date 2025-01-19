var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axiosInstance from ".config/axios";
// Function để fetch và hiển thị sản phẩm
function fetchAndDisplayProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Gọi API lấy danh sách sản phẩm
            const response = yield axiosInstance.get("/products");
            const products = response.data;
            // Tìm phần tử HTML để render sản phẩm
            const productList = document.getElementById("products-list");
            if (!productList) {
                console.error("Element #products-list not found");
                return;
            }
            // Xóa nội dung cũ
            productList.innerHTML = "";
            // Render sản phẩm
            products.forEach((product) => {
                const productHTML = `
        <div class="swiper-slide">
          <div class="product-item image-zoom-effect link-effect">
            <div class="image-holder position-relative">
              <a href="product-detail.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image img-fluid">
              </a>
              <a href="#" class="btn-icon btn-wishlist">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <use xlink:href="#heart"></use>
                </svg>
              </a>
              <div class="product-content">
                <h5 class="element-title text-uppercase fs-5 mt-3">
                  <a href="product-detail.html?id=${product.id}">${product.name}</a>
                </h5>
                <a href="#" class="text-decoration-none" data-after="Add to cart"><span>$${product.price.toFixed(2)}</span></a>
              </div>
            </div>
          </div>
        </div>
      `;
                productList.insertAdjacentHTML("beforeend", productHTML);
            });
        }
        catch (error) {
            console.error("Error fetching products:", error);
        }
    });
}
// Gọi function khi trang web load xong
fetchAndDisplayProducts();
//# sourceMappingURL=test.js.map