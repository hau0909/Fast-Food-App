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
import { useState } from "react";
import { OrderItem } from "../type/OrderItem";
import { CartItem } from "../type/CartItem";

export default function CartItem({ cartItem }: { cartItem: CartItem }) {
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [unitPrice, setUnitPrice] = useState(14.2);

  const handleUpdateQuantity = ({ act }: { act: string }) => {
    if (act === "plus") {
      setQuantity((prev) => prev + 1);
      return;
    }

    // act === minus
    if (quantity <= 1) {
      handleDelete();
    } else {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Ok",
        onPress: () => {},
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
        source={{
          uri: "https://img.freepik.com/free-vector/tasty-fast-food-collection_1308-133072.jpg?semt=ais_hybrid&w=740&q=80",
        }}
      />

      {/* name */}
      <View style={{ width: 180, rowGap: 4, paddingHorizontal: 5 }}>
        <Text numberOfLines={2} style={styles.itemText}>
          Beuasdjnjnj
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
