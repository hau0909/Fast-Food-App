import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DetailsHeader from "../components/DetailsHeader";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import DetailsItem from "../components/DetailsItem";
import { COLORS } from "../styles/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Product } from "../type/Product";
import { useState } from "react";
import { addToCart } from "../services/cartApi";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../type/Route";

export default function Details({ route }: { route: any }) {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const product = route.params as Product;
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      const res = await addToCart(product._id, 1);
      if (res.success && res.data) {
        navigation.navigate("MainTabs", { screen: "Cart" });
        setIsAdding(false);
      } else {
        console.error("Failed to load cart:", res.err);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <View style={[GLOBAL_STYLE.container, { rowGap: 10 }]}>
      {/* header */}
      <DetailsHeader />

      {/* product detail */}
      <DetailsItem product={product} />

      {/* Add to cart */}
      <View style={[GLOBAL_STYLE.row, styles.addToCart]}>
        <View style={[GLOBAL_STYLE.row, { columnGap: 5 }]}>
          <Text style={[GLOBAL_STYLE.subtitle, { fontSize: 20 }]}>Price: </Text>
          <Text style={{ fontSize: 18 }}>${product.price}</Text>
        </View>

        <TouchableOpacity
          onPress={handleAdd}
          style={[
            GLOBAL_STYLE.row,
            isAdding ? styles.disableBtn : styles.btn,
            { justifyContent: "space-between", columnGap: 5 },
          ]}
          disabled={isAdding}
        >
          <Text style={styles.btnText}>Add to cart </Text>
          <FontAwesome name="shopping-cart" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addToCart: {
    position: "absolute",
    bottom: 15,
    left: 140,
    right: 20,

    backgroundColor: COLORS.white,

    paddingVertical: 5,
    paddingRight: 5,
    paddingLeft: 20,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#08CB00",
  },
  disableBtn: {
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#CBCBCB",
  },
  btnText: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: "600",
  },
});
