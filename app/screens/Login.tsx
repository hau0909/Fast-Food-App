import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../type/Route";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../styles/colors";
import Entypo from "@expo/vector-icons/Entypo";
import { loginRequest } from "../services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const { login } = useAuth();
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [isLogging, setIsLogging] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [err, setErr] = useState({
    common: "",
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    setIsLogging(true);

    setErr({ common: "", email: "", password: "" });

    let hasError = false;
    const newErr = { common: "", email: "", password: "" };

    if (!email.trim()) {
      newErr.email = "Please enter your email.";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErr.email = "Invalid email format.";
      hasError = true;
    }

    if (!password.trim()) {
      newErr.password = "Please enter your password.";
      hasError = true;
    } else if (password.length < 6) {
      newErr.password = "Password must be at least 6 characters.";
      hasError = true;
    }

    if (hasError) {
      setErr(newErr);
      setIsLogging(false);
      return;
    }

    try {
      setIsLogging(true);

      const { success, data, err } = await loginRequest({
        email: email.trim(),
        password: password.trim(),
      });

      if (success && data?.token) {
        console.log("Login success:", data);

        // Lưu token và user_id
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user_id", data.user_id);

        // Gọi hàm login() (context hoặc navigation)
        login();
      } else {
        setErr((prev) => ({
          ...prev,
          common: err,
        }));
      }
    } catch (error: any) {
      setErr((prev) => ({
        ...prev,
        common: "Something went wrong, please try again later.",
      }));
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <>
      <View style={[GLOBAL_STYLE.container, { paddingHorizontal: 30 }]}>
        {/* title */}
        <View style={[GLOBAL_STYLE.centered, { paddingBottom: 50 }]}>
          <Text style={GLOBAL_STYLE.title}>Login</Text>
        </View>

        {/* login form */}
        <View style={[GLOBAL_STYLE.col, { rowGap: 10 }]}>
          <View style={{ rowGap: 10 }}>
            <Text style={GLOBAL_STYLE.subtitle}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              style={GLOBAL_STYLE.input}
              onChangeText={(value) => setEmail(value)}
            />
            <Text style={GLOBAL_STYLE.errorText}>{err?.email}</Text>
          </View>

          <View style={{ rowGap: 10 }}>
            <Text style={GLOBAL_STYLE.subtitle}>Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                style={[GLOBAL_STYLE.input, { paddingRight: 40 }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: [{ translateY: -12 }],
                }}
              >
                <Entypo
                  name={showPassword ? "eye" : "eye-with-line"}
                  size={24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
            <Text style={GLOBAL_STYLE.errorText}>{err?.password}</Text>
          </View>

          <TouchableOpacity
            style={GLOBAL_STYLE.centered}
            onPress={handleLogin}
            disabled={isLogging}
          >
            <View
              style={[
                isLogging ? GLOBAL_STYLE.btnDisable : GLOBAL_STYLE.btnPrimary,
              ]}
            >
              <Text style={GLOBAL_STYLE.btnText}>
                {isLogging ? "Signing in..." : "Sign in"}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={GLOBAL_STYLE.centered}>
            <Text style={[GLOBAL_STYLE.errorText]}>{err?.common}</Text>
          </View>
        </View>

        {/* sign up navigate */}
        <View style={GLOBAL_STYLE.centered}>
          <View
            style={{
              backgroundColor: COLORS.secondary,
              width: "75%",
              height: 5,
              borderRadius: 50,
              marginBottom: 10,
            }}
          ></View>
        </View>

        <View
          style={[GLOBAL_STYLE.row, GLOBAL_STYLE.centered, { columnGap: 5 }]}
        >
          <Text style={GLOBAL_STYLE.text}>Don't have an Account? </Text>
          <Text
            style={[GLOBAL_STYLE.subtitle, { color: COLORS.primary }]}
            onPress={() => navigation.navigate("Register")}
          >
            Sign up Here
          </Text>
        </View>
      </View>
    </>
  );
}
