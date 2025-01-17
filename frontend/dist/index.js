"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function createProductCard(product) {
    return `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${product.image}" class="card-img-top" alt="${product.title}">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text"><strong>Price:</strong> $${product.price}</p>
            <p class="card-text"><strong>Rating:</strong> ${product.rating.rate} (${product.rating.count} reviews)</p>
          </div>
        </div>
      </div>
    `;
}
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    if (productList) {
        productList.innerHTML = products.map(createProductCard).join('');
    }
}
function fetchProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://fakestoreapi.com/products');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const products = yield response.json();
            displayProducts(products);
        }
        catch (error) {
            console.error('Fetch error:', error);
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});
//# sourceMappingURL=index.js.map