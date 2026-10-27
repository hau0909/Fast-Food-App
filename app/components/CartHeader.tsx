import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GLOBAL_STYLE } from "../styles/globalStyle";

export default function CartHeader() {
  return (
    <View style={[GLOBAL_STYLE.centered, styles.header]}>
      <Text style={GLOBAL_STYLE.title}>Cart</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 15,
    justifyContent: "space-between",
  },
});
