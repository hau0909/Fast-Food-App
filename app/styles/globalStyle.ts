import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const GLOBAL_STYLE = StyleSheet.create({
  //  Layout
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  //  Text
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  text: {
    fontSize: 16,
    color: COLORS.text,
  },
  errorText: {
    fontStyle: "italic",
    fontSize: 13,
    color: COLORS.error,
    marginTop: 4,
  },

  //  Input
  input: {
    width: "100%",
    // height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 13,
    backgroundColor: COLORS.white,
    color: COLORS.text,
  },

  //  Button
  btnPrimary: {
    width: 100,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  btnSecondary: {
    width: "100%",
    height: 26,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btnDisable: {
    width: 100,
    height: 40,
    backgroundColor: COLORS.primary, // đừng dùng white nếu chữ trắng
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    opacity: 0.5, // 👈 hiệu ứng mờ disable cho dễ thấy
  },
  btnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },

  // flex
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  col: {
    flexDirection: "column",
  },

  // image
  image: {
    width: 200,
    height: 200,
    borderRadius: 25,
  },
});
