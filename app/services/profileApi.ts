import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../type/User";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Lấy thông tin user hiện tại
export const getProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return { success: false, err: "Missing token" };

    const res = await fetch(`${API_URL}/api/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        err: data?.message || "Failed to fetch profile",
      };

    return { success: true, data: data.data as User };
  } catch (error) {
    return { success: false, err: "Network error, please try again" };
  }
};

// Cập nhật profile (chỉ 3 field)
export const updateProfile = async (
  full_name: string,
  phone_number: string,
  address: string
) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return { success: false, err: "Missing token" };

    const res = await fetch(`${API_URL}/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ full_name, phone_number, address }),
    });

    const data = await res.json();
    if (!res.ok)
      return { success: false, err: data?.error || "Failed to update profile" };

    return { success: true, data };
  } catch (error) {
    return { success: false, err: "Network error, please try again" };
  }
};
