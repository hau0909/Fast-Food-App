import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../type/Route";
import Entypo from "@expo/vector-icons/Entypo";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import { COLORS } from "../styles/colors";

export default function CheckoutHeader() {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  return (
    <View style={[GLOBAL_STYLE.row, styles.header]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Entypo name="chevron-left" size={30} color={COLORS.primary} />
      </TouchableOpacity>
      <Text style={GLOBAL_STYLE.title}>Checkout Order</Text>
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginRight: 15,
    justifyContent: "space-between",
  },
});
