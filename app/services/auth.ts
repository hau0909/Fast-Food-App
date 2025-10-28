const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const loginRequest = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // parse JSON cẩn thận để bắt lỗi 4xx/5xx
    const data = await res.json();

    if (res.ok) {
      return {
        success: true,
        data,
      };
    } else {
      return {
        success: false,
        err: data.message,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      err: "Something went wrong, please try again!",
    };
  }
};

export const signUpRequest = async ({
  email,
  password,
  address,
  phoneNumber,
  fullName,
}: {
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  fullName: string;
}) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        address,
        phoneNumber,
        fullName,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        err: data.message,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      err: "Something went wrong, please try again!",
    };
  }
};

export const verifyToken = async (token: string) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return { valid: false, message: data.message };
    }

    // backend trả về valid: true
    return { valid: true, data };
  } catch (error: any) {
    console.error("Verify token error:", error.message);
    return { valid: false, message: "Network error or invalid response" };
  }
};
