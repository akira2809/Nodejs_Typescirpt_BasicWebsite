// api.ts

import api from '../axiosConfig';

// Interface cho sản phẩm
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

// Lấy một sản phẩm theo id
async function getProduct(id: number): Promise<Product> {
  try {
    const product = await api.get<Product>(`/products/${id}`);
    return product;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sản phẩm:', error);
    throw error;
  }
}

// Lấy danh sách sản phẩm
async function getProducts(): Promise<Product[]> {
  try {
    const products = await api.get<Product[]>('/products');
    return products;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    throw error;
  }
}

// Tạo sản phẩm mới
async function createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  try {
    const newProduct = await api.post<Product>('/products', productData);
    return newProduct;
  } catch (error) {
    console.error('Lỗi khi tạo sản phẩm:', error);
    throw error;
  }
}

// Cập nhật sản phẩm
async function updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
  try {
    const updatedProduct = await api.put<Product>(`/products/${id}`, productData);
    return updatedProduct;
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    throw error;
  }
}

// Xóa sản phẩm
async function deleteProduct(id: number): Promise<void> {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    throw error;
  }
}

// Tìm kiếm sản phẩm
async function searchProducts(searchTerm: string): Promise<Product[]> {
  try {
    const products = await api.get<Product[]>('/products/search', {
      params: { q: searchTerm }
    });
    return products;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm sản phẩm:', error);
    throw error;
  }
}

// Lấy sản phẩm theo danh mục
async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const products = await api.get<Product[]>(`/products/category/${category}`);
    return products;
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm theo danh mục:', error);
    throw error;
  }
}

export {
  Product,
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory
};