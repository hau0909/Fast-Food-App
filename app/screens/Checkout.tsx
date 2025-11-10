import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import { COLORS } from "../styles/colors";
import Entypo from "@expo/vector-icons/Entypo";
import { Cart } from "../type/Cart";
import { CartItem } from "../type/CartItem";
import { calculateTotalPrice } from "../utils/calculateTotalPrice";
import CheckoutHeader from "../components/CheckoutHeader";
import { createOrder } from "../services/orderApi";
import { getProfile } from "../services/profileApi";
import { clearCart } from "../services/cartApi";

export default function Checkout({ route, navigation }: any) {
  const [cart, setCart] = useState<Cart | null>(route.params?.cart || null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cart) {
      setTotal(calculateTotalPrice(cart));
    }
  }, [cart]);

  const handlePlaceOrder = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return Alert.alert("Error", "Your cart is empty.");
    }

    try {
      setLoading(true);

      // Lấy thông tin người dùng từ API profile
      const profileRes = await getProfile();
      if (!profileRes.success || !profileRes.data) {
        setLoading(false);
        return Alert.alert(
          "Error",
          profileRes.err || "Failed to fetch profile info."
        );
      }

      const user = profileRes.data;

      //  Chuẩn hóa dữ liệu order gửi lên server
      const orderData = {
        delivery_address: user.address || "Chưa có địa chỉ", // fallback nếu chưa có
        phone_number: user.phone_number || "Chưa có số điện thoại",
        note: "Giao trong hôm nay", // hoặc bạn có thể thêm input cho người dùng nhập
        shipping_fee: 2,
        items: cart.items.map((item) => ({
          product_id: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      // Gọi API tạo đơn hàng
      const res = await createOrder(orderData);

      if (res.success) {
        await clearCart();
        Alert.alert("Success", "Your order has been placed successfully!", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("Orders", { fromCheckout: true }),
          },
        ]);
      } else {
        Alert.alert("Error", res.err || "Failed to create order.");
      }
    } catch (error) {
      console.error("Order Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <View style={[GLOBAL_STYLE.centered, { flex: 1 }]}>
        <Text style={styles.emptyText}>No items to checkout.</Text>
      </View>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <View style={[GLOBAL_STYLE.centered, { flex: 1 }]}>
        <Text style={styles.emptyText}>No items to checkout.</Text>
      </View>
    );
  }

  return (
    <View style={[GLOBAL_STYLE.container, { paddingBottom: 90 }]}>
      <CheckoutHeader />

      <FlatList
        data={cart.items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <CheckoutItem item={item} />}
        style={{ marginTop: 10 }}
      />

      <View style={[GLOBAL_STYLE.row, styles.footer]}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={handlePlaceOrder}>
          <Text style={styles.btnText}>Place Order</Text>
          <Entypo name="chevron-right" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CheckoutItem({ item }: { item: CartItem }) {
  const { product, quantity } = item;
  const price = product?.price || 0;
  const total = quantity * price;
  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/5787/5787100.png";

  return (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: product?.image_url || defaultImage }}
        style={styles.image}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text numberOfLines={2} style={styles.itemName}>
          {product?.name || "Unnamed Product"}
        </Text>
        <Text style={styles.itemText}>Quantity: {quantity}</Text>
        <Text style={styles.itemText}>Price: ${price.toFixed(2)}</Text>
        <Text style={styles.itemTotal}>Subtotal: ${total.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 3,
  },
  itemText: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  itemTotal: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 50,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
    marginRight: 5,
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
  },
});
