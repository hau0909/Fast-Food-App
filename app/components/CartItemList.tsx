import { FlatList, StyleSheet, Text, View } from "react-native";
import { Cart } from "../type/Cart";
import CartListItem from "./CartListItem";

export default function CartItemList({
  cart,
  onRefresh,
}: {
  cart: Cart;
  onRefresh: () => void;
}) {
  return (
    <View>
      <FlatList
        data={cart.items}
        numColumns={1}
        keyExtractor={(item) => item._id + ""}
        renderItem={({ item }) => (
          <View style={{ paddingBottom: 10 }}>
            <CartListItem cartItem={item} onRefresh={onRefresh} />
          </View>
        )}
      />
    </View>
  );
}
