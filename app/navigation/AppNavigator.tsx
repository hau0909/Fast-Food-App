import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainTabs from "./MainTabs";
import AuthStack from "./AuthStack";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import Details from "../screens/Details";
import Checkout from "../screens/Checkout";
import OrderHistoryScreen from "../screens/Orders";

const RootStack = createStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {!user ? (
          <RootStack.Screen
            name="Auth"
            component={AuthStack}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <RootStack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="Details"
              component={Details}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="Checkout"
              options={{ headerShown: false }}
              component={Checkout}
            />
            <RootStack.Screen
              name="Orders"
              options={{ headerShown: false }}
              component={OrderHistoryScreen}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
