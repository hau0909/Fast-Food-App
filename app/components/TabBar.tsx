import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { COLORS } from "../styles/colors"; // đường dẫn có thể chỉnh lại

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const icons = {
    Home: "home",
    Cart: "cart",
    Profiles: "person",
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const iconName = icons[route.name] || "ellipse";

        const onPress = () => {
          if (!isFocused) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.tabItem}
          >
            <View
              style={[
                styles.iconWrapper,
                isFocused && styles.activeIconWrapper,
              ]}
            >
              <Ionicons
                name={isFocused ? iconName : `${iconName}-outline`}
                size={24}
                color={isFocused ? COLORS.primary : "#BFBFBF"}
              />
            </View>
            <Text style={[styles.label, isFocused && styles.activeLabel]}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F2",
    height: 75,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    backgroundColor: "transparent",
    borderRadius: 50,
    padding: 6,
  },
  activeIconWrapper: {
    borderRadius: 50,
    backgroundColor: `${COLORS.secondary}75`,
  },
  label: {
    fontSize: 13,
    color: "#BFBFBF",
    marginTop: 4,
  },
  activeLabel: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
