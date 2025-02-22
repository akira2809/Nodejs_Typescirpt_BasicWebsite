// 📂 src/categoryadmin.ts

interface Category {
  id: number;
  name: string;
  parentCategory?: string;
  description: string;
  productCount: number;
  status: string;
  iconUrl: string;
}

class CategoryService {
  private static BASE_URL = "http://localhost:3000/categories";

  static async getCategories(): Promise<Category[]> {
      const response = await fetch(`${this.BASE_URL}/category`);
      return response.json();
  }

  static async getCategoryById(id: number): Promise<Category> {
      const response = await fetch(`${this.BASE_URL}/${id}`);
      return response.json();
  }

  static async createCategory(category: Partial<Category>) {
      await fetch(`${this.BASE_URL}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
      });
  }

  static async updateCategory(id: number, category: Partial<Category>) {
      await fetch(`${this.BASE_URL}/update/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
      });
  }

  static async deleteCategory(id: number) {
      await fetch(`${this.BASE_URL}/delete/${id}`, {
          method: "DELETE",
      });
  }
}

// 📌 Hiển thị danh mục trong bảng
async function renderCategories() {
  const tableBody = document.getElementById("categoryTableBody")!;
  tableBody.innerHTML = "";
  const categories = await CategoryService.getCategories();

  categories.forEach((category) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td><img src="${category.iconUrl}" class="category-icon" alt="${category.name}"></td>
          <td>${category.name}</td>
          <td>${category.parentCategory || "-"}</td>
         <td>${category.description}</td>
          <td>${category.productCount}</td>
          <td><span class="badge bg-${category.status === "Active" ? "success" : "danger"}">${category.status}</span></td>
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
}

// 📌 Xử lý thêm danh mục
document.getElementById("saveNewCategory")!.addEventListener("click", async () => {
  await CategoryService.createCategory({
      name: (document.getElementById("addCategoryName") as HTMLInputElement).value,
      description: (document.getElementById("addCategoryDescription") as HTMLTextAreaElement).value,
      status: (document.getElementById("addCategoryStatus") as HTMLSelectElement).value,
  });
  renderCategories();
});

// 📌 Load dữ liệu vào modal chỉnh sửa (Sửa lỗi không hiển thị)
// 📌 Load dữ liệu vào modal chỉnh sửa
document.getElementById("categoryTableBody")!.addEventListener("click", async (event) => {
  const target = event.target as HTMLElement;
  const editButton = target.closest(".edit-btn") as HTMLButtonElement;
  if (editButton) {
      const id = Number(editButton.dataset.id);

      try {
          let category = await CategoryService.getCategoryById(id);

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
          (document.getElementById("editCategoryId") as HTMLInputElement).value = category.id.toString();
          (document.getElementById("editCategoryName") as HTMLInputElement).value = category.name || "";
          (document.getElementById("editCategoryDescription") as HTMLTextAreaElement).value = category.description || "";
          (document.getElementById("editCategoryStatus") as HTMLSelectElement).value = category.status || "Inactive";

          // 🛠 Load danh mục cha
          const parentSelect = document.getElementById("editParentCategory") as HTMLSelectElement;
          parentSelect.innerHTML = `<option value="">None (Top Level)</option>`;
          const categories = await CategoryService.getCategories();
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
          document.getElementById("saveEditedCategory")!.onclick = async () => {
              await updateCategory(id);
          };

      } catch (error) {
          console.error("Lỗi khi tải danh mục:", error);
          alert("⚠️ Lỗi tải danh mục. Hãy thử lại!");
      }
  }
});



// 📌 Cập nhật danh mục khi nhấn Save
async function updateCategory(id: number) {
  const updatedCategory: Partial<Category> = {
      name: (document.getElementById("editCategoryName") as HTMLInputElement).value,
      description: (document.getElementById("editCategoryDescription") as HTMLTextAreaElement).value,
      status: (document.getElementById("editCategoryStatus") as HTMLSelectElement).value,
      parentCategory: (document.getElementById("editParentCategory") as HTMLSelectElement).value || undefined, // 🔥 FIX lỗi null
  };

  await CategoryService.updateCategory(id, updatedCategory);
  renderCategories();
  (document.querySelector("#editCategoryModal .btn-close") as HTMLButtonElement).click();
}

// 📌 Xóa danh mục
document.getElementById("categoryTableBody")!.addEventListener("click", async (event) => {
  const target = event.target as HTMLElement;
  const deleteButton = target.closest(".delete-btn") as HTMLButtonElement;
  if (deleteButton) {
      const id = Number(deleteButton.dataset.id);
      if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
          await CategoryService.deleteCategory(id);
          renderCategories();
      }
  }
});

// 📌 Chạy hàm render khi load trang
document.addEventListener("DOMContentLoaded", renderCategories);
