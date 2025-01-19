import axios from "axios";

// Thiết lập URL cơ sở cho axios
axios.defaults.baseURL = "http://localhost:3000";

// Interface cho Product
interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  created_at: string;
}

// Function để fetch và hiển thị sản phẩm
async function fetchAndDisplayProducts() {
  try {
    // Gọi API lấy danh sách sản phẩm
    const response = await axios.get<Product[]>("/products");
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
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Gọi function khi trang web load xong
fetchAndDisplayProducts();
