import { Alert, Text, View } from "react-native";
import FilterBar from "../components/FilterBar";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import { useCallback, useEffect, useState } from "react";
import { Product } from "../type/Product";
import { getAllProduct, ProductFilters } from "../services/productApi";
import ProductList from "../components/ProductList";
import { useFocusEffect } from "@react-navigation/native";

export default function Home() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      getProducts({});
    }, [])
  );

  const getProducts = async (currentFilters: ProductFilters | {}) => {
    const result = await getAllProduct(currentFilters);

    if (result.success) {
      setProducts(result.data);
    } else {
      Alert.alert("Error", result.err);
    }
  };

  const handleApplyFilters = (newFilters: ProductFilters) => {
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
