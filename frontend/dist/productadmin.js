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
var _a, _b, _c, _d, _e;
class ProductService {
    static getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.BASE_URL}/`);
            return response.json();
        });
    }
    static getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.BASE_URL}/${id}`);
            return response.json();
        });
    }
    static createProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(`${this.BASE_URL}/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product),
            });
        });
    }
    static updateProduct(id, product) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(`${this.BASE_URL}/update/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product),
            });
        });
    }
    static deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(`${this.BASE_URL}/delete/${id}`, {
                method: "DELETE",
            });
        });
    }
}
ProductService.BASE_URL = "http://localhost:3000/products";
function renderProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        // Kiểm tra nếu DataTable đã được khởi tạo, nếu có thì xóa
        if ($.fn.DataTable.isDataTable("#productTable")) {
            $("#productTable").DataTable().destroy();
        }
        const tableBody = document.getElementById("productTableBody");
        tableBody.innerHTML = "";
        const products = yield ProductService.getProducts();
        products.forEach((product) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td><img src="${product.image}" alt="Product" style="width:100px"></td>
            <td>${product.name}</td>
            <td>${product.categoryname}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td><span class="badge bg-success">Active</span></td>
            <td class="action-buttons">
                <button class="btn btn-warning btn-sm edit-btn" data-id="${product.id}" data-bs-toggle="modal" data-bs-target="#editProductModal">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>`;
            tableBody.appendChild(row);
        });
        // Khởi tạo lại DataTable sau khi dữ liệu được render
        $("#productTable").DataTable();
    });
}
(_a = document.getElementById("saveNewProduct")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const name = document.getElementById("addProductName").value;
    const categoryId = parseInt(document.getElementById("addProductCategory").value, 10);
    const price = parseFloat(document.getElementById("addProductPrice").value);
    const stock = parseInt(document.getElementById("addProductStock").value, 10);
    const description = document.getElementById("addProductDescription").value;
    const imageInput = document.getElementById("addProductImage");
    const image = ((_a = imageInput.files) === null || _a === void 0 ? void 0 : _a[0]) ? URL.createObjectURL(imageInput.files[0]) : "default.jpg";
    yield ProductService.createProduct({ name, categoryId, price, stock, description, status: "Active", image });
    renderProducts();
}));
(_b = document.getElementById("saveNewProduct")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const formData = new FormData();
    // Lấy dữ liệu từ form
    formData.append("name", document.getElementById("addProductName").value);
    formData.append("categoryId", document.getElementById("addProductCategory").value);
    formData.append("price", document.getElementById("addProductPrice").value);
    formData.append("stock", document.getElementById("addProductStock").value);
    formData.append("description", document.getElementById("addProductDescription").value);
    // Lấy file từ input và thêm vào FormData
    const imageInput = document.getElementById("addProductImage");
    if (imageInput.files && imageInput.files[0]) {
        formData.append("image", imageInput.files[0]);
    }
    try {
        const response = yield fetch("http://localhost:3000/products/create", {
            method: "POST",
            body: formData, // Gửi FormData thay vì JSON
        });
        const result = yield response.json();
        console.log("Response:", result);
        if (response.ok) {
            alert("Product added successfully!");
            (_a = document.getElementById("addProductForm")) === null || _a === void 0 ? void 0 : _a.reset(); // Reset form sau khi thành công
            renderProducts(); // Tải lại danh sách sản phẩm
        }
        else {
            alert("Error adding product: " + result.message);
        }
    }
    catch (error) {
        console.error("Error:", error);
        alert("Failed to add product!");
    }
}));
(_c = document.getElementById("productTableBody")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
    const target = event.target;
    const deleteButton = target.closest(".delete-btn");
    if (deleteButton) {
        const id = Number(deleteButton.dataset.id);
        if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            yield ProductService.deleteProduct(id);
            renderProducts();
        }
    }
}));
(_d = document.getElementById("productTableBody")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
    const target = event.target;
    const editButton = target.closest(".edit-btn");
    if (editButton) {
        const id = Number(editButton.dataset.id);
        console.log("ID sản phẩm cần sửa:", id);
        // Lấy dữ liệu sản phẩm từ API
        try {
            const response = yield fetch(`http://localhost:3000/products/${id}`);
            const product = yield response.json();
            // Đổ dữ liệu vào form
            document.getElementById("editProductId").value = product.id;
            document.getElementById("editProductName").value = product.name;
            document.getElementById("editProductCategory").value = product.categoryId;
            document.getElementById("editProductPrice").value = product.price;
            document.getElementById("editProductStock").value = product.stock;
            document.getElementById("editProductDescription").value = product.description;
            // (document.getElementById("editProductStatus") as HTMLTextAreaElement).value = product.status;
            // Hiển thị ảnh sản phẩm hiện tại
            const imagePreview = document.getElementById("editProductImagePreview");
            imagePreview.src = product.image || "/api/placeholder/100/100";
            // Hiển thị modal
            const editModal = new bootstrap.Modal(document.getElementById("editProductModal"));
            editModal.show();
        }
        catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
            alert("Không thể tải thông tin sản phẩm!");
        }
    }
}));
(_e = document.getElementById("saveEditedProduct")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(document.getElementById("editProductId").value);
    if (!id) {
        alert("Lỗi: ID sản phẩm không hợp lệ!");
        return;
    }
    const formData = new FormData();
    formData.append("name", document.getElementById("editProductName").value);
    formData.append("categoryId", document.getElementById("editProductCategory").value);
    formData.append("price", document.getElementById("editProductPrice").value);
    formData.append("stock", document.getElementById("editProductStock").value);
    formData.append("description", document.getElementById("editProductDescription").value);
    // formData.append("status", (document.getElementById("editProductStatus") as HTMLTextAreaElement).value);
    const imageInput = document.getElementById("editProductImage");
    if (imageInput.files && imageInput.files[0]) {
        formData.append("image", imageInput.files[0]);
    }
    try {
        const response = yield fetch(`http://localhost:3000/products/update/${id}`, {
            method: "PUT",
            body: formData,
        });
        const result = yield response.json();
        console.log("Response:", result);
        if (response.ok) {
            alert("Product updated successfully!");
            document.getElementById("editProductModal").classList.remove("show");
            renderProducts();
        }
        else {
            alert("Error updating product: " + result.message);
        }
    }
    catch (error) {
        console.error("Error:", error);
        alert("Failed to update product!");
    }
}));
document.addEventListener("DOMContentLoaded", renderProducts);
