import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type ProductFilters = {
  name?: string;
  category_id?: string;
  is_available?: boolean;
  sortBy?: string;
  order?: "asc" | "desc";
};

export const getAllProduct = async (filters: ProductFilters = {}) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return { success: false, err: "Missing token" };
    }

    const query = new URLSearchParams();

    if (filters.name) query.append("name", filters.name);
    if (filters.category_id) query.append("category_id", filters.category_id);
    if (filters.is_available !== undefined) {
      query.append("is_available", String(filters.is_available));
    }
    if (filters.sortBy) query.append("sortBy", filters.sortBy);
    if (filters.order) query.append("order", filters.order);

    const url = `${API_URL}/api/products?${query.toString()}`;
    // console.log("Product API URL:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        err: data?.message || "Failed to fetch products",
      };
    }

    return {
      success: true,
      data: data.data, // products array
      total: data.total,
      totalPages: data.totalPages,
    };
  } catch (error) {
    return {
      success: false,
      err: "Network error, please try again",
    };
  }
};

export const getProductById = async (productId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return { success: false, err: "Missing token" };
    }

    // Kiểm tra xem productId có được cung cấp hay không
    if (!productId) {
      return { success: false, err: "Product ID is required" };
    }

    const url = `${API_URL}/api/products/${productId}`;
    // console.log("Get Product By ID URL:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        err: data?.message || `Failed to fetch product with ID ${productId}`,
      };
    }

    return {
      success: true,
      data: data, // Dữ liệu sản phẩm
    };
  } catch (error) {
    return {
      success: false,
      err: "Network error, please try again",
    };
  }
};
