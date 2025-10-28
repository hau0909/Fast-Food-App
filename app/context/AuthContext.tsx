import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useContext, useEffect } from "react";
import { verifyToken } from "../services/auth";

interface AuthContextType {
  user: boolean;
  token: string | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");

        // nếu có token
        if (storedToken) {
          const res = await verifyToken(storedToken);

          // nếu token hợp lệ
          if (res.valid) {
            setToken(storedToken);
            setUser(true);
          } else {
            await AsyncStorage.removeItem("token");
          }
        }

        // clear storage
        // AsyncStorage.clear();
      } catch (err) {
        console.error("Token check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const login = () => {
    // logic xử lý sau khi đăng nhập thành công
    setUser(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
