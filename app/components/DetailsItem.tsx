import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../styles/colors";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import { Product } from "../type/Product";

export default function DetailsItem({ product }: { product: Product }) {
  const categoryName =
    typeof product.category_id === "string"
      ? "Unknown"
      : product.category_id.name;

  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/5787/5787100.png";

  return (
    <View style={{ rowGap: 10 }}>
      <View style={GLOBAL_STYLE.centered}>
        <Image
          style={styles.img}
          source={
            product?.image_url
              ? { uri: product.image_url }
              : { uri: defaultImage }
          }
        />
      </View>

      <View style={{ rowGap: 10 }}>
        <Text numberOfLines={3} style={GLOBAL_STYLE.title}>
          {product.name}
        </Text>

        <View style={[GLOBAL_STYLE.row, GLOBAL_STYLE.centered, styles.bagde]}>
          <Text
            style={[GLOBAL_STYLE.subtitle, { fontSize: 20, color: "white" }]}
          >
            Category:
          </Text>
          <Text style={styles.bagdeText}>{categoryName}</Text>
        </View>

        <View style={[{ marginHorizontal: 10 }]}>
          <Text style={[GLOBAL_STYLE.subtitle, { fontSize: 20 }]}>
            Description
          </Text>
          <Text style={styles.infoText}>{product.description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    width: "100%",
    height: 400,
    borderRadius: 10,
    resizeMode: "cover",
  },
  bagde: {
    columnGap: 5,
    backgroundColor: COLORS.secondary,
    width: 150,
    padding: 5,
    borderRadius: 50,
  },
  bagdeText: {
    fontSize: 15,
    marginTop: 3,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  infoText: {
    marginTop: 3,
    color: "#44444E",
    fontSize: 15,
    fontStyle: "italic",
  },
});
