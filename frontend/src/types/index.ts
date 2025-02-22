// Kiểu dữ liệu khi tạo sản phẩm (request)
export interface CreateProductRequest {
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
}

// Kiểu dữ liệu sản phẩm trả về từ API (response)
export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  createdAt?: string; // Dữ liệu từ server, có thể không cần khi tạo
  updatedAt?: string; // Dùng để theo dõi cập nhật
  categoryId ?: number;
}

export interface CategoryResponse  {
  id: number;
  name: string;
  createdAt?: string; // Dữ liệu từ server, có thể không cần khi tạo
}




// users

export interface UserResponse {
  id: number;
  username: string;
  password: string;
  email: string;
  createdAt?: string; // Dữ liệu từ server, có thể không cần khi tạo
  updatedAt?: string; // Dùng để theo dõi cập nhật
  status: string;
  
}
export interface UserRequest {
  id: number;
  username: string;
  email: string;
  status: string;
  token: string; // Thêm dòng này
  createdAt?: string;
  updatedAt?: string;

}

 export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

