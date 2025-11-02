import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../type/Route";
import CartHeader from "../components/CartHeader";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import CartItem from "../components/CartItem";
import { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { COLORS } from "../styles/colors";

export default function Cart() {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const [total, setTotal] = useState(100.5);

  return (
    <View style={GLOBAL_STYLE.container}>
      <CartHeader />

      {/* <CartItem orderItem={}/> */}

      <View style={[GLOBAL_STYLE.row, styles.checkoutZone]}>
        <View style={[GLOBAL_STYLE.row, { columnGap: 5 }]}>
          <Text style={[GLOBAL_STYLE.subtitle, { fontSize: 20 }]}>Toal: </Text>
          <Text style={{ fontSize: 18 }}>{total}$</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  checkoutZone: {
    columnGap: 10,
    justifyContent: "flex-end",
    margin: 5,
    borderRadius: 50,
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
});
