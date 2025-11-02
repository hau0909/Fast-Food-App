import { StyleSheet, Text, View } from "react-native";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import { COLORS } from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeHeader() {
  return (
    <View style={[GLOBAL_STYLE.centered, styles.header]}>
      <View style={[GLOBAL_STYLE.row, { columnGap: 10 }]}>
        <Ionicons name="fast-food" size={24} color={COLORS.primary} />
        <Text style={GLOBAL_STYLE.title}>FastFood App</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, backgroundColor: `${COLORS.secondary}95` },
});
