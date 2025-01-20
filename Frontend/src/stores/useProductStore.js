import { create } from 'zustand'; // Import thư viện Zustand
import axios from '../lib/axios.js'; // Import thư viện Axios để gọi API
import { toast } from 'react-hot-toast'; // Import thư viện react-toastify để hiển thị thông báo lỗi

// Tạo store sử dụng Zustand
export const useProductStore = create((set) => ({
  // Trạng thái ban đầu
  products: [], // Danh sách sản phẩm, ban đầu là một mảng rỗng
  loading: false, // Trạng thái tải dữ liệu, mặc định là false,

  // Hàm cập nhật danh sách sản phẩm
  setProducts: (products) => set({ products }),

  // Hàm tạo sản phẩm mới
  createProduct: async (productData) => {
    // Đặt trạng thái loading thành true
    set({ loading: true });
    try {
      // Gửi yêu cầu POST để tạo sản phẩm mới
      const res = await axios.post('/products', productData);

      // Cập nhật trạng thái với sản phẩm mới và tắt trạng thái loading
      set((prevState) => ({
        products: [...prevState.products, res.data], // Thêm sản phẩm mới vào danh sách
        loading: false, // Đặt trạng thái loading thành false
      }));
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có
      toast.error(error.response?.data?.error || 'Có lỗi xảy ra!');
      // Tắt trạng thái loading
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
  fetchAllProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
  toggleFeaturedProduct: async (productId) => {
    // Bắt đầu trạng thái đang tải
    set({ loading: true });

    try {
      // Gửi yêu cầu PATCH để cập nhật trạng thái đặc trưng của sản phẩm
      const response = await axios.patch(`/products/${productId}`);

      // Cập nhật trạng thái của sản phẩm trong store
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
        ),
        loading: false, // Kết thúc trạng thái đang tải
      }));
    } catch (error) {
      // Xử lý lỗi và kết thúc trạng thái đang tải
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to update product");
    }
  },
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prev) => ({
        products: prev.products.filter((product) => product._id !== productId),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || "Failed to delete product");
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
    }
  }
}));  
