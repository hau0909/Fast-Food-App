import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import { COLORS } from "../styles/colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../type/Route";
import { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { signUpRequest } from "../services/auth";

export default function Register() {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAdress] = useState("");

  const [err, setErr] = useState({
    common: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    adress: "",
  });

  const handleSignUp = async () => {
    setIsSigningUp(true);

    setErr({
      common: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phoneNumber: "",
      adress: "",
    });

    let hasError = false;
    const newErr = {
      common: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phoneNumber: "",
      adress: "",
    };

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

    if (!confirmPassword.trim()) {
      newErr.confirmPassword = "Please enter confirm password.";
      hasError = true;
    } else if (confirmPassword !== password) {
      newErr.confirmPassword = "Please make sure your password match.";
      hasError = true;
    }

    if (!fullName.trim()) {
      newErr.fullName = "Please enter your full name.";
      hasError = true;
    }

    if (!phoneNumber.trim()) {
      newErr.phoneNumber = "Please enter your phone number.";
      hasError = true;
    } else if (!/^[0-9]+$/.test(phoneNumber)) {
      newErr.phoneNumber = "Phone number must contain only digits.";
      hasError = true;
    } else if (phoneNumber.length < 9 || phoneNumber.length > 11) {
      newErr.phoneNumber = "Phone number must be between 9 and 11 digits.";
      hasError = true;
    }

    if (!address.trim()) {
      newErr.adress = "Please enter your adress.";
      hasError = true;
    }

    if (hasError) {
      setErr(newErr);
      setIsSigningUp(false);
      return;
    }

    try {
      const { success, err } = await signUpRequest({
        email: email.trim(),
        password: password.trim(),
        address: address.trim(),
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
      });

      if (success) {
        Alert.alert(
          "Success",
          "Your account has been created",
          [
            {
              text: "Ok",
              onPress: () => {
                navigation.navigate("Login");
                console.log("Sign up successful");
              },
            },
          ],
          { cancelable: false }
        );
        setIsSigningUp(false);
      } else {
        Alert.alert(
          "Create user Failed",
          err,
          [
            {
              text: "Ok",
            },
          ],
          { cancelable: false }
        );
        setErr((prev) => ({
          ...prev,
          common: err,
        }));
        setIsSigningUp(false);
      }
    } catch (error) {
      setErr((prev) => ({
        ...prev,
        common: "Something went wrong, please try again later.",
      }));
      setIsSigningUp(false);
    }
  };

  return (
    <View style={[GLOBAL_STYLE.container, { paddingHorizontal: 30 }]}>
      {/* title */}
      <View style={[GLOBAL_STYLE.centered, { paddingBottom: 20 }]}>
        <Text style={GLOBAL_STYLE.title}>Sign Up</Text>
      </View>

      {/* Sign up form */}
      <View style={[GLOBAL_STYLE.col, { rowGap: 10 }]}>
        {/* email */}
        <View style={{ rowGap: 2 }}>
          <Text style={GLOBAL_STYLE.subtitle}>Email</Text>
          <TextInput
            style={GLOBAL_STYLE.input}
            placeholder="Enter your email"
            onChangeText={(value) => setEmail(value)}
          />
          <Text style={GLOBAL_STYLE.errorText}>{err?.email}</Text>
        </View>

        {/* password */}
        <View style={{ rowGap: 2 }}>
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

        {/* confirm password */}
        <View style={{ rowGap: 2 }}>
          <Text style={GLOBAL_STYLE.subtitle}>Confirm Password</Text>
          <View style={{ position: "relative" }}>
            <TextInput
              style={[GLOBAL_STYLE.input, { paddingRight: 40 }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholder="Enter your password"
            />

            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: [{ translateY: -12 }],
              }}
            >
              <Entypo
                name={showConfirmPassword ? "eye" : "eye-with-line"}
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
          <Text style={GLOBAL_STYLE.errorText}>{err?.confirmPassword}</Text>
        </View>

        {/* Full name */}
        <View style={{ rowGap: 2 }}>
          <Text style={GLOBAL_STYLE.subtitle}>Full name</Text>
          <TextInput
            style={GLOBAL_STYLE.input}
            placeholder="Enter your full name"
            onChangeText={(value) => setFullName(value)}
          />
          <Text style={GLOBAL_STYLE.errorText}>{err?.fullName}</Text>
        </View>

        {/* Phone */}
        <View style={{ rowGap: 2 }}>
          <Text style={GLOBAL_STYLE.subtitle}>Phone number</Text>
          <TextInput
            style={GLOBAL_STYLE.input}
            placeholder="Enter your phone number"
            onChangeText={(value) => setPhoneNumber(value)}
          />
          <Text style={GLOBAL_STYLE.errorText}>{err?.phoneNumber}</Text>
        </View>

        {/* Address */}
        <View style={{ rowGap: 2 }}>
          <Text style={GLOBAL_STYLE.subtitle}>Address</Text>
          <TextInput
            style={GLOBAL_STYLE.input}
            placeholder="Enter your adress"
            onChangeText={(value) => setAdress(value)}
          />
          <Text style={GLOBAL_STYLE.errorText}>{err?.adress}</Text>
        </View>

        <TouchableOpacity
          style={GLOBAL_STYLE.centered}
          onPress={handleSignUp}
          disabled={isSigningUp}
        >
          <View
            style={[
              isSigningUp ? GLOBAL_STYLE.btnDisable : GLOBAL_STYLE.btnPrimary,
            ]}
          >
            <Text style={GLOBAL_STYLE.btnText}>
              {isSigningUp ? "Signing in..." : "Sign in"}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={GLOBAL_STYLE.centered}>
          <Text style={[GLOBAL_STYLE.errorText]}>{err?.common}</Text>
        </View>
      </View>

      <View style={GLOBAL_STYLE.centered}>
        <View
          style={{
            backgroundColor: COLORS.secondary,
            width: "75%",
            height: 5,
            borderRadius: 50,
          }}
        ></View>
      </View>

      {/* sign up navigate */}
      <View
        style={[
          GLOBAL_STYLE.row,
          GLOBAL_STYLE.centered,
          { columnGap: 5, marginBottom: 10 },
        ]}
      >
        <Text style={GLOBAL_STYLE.text}>Have an Account? </Text>
        <Text
          style={[GLOBAL_STYLE.subtitle, { color: COLORS.primary }]}
          onPress={() => navigation.navigate("Login")}
        >
          Login Here
        </Text>
      </View>
    </View>
  );
}
