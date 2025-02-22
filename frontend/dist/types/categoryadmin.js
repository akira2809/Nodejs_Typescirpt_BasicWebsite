var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_BASE = "http://localhost:3000";
const CATEGORY_API = `${API_BASE}/categories`; // Gộp đường dẫn để code gọn hơn
// 🔹 Lấy tất cả danh mục
export const fetchCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${CATEGORY_API}/category`);
        if (!response.ok)
            throw new Error("Lỗi khi lấy danh mục");
        return yield response.json();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("fetchCategories:", error.message);
        }
        else {
            console.error("fetchCategories: An unknown error occurred");
        }
        return null;
    }
});
// 🔹 Lấy một danh mục theo ID
export const fetchCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${CATEGORY_API}/category/${id}`);
        if (!response.ok)
            throw new Error("Lỗi khi lấy danh mục theo ID");
        return yield response.json();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`fetchCategoryById (${id}):`, error.message);
        }
        else {
            console.error(`fetchCategoryById (${id}): An unknown error occurred`);
        }
        return null;
    }
});
// 🔹 Thêm danh mục mới
export const createCategory = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${CATEGORY_API}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!response.ok)
            throw new Error("Lỗi khi thêm danh mục");
        return yield response.json();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`createCategory (${name}):`, error.message);
        }
        else {
            console.error(`createCategory (${name}): An unknown error occurred`);
        }
        return null;
    }
});
// 🔹 Cập nhật danh mục
export const updateCategory = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${CATEGORY_API}/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!response.ok)
            throw new Error("Lỗi khi cập nhật danh mục");
        return yield response.json();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`updateCategory (${id}, ${name}):`, error.message);
        }
        else {
            console.error(`updateCategory (${id}, ${name}): An unknown error occurred`);
        }
        return null;
    }
});
// 🔹 Xóa danh mục
export const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${CATEGORY_API}/delete/${id}`, {
            method: "DELETE",
        });
        if (!response.ok)
            throw new Error("Lỗi khi xóa danh mục");
        return yield response.json();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`deleteCategory (${id}):`, error.message);
        }
        else {
            console.error(`deleteCategory (${id}): An unknown error occurred`);
        }
        return null;
    }
});
