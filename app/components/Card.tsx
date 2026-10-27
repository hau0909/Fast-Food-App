import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import { RootStackParamList } from "../type/Route";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Product } from "../type/Product";

export default function Card({ product }: { product: Product }) {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/5787/5787100.png";

  return (
    <View style={[styles.card, { margin: 10 }]}>
      <TouchableOpacity onPress={() => navigation.navigate("Details", product)}>
        <View style={{ rowGap: 5 }}>
          <Image
            style={GLOBAL_STYLE.image}
            source={
              product.image_url
                ? { uri: product.image_url }
                : { uri: defaultImage }
            }
          />
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cardTitle}>
            {product.name}
          </Text>
          <View
            style={[GLOBAL_STYLE.row, { columnGap: 3, alignItems: "center" }]}
          >
            <Text style={GLOBAL_STYLE.subtitle}>Price: </Text>
            <Text>{product.price}$</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    alignContent: "space-between",
    width: 200,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
});
