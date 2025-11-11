import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import { COLORS } from "../styles/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import { CartItem } from "../type/CartItem";
import { deleteCartItem, updateCartItemQuantity } from "../services/cartApi";
import { getImageUrl } from "../utils/getImgUrl";

export default function CartListItem({
  cartItem,
  onRefresh,
}: {
  cartItem: CartItem;
  onRefresh: () => void;
}) {
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const { product } = cartItem;
  const unitPrice = product.price;

  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/5787/5787100.png";

  useEffect(() => {
    if (quantity === cartItem.quantity) {
      return;
    }
    const handler = setTimeout(() => {
      updateQuantityOnServer(quantity);
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [quantity]);

  const updateQuantityOnServer = async (newQuantity: number) => {
    const res = await updateCartItemQuantity(cartItem._id, newQuantity);
    if (!res.success) {
      Alert.alert("Error", res.err || "Could not update item quantity.");
      setQuantity(cartItem.quantity);
    } else {
      onRefresh();
    }
  };

  const handleUpdateQuantity = ({ act }: { act: string }) => {
    if (act === "plus") {
      setQuantity((prev) => prev + 1);
      return;
    }
    if (quantity <= 1) {
      handleDelete();
    } else {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Ok",
        style: "destructive",
        onPress: async () => {
          const res = await deleteCartItem(cartItem._id);
          if (res.success) {
            onRefresh();
          } else {
            Alert.alert("Error", res.err || "Could not delete item.");
          }
        },
      },
    ]);
  };

  return (
    <View
      style={[
        GLOBAL_STYLE.row,
        styles.item,
        { justifyContent: "space-between" },
      ]}
    >
      <Image
        style={styles.img}
        source={{ uri: getImageUrl(product.image_url) }}
      />

      {/* name */}
      <View style={{ width: 180, rowGap: 4, paddingHorizontal: 5 }}>
        <Text numberOfLines={2} style={styles.itemText}>
          {product?.name}
        </Text>
        <View style={GLOBAL_STYLE.row}>
          <Text style={GLOBAL_STYLE.subtitle}>Price: </Text>
          <Text>{quantity * unitPrice}$</Text>
        </View>
      </View>

      {/* action plus and minus */}
      <View
        style={[GLOBAL_STYLE.row, { justifyContent: "center", columnGap: 10 }]}
      >
        <TouchableOpacity
          style={styles.actBtn}
          onPress={() => handleUpdateQuantity({ act: "minus" })}
        >
          <AntDesign name="minus" size={15} color="black" />
        </TouchableOpacity>

        <Text style={GLOBAL_STYLE.subtitle}>{quantity}</Text>

        <TouchableOpacity
          style={styles.actBtn}
          onPress={() => handleUpdateQuantity({ act: "plus" })}
        >
          <AntDesign name="plus" size={15} color="black" />
        </TouchableOpacity>
      </View>

      {/* action delete */}
      <View style={{ marginRight: 10 }}>
        <TouchableOpacity onPress={handleDelete}>
          <Feather name="trash" size={24} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    alignContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderColor: COLORS.secondary,
    borderWidth: 1,
  },
  img: {
    width: 75,
    height: 75,
    borderRadius: 10,
  },
  actBtn: {
    padding: 5,
    backgroundColor: COLORS.secondary,
    borderRadius: 5,
  },
  disableBtn: {
    padding: 5,
    backgroundColor: `${COLORS.secondary}30`,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
