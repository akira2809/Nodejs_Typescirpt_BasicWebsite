import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// Interface cho lỗi API
interface ApiError {
  status: number;
  message: string;
  errors?: any;
}

// Interface cho cấu hình API
interface ApiConfig {
  baseURL: string;
  timeout: number;
}

// Cấu hình mặc định
const defaultConfig: ApiConfig = {
  baseURL: 'http://localhost:3000',  // URL API của bạn
  timeout: 5000,
};

// Tạo instance axios
const axiosInstance: AxiosInstance = axios.create({
  ...defaultConfig,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor xử lý request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>): InternalAxiosRequestConfig<any> => {
    // Lấy token từ storage (có thể thay đổi theo nhu cầu)
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Lỗi Request:', error);
    return Promise.reject(error);
  }
);

// Interceptor xử lý response
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Đã xảy ra lỗi không mong muốn',
      errors: error.response?.data?.errors,
    };

    // Log lỗi
    console.error('Lỗi API:', apiError);

    return Promise.reject(apiError);
  }
);

// Các phương thức hỗ trợ API
const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.get<T, T>(url, config),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.post<T, T>(url, data, config),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.put<T, T>(url, data, config),
    
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T, T>(url, config),
    
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T, T>(url, data, config),
};

export default api;