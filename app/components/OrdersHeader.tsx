import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../type/Route";
import Entypo from "@expo/vector-icons/Entypo";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import { COLORS } from "../styles/colors";

export default function OrdersHeader() {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const route = useRoute();
  return (
    <View style={[GLOBAL_STYLE.row, styles.header]}>
      <TouchableOpacity
        onPress={() => {
          if ((route.params as any)?.fromCheckout) {
            navigation.navigate("MainTabs", { screen: "Home" });
          } else {
            navigation.goBack();
          }
        }}
      >
        <Entypo name="chevron-left" size={30} color={COLORS.primary} />
      </TouchableOpacity>
      <Text style={GLOBAL_STYLE.title}>Orders History</Text>
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
