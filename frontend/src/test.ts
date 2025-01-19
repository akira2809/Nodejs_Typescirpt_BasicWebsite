import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define interfaces for better type safety
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  retryCount?: number;
  maxRetries?: number;
  retryDelay?: number;
}

// Create Axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Thay thế bằng URL API của bạn
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    try {
      // Thêm token vào header (có thể lấy từ nơi khác tùy vào setup của bạn)
      const token = 'your-auth-token'; // Thay thế với cách lấy token của bạn
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): any => {
    return response.data;
  },
  async (error: AxiosError): Promise<any> => {
    if (error.response) {
      // Handle specific HTTP errors
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized access');
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      console.error('Network error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    
    // Implement retry mechanism
    const config = error.config as CustomAxiosRequestConfig;
    if (!config || !config.retryCount) {
      return Promise.reject(error);
    }

    config.retryCount = config.retryCount || 0;
    config.maxRetries = config.maxRetries || 3;
    config.retryDelay = config.retryDelay || 1000;

    if (config.retryCount >= (config.maxRetries || 3)) {
      return Promise.reject(error);
    }

    config.retryCount += 1;
    
    await new Promise(resolve => setTimeout(resolve, config.retryDelay));
    
    return axiosInstance(config);
  }
);

export default axiosInstance;