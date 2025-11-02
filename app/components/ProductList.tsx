import { FlatList, Text, View } from "react-native";
import { Product } from "../type/Product";
import Card from "./Card";

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <View style={{ paddingBottom: 20 }}>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item._id + ""}
        renderItem={({ item }) => (
          <View>
            <Card key={item._id} product={item} />
          </View>
        )}
      />
    </View>
  );
}
