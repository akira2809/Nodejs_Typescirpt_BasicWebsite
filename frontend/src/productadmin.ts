interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    status: string;
    description: string;
    image: string;
    categoryId: number;
    categoryname: string;
}
declare var bootstrap: any;

class ProductService {
    private static BASE_URL = "http://localhost:3000/products";

    static async getProducts(): Promise<Product[]> {
        const response = await fetch(`${this.BASE_URL}/`);
        return response.json();
    }
    static async getProductById(id: number): Promise<Product> {
        const response = await fetch(`${this.BASE_URL}/${id}`);
        return response.json();
    }

    static async createProduct(product: Partial<Product>) {
        await fetch(`${this.BASE_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });
    }

    static async updateProduct(id: number, product: Partial<Product>) {
        await fetch(`${this.BASE_URL}/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });
    }

    static async deleteProduct(id: number) {
        await fetch(`${this.BASE_URL}/delete/${id}`, {
            method: "DELETE",
        });
    }
}

async function renderProducts() {
    // Kiểm tra nếu DataTable đã được khởi tạo, nếu có thì xóa
    if ($.fn.DataTable.isDataTable("#productTable")) {
        $("#productTable").DataTable().destroy();
    }

    const tableBody = document.getElementById("productTableBody")!;
    tableBody.innerHTML = "";

    const products = await ProductService.getProducts();

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
}


document.getElementById("saveNewProduct")?.addEventListener("click", async () => {
    const name = (document.getElementById("addProductName") as HTMLInputElement).value;
    const categoryId = parseInt((document.getElementById("addProductCategory") as HTMLSelectElement).value, 10);
    const price = parseFloat((document.getElementById("addProductPrice") as HTMLInputElement).value);
    const stock = parseInt((document.getElementById("addProductStock") as HTMLInputElement).value, 10);
    const description = (document.getElementById("addProductDescription") as HTMLTextAreaElement).value;

    const imageInput = document.getElementById("addProductImage") as HTMLInputElement;
    const image = imageInput.files?.[0] ? URL.createObjectURL(imageInput.files[0]) : "default.jpg";

    await ProductService.createProduct({ name, categoryId, price, stock, description, status: "Active", image });
    renderProducts();
});


document.getElementById("saveNewProduct")?.addEventListener("click", async () => {
    const formData = new FormData();

    // Lấy dữ liệu từ form
    formData.append("name", (document.getElementById("addProductName") as HTMLInputElement).value);
    formData.append("categoryId", (document.getElementById("addProductCategory") as HTMLSelectElement).value);
    formData.append("price", (document.getElementById("addProductPrice") as HTMLInputElement).value);
    formData.append("stock", (document.getElementById("addProductStock") as HTMLInputElement).value);
    formData.append("description", (document.getElementById("addProductDescription") as HTMLTextAreaElement).value);

    // Lấy file từ input và thêm vào FormData
    const imageInput = document.getElementById("addProductImage") as HTMLInputElement;
    if (imageInput.files && imageInput.files[0]) {
        formData.append("image", imageInput.files[0]);
    }

    try {
        const response = await fetch("http://localhost:3000/products/create", {
            method: "POST",
            body: formData, // Gửi FormData thay vì JSON
        });

        const result = await response.json();
        console.log("Response:", result);

        if (response.ok) {
            alert("Product added successfully!");
            (document.getElementById("addProductForm") as HTMLFormElement)?.reset(); // Reset form sau khi thành công
            renderProducts(); // Tải lại danh sách sản phẩm
        } else {
            alert("Error adding product: " + result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to add product!");
    }
});


document.getElementById("productTableBody")?.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const deleteButton = target.closest(".delete-btn") as HTMLButtonElement;
    if (deleteButton) {
        const id = Number(deleteButton.dataset.id);
        if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            await ProductService.deleteProduct(id);
            renderProducts();
        }
    }
});

document.getElementById("productTableBody")?.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const editButton = target.closest(".edit-btn") as HTMLButtonElement;
    if (editButton) {
        const id = Number(editButton.dataset.id);
        console.log("ID sản phẩm cần sửa:", id);

        // Lấy dữ liệu sản phẩm từ API
        try {
            const response = await fetch(`http://localhost:3000/products/${id}`);
            const product = await response.json();

            // Đổ dữ liệu vào form
            (document.getElementById("editProductId") as HTMLInputElement).value = product.id;
            (document.getElementById("editProductName") as HTMLInputElement).value = product.name;
            (document.getElementById("editProductCategory") as HTMLSelectElement).value = product.categoryId;
            (document.getElementById("editProductPrice") as HTMLInputElement).value = product.price;
            (document.getElementById("editProductStock") as HTMLInputElement).value = product.stock;
            (document.getElementById("editProductDescription") as HTMLTextAreaElement).value = product.description;
            // (document.getElementById("editProductStatus") as HTMLTextAreaElement).value = product.status;
        
            // Hiển thị ảnh sản phẩm hiện tại
            const imagePreview = document.getElementById("editProductImagePreview") as HTMLImageElement;
            imagePreview.src = product.image || "/api/placeholder/100/100";

            // Hiển thị modal
            const editModal = new bootstrap.Modal(document.getElementById("editProductModal")!);
            editModal.show();
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
            alert("Không thể tải thông tin sản phẩm!");
        }
    }
});

document.getElementById("saveEditedProduct")?.addEventListener("click", async () => {
    const id = Number((document.getElementById("editProductId") as HTMLInputElement).value);
    if (!id) {
        alert("Lỗi: ID sản phẩm không hợp lệ!");
        return;
    }

    const formData = new FormData();
    formData.append("name", (document.getElementById("editProductName") as HTMLInputElement).value);
    formData.append("categoryId", (document.getElementById("editProductCategory") as HTMLSelectElement).value);
    formData.append("price", (document.getElementById("editProductPrice") as HTMLInputElement).value);
    formData.append("stock", (document.getElementById("editProductStock") as HTMLInputElement).value);
    formData.append("description", (document.getElementById("editProductDescription") as HTMLTextAreaElement).value);
    // formData.append("status", (document.getElementById("editProductStatus") as HTMLTextAreaElement).value);
    const imageInput = document.getElementById("editProductImage") as HTMLInputElement;
    if (imageInput.files && imageInput.files[0]) {
        formData.append("image", imageInput.files[0]);
    }

    try {
        const response = await fetch(`http://localhost:3000/products/update/${id}`, {
            method: "PUT",
            body: formData,
        });

        const result = await response.json();
        console.log("Response:", result);

        if (response.ok) {
            alert("Product updated successfully!");
            (document.getElementById("editProductModal") as HTMLElement).classList.remove("show");
            renderProducts();
        } else {
            alert("Error updating product: " + result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to update product!");
    }
});



document.addEventListener("DOMContentLoaded", renderProducts);