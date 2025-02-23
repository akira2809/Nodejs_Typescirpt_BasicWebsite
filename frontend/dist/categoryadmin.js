"use strict";
// 📂 src/categoryadmin.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class CategoryService {
    static getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.BASE_URL}/category`);
            return response.json();
        });
    }
    static getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.BASE_URL}/${id}`);
            return response.json();
        });
    }
    static createCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(`${this.BASE_URL}/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(category),
            });
        });
    }
    static updateCategory(id, category) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(`${this.BASE_URL}/update/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(category),
            });
        });
    }
    static deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(`${this.BASE_URL}/delete/${id}`, {
                method: "DELETE",
            });
        });
    }
}
CategoryService.BASE_URL = "http://localhost:3000/categories";
// 📌 Hiển thị danh mục trong bảng
function renderCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        const tableBody = document.getElementById("categoryTableBody");
        tableBody.innerHTML = "";
        const categories = yield CategoryService.getCategories();
        categories.forEach((category) => {
            const row = document.createElement("tr");
            row.innerHTML = `
          <td>${category.name}</td>
          <td>
              <button class="btn btn-warning btn-sm edit-btn" data-id="${category.id}" data-bs-toggle="modal" data-bs-target="#editCategoryModal">
                  <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-danger btn-sm delete-btn" data-id="${category.id}">
                  <i class="fas fa-trash"></i>
              </button>
          </td>
      `;
            tableBody.appendChild(row);
        });
    });
}
// 📌 Xử lý thêm danh mục
document.getElementById("saveNewCategory").addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    yield CategoryService.createCategory({
        name: document.getElementById("addCategoryName").value,
        description: document.getElementById("addCategoryDescription").value,
        status: document.getElementById("addCategoryStatus").value,
    });
    renderCategories();
}));
// 📌 Load dữ liệu vào modal chỉnh sửa (Sửa lỗi không hiển thị)
// 📌 Load dữ liệu vào modal chỉnh sửa
document.getElementById("categoryTableBody").addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
    const target = event.target;
    const editButton = target.closest(".edit-btn");
    if (editButton) {
        const id = Number(editButton.dataset.id);
        try {
            let category = yield CategoryService.getCategoryById(id);
            // 🛠 Nếu API trả về một mảng, lấy phần tử đầu tiên
            if (Array.isArray(category)) {
                category = category.length > 0 ? category[0] : undefined;
            }
            // 🛠 Kiểm tra nếu category bị undefined hoặc không có ID (Fix lỗi API)
            if (!category || typeof category.id === "undefined") {
                alert("⚠️ Danh mục không tồn tại hoặc đã bị xóa.");
                console.error("Lỗi: Dữ liệu API không hợp lệ:", category);
                return;
            }
            // 🛠 Gán dữ liệu vào modal
            document.getElementById("editCategoryId").value = category.id.toString();
            document.getElementById("editCategoryName").value = category.name || "";
            document.getElementById("editCategoryDescription").value = category.description || "";
            document.getElementById("editCategoryStatus").value = category.status || "Inactive";
            // 🛠 Load danh mục cha
            const parentSelect = document.getElementById("editParentCategory");
            parentSelect.innerHTML = `<option value="">None (Top Level)</option>`;
            const categories = yield CategoryService.getCategories();
            categories.forEach(cat => {
                if (cat.id !== category.id) {
                    const option = document.createElement("option");
                    option.value = cat.id.toString();
                    option.textContent = cat.name;
                    if (cat.id.toString() === category.parentCategory) {
                        option.selected = true;
                    }
                    parentSelect.appendChild(option);
                }
            });
            // 🛠 Đảm bảo nút Save cập nhật danh mục đúng ID
            document.getElementById("saveEditedCategory").onclick = () => __awaiter(void 0, void 0, void 0, function* () {
                yield updateCategory(id);
            });
        }
        catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
            alert("⚠️ Lỗi tải danh mục. Hãy thử lại!");
        }
    }
}));
// 📌 Cập nhật danh mục khi nhấn Save
function updateCategory(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedCategory = {
            name: document.getElementById("editCategoryName").value,
            description: document.getElementById("editCategoryDescription").value,
            status: document.getElementById("editCategoryStatus").value,
            parentCategory: document.getElementById("editParentCategory").value || undefined, // 🔥 FIX lỗi null
        };
        yield CategoryService.updateCategory(id, updatedCategory);
        renderCategories();
        document.querySelector("#editCategoryModal .btn-close").click();
    });
}
// 📌 Xóa danh mục
document.getElementById("categoryTableBody").addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
    const target = event.target;
    const deleteButton = target.closest(".delete-btn");
    if (deleteButton) {
        const id = Number(deleteButton.dataset.id);
        if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
            yield CategoryService.deleteCategory(id);
            renderCategories();
        }
    }
}));
// 📌 Chạy hàm render khi load trang
document.addEventListener("DOMContentLoaded", renderCategories);
