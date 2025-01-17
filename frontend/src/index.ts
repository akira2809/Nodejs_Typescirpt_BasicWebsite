interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
  }
  
  function createProductCard(product: Product): string {
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
  
  function displayProducts(products: Product[]): void {
    const productList = document.getElementById('product-list');
    if (productList) {
      productList.innerHTML = products.map(createProductCard).join('');
    }
  }
  
  async function fetchProducts(): Promise<void> {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const products: Product[] = await response.json();
      displayProducts(products);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
  });
  