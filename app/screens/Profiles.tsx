import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import { COLORS } from "../styles/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RootStackParamList } from "../type/Route";
import { getProfile, updateProfile } from "../services/profileApi";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const { logout } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile khi vào màn hình
  useEffect(() => {
    (async () => {
      const res = await getProfile();

      if (res.success && res.data) {
        setFullName(res.data.full_name);
        setEmail(res.data.email);
        setPhone(res.data.phone_number);
        setAddress(res.data.address);
      } else {
        Alert.alert("Error", res.err || "Failed to load profile");
      }
    })();
  }, []);

  // Cập nhật thông tin người dùng
  const handleSave = async () => {
    const res = await updateProfile(fullName, phone, address);
    if (res.success) {
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } else {
      Alert.alert("Error", res.err);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView
      style={GLOBAL_STYLE.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[GLOBAL_STYLE.row, styles.header]}>
        <Text style={GLOBAL_STYLE.title}>Profile</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <FontAwesome
            name={isEditing ? "check" : "edit"}
            size={18}
            color={COLORS.white}
          />
          <Text style={styles.editBtnText}>{isEditing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={[styles.infoBox]}>
        {/* Full name */}
        <View style={styles.infoRow}>
          <Ionicons name="person" size={20} color={COLORS.primary} />
          <Text style={styles.label}>Full name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
            />
          ) : (
            <Text style={styles.value}>{fullName}</Text>
          )}
        </View>

        {/* Email (read-only) */}
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color={COLORS.primary} />
          <Text style={styles.label}>Email:</Text>
          <Text style={[styles.value, { color: COLORS.secondary }]}>
            {email}
          </Text>
        </View>

        {/* Phone */}
        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color={COLORS.primary} />
          <Text style={styles.label}>Phone:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{phone}</Text>
          )}
        </View>

        {/* Address */}
        <View style={styles.infoRow}>
          <Ionicons name="location-sharp" size={20} color={COLORS.primary} />
          <Text style={styles.label}>Address:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              multiline
            />
          ) : (
            <Text style={styles.value}>{address}</Text>
          )}
        </View>
      </View>

      {/* View Order History */}
      <TouchableOpacity
        style={[GLOBAL_STYLE.btnSecondary, GLOBAL_STYLE.row, styles.orderBtn]}
        onPress={() => navigation.navigate("Orders")}
      >
        <Ionicons name="list" size={20} color={COLORS.white} />
        <Text style={GLOBAL_STYLE.btnText}>View Order History</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        style={[GLOBAL_STYLE.btnPrimary, styles.logoutBtn]}
        onPress={handleLogout}
      >
        <Text style={GLOBAL_STYLE.btnText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  editBtnText: {
    color: COLORS.white,
    fontWeight: "600",
    marginLeft: 6,
  },
  infoBox: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 8,
    width: 90,
  },
  value: {
    flex: 1,
    color: COLORS.text,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: COLORS.text,
  },
  orderBtn: {
    alignSelf: "center",
    width: 200,
    marginBottom: 15,
  },
  logoutBtn: {
    alignSelf: "center",
    width: 150,
  },
});
