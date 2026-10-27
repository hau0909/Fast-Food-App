import AsyncStorage from "@react-native-async-storage/async-storage";
import { Order } from "../type/Order";
import { OrderItem } from "../type/OrderItem";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface ApiOrder extends Omit<Order, "items"> {
  items: OrderItem[];
}

// Cập nhật kiểu dữ liệu trả về cho hàm
type GetUserOrdersResponse = {
  orders: Omit<Order, "items">[];
  orderItems: OrderItem[];
};

/**
 * Lấy tất cả đơn hàng của người dùng, trả về 2 mảng riêng biệt cho orders và orderItems.
 * @returns {Promise<{success: boolean, data?: GetUserOrdersResponse, err?: string}>}
 */
export const getUserOrders = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return { success: false, err: "Missing token" };

    const res = await fetch(`${API_URL}/api/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const rawData: ApiOrder[] = await res.json(); // Gán type cho dữ liệu thô
    if (!res.ok) {
      return {
        success: false,
        err: (rawData as any)?.message || "Failed to fetch orders",
      };
    }

    // --- SỬ DỤNG REDUCE ĐỂ XỬ LÝ VÀ TÁCH DỮ LIỆU ---

    // Giá trị khởi tạo cho reduce, chứa 2 mảng rỗng
    const initialState: GetUserOrdersResponse = {
      orders: [],
      orderItems: [],
    };

    const processedData = rawData.reduce((accumulator, currentOrder) => {
      // 1. Tách `items` ra khỏi thông tin còn lại của `currentOrder`
      const { items, ...orderInfo } = currentOrder;

      // 2. Thêm thông tin order (không có items) vào mảng `orders`
      accumulator.orders.push(orderInfo);

      // 3. Biến đổi từng item và thêm vào mảng `orderItems`
      if (items && items.length > 0) {
        const transformedItems: OrderItem[] = items.map((item) => ({
          _id: item._id,
          quantity: item.quantity,
          price: item.price,
          product_id: item.product_id, // Đổi tên `product_id` thành `product`
          order_id: currentOrder._id, // Thêm ID của order cha
        }));

        // Dùng spread syntax (...) để nối mảng transformedItems vào mảng orderItems
        accumulator.orderItems.push(...transformedItems);
      }

      // Trả về accumulator đã được cập nhật cho lần lặp tiếp theo
      return accumulator;
    }, initialState); // Truyền giá trị khởi tạo vào reduce

    // --- KẾT THÚC XỬ LÝ ---

    // console.log("Processed Data:", JSON.stringify(processedData, null, 2));

    // Trả về đối tượng chứa 2 mảng đã được tách và xử lý
    return { success: true, data: processedData };
  } catch (error) {
    return { success: false, err: "Network error, please try again" };
  }
};

/**
 * Lấy thông tin chi tiết của một đơn hàng
 * @param {string} orderId - ID của đơn hàng cần lấy
 * @returns {Promise<{success: boolean, data?: Order, err?: string}>}
 */
export const getOrderById = async (orderId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return { success: false, err: "Missing token" };

    const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
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
        err: data?.message || "Failed to fetch order details",
      };
    }

    return { success: true, data: data as Order };
  } catch (error) {
    return { success: false, err: "Network error, please try again" };
  }
};

// checkout
export const createOrder = async (orderData: any) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return { success: false, err: "Missing token" };

    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, err: data?.message || "Failed to create order" };
    }

    // API trả về { message, order, items }
    return { success: true, data: data };
  } catch (error) {
    return { success: false, err: "Network error, please try again" };
  }
};

/**
 * Hủy một đơn hàng
 * @param {string} orderId - ID của đơn hàng cần hủy
 * @returns {Promise<{success: boolean, data?: Order, err?: string}>}
 */
export const cancelOrder = async (orderId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return { success: false, err: "Missing token" };

    // Backend route là [PUT] /api/orders/:id/
    const res = await fetch(`${API_URL}/api/orders/${orderId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, err: data?.message || "Failed to cancel order" };
    }

    // API trả về đơn hàng đã được cập nhật
    return { success: true, data: data as Order };
  } catch (error) {
    return { success: false, err: "Network error, please try again" };
  }
};
