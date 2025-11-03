import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../type/Route";
import CartHeader from "../components/CartHeader";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import { useCallback, useEffect, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { COLORS } from "../styles/colors";
import { getUserCart } from "../services/cartApi";
import CartItemList from "../components/CartItemList";
import { Cart } from "../type/Cart";
import { calculateTotalPrice } from "../utils/calculateTotalPrice";

export default function UserCart() {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  // Khởi tạo total là 0
  const [total, setTotal] = useState(0);
  const [userCart, setUserCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    const newTotal = calculateTotalPrice(userCart);
    setTotal(newTotal);
  }, [userCart]);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getUserCart();
      if (res.success && res.data) {
        setUserCart(res.data);
      } else {
        setUserCart(null);
        console.error("Failed to load cart:", res.err);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart]) // Phụ thuộc vào hàm loadCart đã được bọc bởi useCallback
  );

  const hasItems = userCart && userCart.items && userCart.items.length > 0;

  return (
    <View style={[GLOBAL_STYLE.container, { paddingBottom: 80 }]}>
      <CartHeader />

      {loading ? (
        <Text style={styles.infoText}>Loading your cart...</Text>
      ) : hasItems ? (
        <View style={{ marginBottom: 30 }}>
          <CartItemList cart={userCart} onRefresh={loadCart} />
        </View>
      ) : (
        <View style={[GLOBAL_STYLE.centered, { marginTop: 200, rowGap: 10 }]}>
          <Text style={styles.infoText}>Your cart is empty.</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Order now</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {hasItems && (
        <View style={[GLOBAL_STYLE.row, styles.checkoutZone]}>
          <View style={[GLOBAL_STYLE.row, { columnGap: 5 }]}>
            <Text style={[GLOBAL_STYLE.subtitle, { fontSize: 20 }]}>
              Total:{" "}
            </Text>
            <Text style={{ fontSize: 18 }}>${total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={[
              GLOBAL_STYLE.row,
              styles.btn,
              { justifyContent: "space-between" },
            ]}
          >
            <Text style={styles.btnText}>Checkout</Text>
            <Entypo name="chevron-right" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  checkoutZone: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,

    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "space-between",

    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  btn: {
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#08CB00",
  },
  btnText: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: "600",
  },
  infoText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "gray",
  },
});
