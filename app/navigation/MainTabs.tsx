import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBar from "../components/TabBar";
import Profiles from "../screens/Profiles";
import Home from "../screens/Home";
import Cart from "../screens/Cart";
import HomeHeader from "../components/HomeHeader";

const Tab = createBottomTabNavigator();

export default function Maintabs() {
  const screensToHide = ["Details", "Checkout", "ChatRoom"];

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ header: () => <HomeHeader />, headerShown: true }}
      />
      <Tab.Screen name="Card" component={Cart} />
      <Tab.Screen name="Profiles" component={Profiles} />
    </Tab.Navigator>
  );
}
