var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_URL = 'http://127.0.0.1:3000'; // Chắc chắn rằng URL này đúng
// // Hàm tạo sản phẩm mới
// export const createProduct = async (data: CreateProductRequest): Promise<ProductResponse> => {
//   try {
//     const response = await fetch(`${BASE_URL}/products`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       throw new Error(`Error creating product: ${response.statusText}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error creating product:', error);
//     throw error;
//   }
// };
// Hàm lấy danh sách sản phẩm
export const getCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${BASE_URL}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Error fetching products: ${response.statusText}`);
        }
        return yield response.json();
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
});
