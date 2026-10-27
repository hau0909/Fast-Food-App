import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert, // Giữ nguyên Alert import theo code gốc
} from "react-native";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import { COLORS } from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import OrdersHeader from "../components/OrdersHeader";
import { cancelOrder, getUserOrders } from "../services/orderApi";
import { Order } from "../type/Order";
import { OrderItem } from "../type/OrderItem";
import { getProductById } from "../services/productApi";
import { formatMoney } from "../utils/formatMoney";

export default function OrderHistoryScreen() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    const result = await getUserOrders();

    if (result.success && result.data) {
      const { orders, orderItems } = result.data;
      setOrders(orders);
      setOrderItems(orderItems);
      setLoading(false);  
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrder();
    }, [])
  );

  const handleDelete = (id: string) => {
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const res = await cancelOrder(id);
            if (res.success) {
              await fetchOrder();
              Alert.alert("Cancel Order", "Order cancelled successfully");
            } else {
              Alert.alert("Cancel Order", "Failed to cancel order");
            }
          } catch (error) {
            console.error("Cancel order error:", error);
            Alert.alert("Cancel Order", "An error occurred while cancelling");
          }
        },
      },
    ]);
  };

  const renderOrder = ({ item: order }: { item: Order }) => {
    // Hàm capitalize giữ nguyên
    const capitalize = (s: any) => {
      if (typeof s !== "string") return "";
      return s.charAt(0).toUpperCase() + s.slice(1);
    };

    // BIẾN HÀM NÀY THÀNH ASYNC
    const showOrderDetails = async () => {
      // 1. Lọc ra các item thuộc đơn hàng này
      const myItems = orderItems.filter((item) => item.order_id === order._id);

      try {
        // (Gợi ý UX: Bạn có thể hiển thị một spinner/loading ở đây)

        // 2. Tạo một mảng các promise, mỗi promise là một lệnh gọi API getProductById
        const productDetailPromises = myItems.map((item) =>
          getProductById(item.product_id)
        );

        // 3. Chờ cho tất cả các promise hoàn thành với Promise.all
        const productResults = await Promise.all(productDetailPromises);

        // 4. Tạo chuỗi hiển thị sản phẩm từ kết quả trả về
        const itemsString = myItems
          .map((item, index) => {
            const result = productResults[index];

            // Lấy tên sản phẩm nếu API gọi thành công, nếu không thì hiển thị ID
            const productName =
              result.success && result.data
                ? result.data.name
                : `Product ID: ${item.product_id}`;

            return `${productName}           x${item.quantity}\t\t${formatMoney(
              item.price
            )}`;
          })
          .join("\n\n");

        // 5. Tạo chuỗi tóm tắt đơn hàng (giữ nguyên)
        const summaryString = [
          `----------------------------------`,
          `Shipping fee: ${formatMoney(order.shipping_fee)}`,
          `Total: ${formatMoney(order.total_price)}`,
          "",
          `Note: ${capitalize(order.note)}`,
          "",
          `Address: ${capitalize(order.delivery_address)}`,
          `Phone number: ${capitalize(order.phone_number)}`,
          `Status: ${capitalize(order.status)}`,
          `Payment: ${capitalize(order.payment_status)}`,
        ].join("\n");

        // 6. Hiển thị Alert với đầy đủ thông tin
        Alert.alert(
          `Order #${order._id.slice(-6).toUpperCase()}`,
          `${itemsString}\n\n${summaryString}`
        );

        // console.log(`Showing details for Order ID: ${order._id}`);
      } catch (error) {
        // Xử lý lỗi nếu Promise.all thất bại (ví dụ: lỗi mạng)
        console.error("Failed to fetch product details:", error);
        Alert.alert("Error", "Could not load order details. Please try again.");
      }
    };

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => showOrderDetails()} // onPress giờ sẽ gọi hàm async
      >
        {/* ...Phần JSX còn lại của bạn giữ nguyên... */}
        <View style={styles.rowBetween}>
          <Text style={styles.orderId}>
            #{order._id.slice(-6).toUpperCase()}
          </Text>
          <Text
            style={[
              styles.status,
              {
                backgroundColor:
                  order.status === "completed"
                    ? "green"
                    : order.status === "pending"
                    ? "orange"
                    : order.status === "cancelled"
                    ? "grey"
                    : COLORS.primary,
              },
            ]}
          >
            {order.status.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.date}>
          {new Date(order.createdAt).toLocaleDateString()}
        </Text>
        <View style={styles.rowBetween}>
          <Text style={styles.total}>
            Total: {formatMoney(order.total_price)}
          </Text>

          {order.status === "pending" && (
            <TouchableOpacity
              onPress={() => handleDelete(order._id)}
              style={[GLOBAL_STYLE.btnPrimary, { width: 70, height: 25 }]}
            >
              <Text style={[GLOBAL_STYLE.btnText, { fontSize: 13 }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[GLOBAL_STYLE.container, { paddingTop: 20 }]}>
      <OrdersHeader />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ flex: 1, justifyContent: "center" }}
        />
      ) : orders.length === 0 ? (
        <Text style={styles.emptyText}>No orders found.</Text>
      ) : (
        <FlatList
          style={{ marginVertical: 10 }}
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrder}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 0.5,
    borderColor: COLORS.secondary,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontWeight: "700",
    color: COLORS.text,
    fontSize: 15,
  },
  status: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  date: {
    color: COLORS.secondary,
    marginTop: 4,
    marginBottom: 8,
    fontSize: 13,
  },
  total: {
    fontWeight: "600",
    color: COLORS.text,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: COLORS.secondary,
    fontSize: 15,
  },
});
