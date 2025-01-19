import axios from 'axios';
// Cấu hình mặc định
const defaultConfig = {
    baseURL: 'http://localhost:3000', // URL API của bạn
    timeout: 5000,
};
// Tạo instance axios
const axiosInstance = axios.create(Object.assign(Object.assign({}, defaultConfig), { headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    } }));
// Interceptor xử lý request
axiosInstance.interceptors.request.use((config) => {
    // Lấy token từ storage (có thể thay đổi theo nhu cầu)
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error('Lỗi Request:', error);
    return Promise.reject(error);
});
// Interceptor xử lý response
axiosInstance.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    var _a, _b, _c, _d, _e;
    const apiError = {
        status: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500,
        message: ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Đã xảy ra lỗi không mong muốn',
        errors: (_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.errors,
    };
    // Log lỗi
    console.error('Lỗi API:', apiError);
    return Promise.reject(apiError);
});
// Các phương thức hỗ trợ API
const api = {
    get: (url, config) => axiosInstance.get(url, config),
    post: (url, data, config) => axiosInstance.post(url, data, config),
    put: (url, data, config) => axiosInstance.put(url, data, config),
    delete: (url, config) => axiosInstance.delete(url, config),
    patch: (url, data, config) => axiosInstance.patch(url, data, config),
};
export default api;
//# sourceMappingURL=axiosConfig.js.map