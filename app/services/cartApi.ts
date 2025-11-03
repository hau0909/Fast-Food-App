import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cart } from "../type/Cart";
import { CartItem } from "../type/CartItem";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getUserCart = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return { success: false, err: "Missing token" };
    }

    // Endpoint mới không cần userId trong URL
    const url = `${API_URL}/api/carts`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, err: data?.message || "Failed to fetch cart" };
    }

    // Dữ liệu trả về bây giờ khớp với interface Cart
    return { success: true, data: data as Cart };
  } catch (error) {
    return { success: false, err: "Network error, please try again" };
  }
};

export const addToCart = async (productId: string, quantity: number) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return { success: false, err: "Missing token" };
    }

    const url = `${API_URL}/api/carts/items`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId, quantity }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        err: data?.message || "Failed to add item to cart",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, err: "Network error, please try again" };
  }
};

export const updateCartItemQuantity = async (
  itemId: string,
  quantity: number
) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return { success: false, err: "Missing token" };
    }

    const url = `${API_URL}/api/carts/items/${itemId}`;

    const res = await fetch(url, {
      method: "PUT", // Hoặc "PATCH" tùy theo thiết kế backend của bạn
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        err: data?.message || "Failed to update item quantity",
      };
    }

    return { success: true, data: data.item as CartItem };
  } catch (error) {
    return { success: false, err: "Network error, please try again" };
  }
};

export const deleteCartItem = async (itemId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return { success: false, err: "Missing token" };
    }

    const url = `${API_URL}/api/carts/items/${itemId}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, err: data?.message || "Failed to delete item" };
    }

    // DELETE thường trả về status 200 hoặc 204 (No Content)
    // không có body, nên chỉ cần trả về success là đủ.
    return { success: true };
  } catch (error) {
    return { success: false, err: "Network error, please try again" };
  }
};
