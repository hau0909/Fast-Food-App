import { Alert, Text, View } from "react-native";
import { RootStackParamList } from "../type/Route";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import FilterBar from "../components/FilterBar";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { Product } from "../type/Product";
import { getAllProduct, ProductFilters } from "../services/productApi";
import ProductList from "../components/ProductList";

export default function Home() {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const [products, setProducts] = useState<Product[] | null>(null);
  const [filters, setFilters] = useState<ProductFilters | {}>({});

  useEffect(() => {
    getProducts({});
  }, []);

  const getProducts = async (currentFilters: ProductFilters | {}) => {
    const result = await getAllProduct(currentFilters);

    if (result.success) {
      setProducts(result.data);
    } else {
      Alert.alert("Error", result.err);
    }
  };

  const handleApplyFilters = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    getProducts(newFilters);
  };

  return (
    <View style={GLOBAL_STYLE.container}>
      <FilterBar onApplyFilters={handleApplyFilters} />

      {/* product list */}
      <View
        style={{
          paddingVertical: 20,
          marginBottom: 90,
        }}
      >
        {!products ? (
          <View>
            <Text>No Product is available</Text>
          </View>
        ) : (
          <ProductList products={products} />
        )}
      </View>
    </View>
  );
}
