var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
const BASE_URL = "http://127.0.0.1:3000";
// 🛠 Kiểm tra email có tồn tại không
const checkEmailExists = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${BASE_URL}/users/check?email=${email}`);
        const users = yield response.json();
        return users.user.length > 0;
    }
    catch (error) {
        console.error("Lỗi kiểm tra email:", error);
        return false;
    }
});
// 🚀 Gửi yêu cầu đăng nhập
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = yield response.json();
        console.log("🔍 API Response:", data); // ✅ Kiểm tra phản hồi từ API
        if (!response.ok || !data.token || !data.user_id)
            throw new Error("Email hoặc mật khẩu không đúng!");
        return {
            id: data.user_id, // ✅ Đảm bảo lấy user_id từ API
            username: "", // Nếu API không trả về username, tạm thời để trống
            email,
            status: "active",
            token: data.token
        };
    }
    catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        throw error;
    }
});
// 🎯 Kiểm tra token hợp lệ trước khi tự động chuyển hướng
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const response = yield fetch(`${BASE_URL}/users/verify-token`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const userData = yield response.json();
                localStorage.setItem("user_id", userData.id.toString()); // ✅ Đảm bảo user_id luôn được lưu
                window.location.href = "index.html";
            }
            else {
                localStorage.removeItem("token");
                localStorage.removeItem("user_id"); // 🔥 Xóa user_id nếu token không hợp lệ
            }
        }
        catch (error) {
            console.error("Lỗi khi kiểm tra token:", error);
        }
    }
}));
// 🔑 Xử lý sự kiện đăng nhập
(_a = document.getElementById("login-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const email = getInputValue("email");
    const password = getInputValue("password");
    if (!validateEmail(email) || password.length === 0) {
        alert("Email hoặc mật khẩu không hợp lệ!");
        return;
    }
    try {
        const userData = yield loginUser(email, password);
        console.log("🎯 Lưu vào localStorage:", userData); // 🛠 Kiểm tra dữ liệu trước khi lưu
        if (userData.token && userData.id) {
            localStorage.setItem("token", userData.token);
            localStorage.setItem("user_id", userData.id.toString()); // 🛠 Đảm bảo lưu user_id dưới dạng chuỗi
            alert("Đăng nhập thành công!");
            window.location.href = "index.html";
        }
        else {
            alert("Lỗi: Không thể lưu thông tin đăng nhập!");
        }
    }
    catch (error) {
        alert("Đăng nhập thất bại! Vui lòng thử lại.");
    }
}));
// 📌 Các hàm hỗ trợ
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const getInputValue = (id) => document.getElementById(id).value.trim();
export {};
