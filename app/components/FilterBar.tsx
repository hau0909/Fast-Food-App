import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GLOBAL_STYLE } from "../styles/globalStyle";
import Feather from "@expo/vector-icons/Feather";
import { COLORS } from "../styles/colors";
import { useState } from "react";
import RNPickerSelect from "react-native-picker-select";

const categoryOptions = [
  { label: "Pizza", value: "pizza" },
  { label: "Fries", value: "fries" },
  { label: "Burger", value: "burger" },
  { label: "Drink", value: "drink" },
];

export default function FilterBar({
  onApplyFilters,
}: {
  onApplyFilters: ({}) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  const handleCancel = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedSort("");
    onApplyFilters({});
  };

  const handleApply = () => {
    const filterData = {
      name: searchQuery,
      category_id: selectedCategory,
      sortBy:
        selectedSort === "latest" || selectedSort === "oldest"
          ? "createdAt"
          : "price",
      order:
        selectedSort === "latest"
          ? "desc"
          : selectedSort === "oldest"
          ? "asc"
          : selectedSort === "increase"
          ? "asc"
          : selectedSort === "decrease"
          ? "desc"
          : undefined,
    };
    onApplyFilters(filterData);
  };

  return (
    <View style={[GLOBAL_STYLE.centered, { rowGap: 15 }]}>
      <View style={[GLOBAL_STYLE.row, styles.searchBar, { columnGap: 5 }]}>
        <Feather name="search" size={24} color={COLORS.primary} />
        <TextInput
          style={styles.input}
          value={searchQuery}
          onChangeText={(value) => setSearchQuery(value)}
          placeholder="Fries, Hamburger, Pizza, Cocacola,..."
          placeholderTextColor={`${COLORS.primary}70`}
        />
      </View>

      <View style={[GLOBAL_STYLE.row, { columnGap: 15 }]}>
        {/* category */}
        <View style={styles.filterBox}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedCategory(value)}
            value={selectedCategory}
            placeholder={{ label: "Select a category" }}
            items={[
              { label: "Food", value: "68f75620b895512768df4d36" },
              { label: "Drink", value: "68f75620b895512768df4d37" },
            ]}
            style={{
              inputAndroid: {
                color: COLORS.text,
                fontSize: 14,
              },
              inputAndroidContainer: {
                width: 150,
                justifyContent: "center",
                backgroundColor: COLORS.white,
                borderRadius: 40,
                borderWidth: 1,
                borderColor: COLORS.secondary,
                paddingHorizontal: 5,
              },
              placeholder: {
                color: `${COLORS.primary}80`,
              },
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return (
                <Feather
                  name="chevron-down"
                  size={20}
                  color={COLORS.primary}
                  style={{ marginRight: 10, marginTop: 10 }}
                />
              );
            }}
          />
        </View>

        {/* Sort */}
        <View style={styles.filterBox}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedSort(value)}
            value={selectedSort}
            placeholder={{ label: "Select a sort" }}
            items={[
              { label: "Latest", value: "latest" },
              { label: "Oldest", value: "oldest" },
              { label: "Price low - high", value: "increase" },
              { label: "Price high - low", value: "decrease" },
            ]}
            style={{
              inputAndroid: {
                color: COLORS.text,
                fontSize: 14,
              },
              inputAndroidContainer: {
                width: 150,
                justifyContent: "center",
                backgroundColor: COLORS.white,
                borderRadius: 40,
                borderWidth: 1,
                borderColor: COLORS.secondary,
                paddingHorizontal: 5,
              },
              placeholder: {
                color: `${COLORS.primary}80`,
              },
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return (
                <Feather
                  name="chevron-down"
                  size={20}
                  color={COLORS.primary}
                  style={{ marginRight: 10, marginTop: 10 }}
                />
              );
            }}
          />
        </View>
      </View>

      {/* apply & cancel */}
      <View style={[GLOBAL_STYLE.row, { columnGap: 10 }]}>
        <TouchableOpacity onPress={handleApply}>
          <View style={styles.btnApply}>
            <Feather name="check" size={20} color={COLORS.white} />
            <Text style={GLOBAL_STYLE.btnText}>APPLY</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCancel}>
          <View style={styles.btnCancel}>
            <Feather name="x" size={20} color={COLORS.white} />
            <Text style={GLOBAL_STYLE.btnText}>CANCEL</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  input: {
    width: 300,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 40,
    paddingHorizontal: 20,
    fontSize: 13,
    backgroundColor: COLORS.white,
    color: COLORS.text,
  },
  searchBar: {
    paddingVertical: 2,
    paddingLeft: 10,
    paddingRight: 2,
    backgroundColor: COLORS.secondary,
    borderRadius: 50,
  },
  filterBox: {
    paddingVertical: 2,
    paddingLeft: 10,
    paddingRight: 2,
    backgroundColor: COLORS.secondary,
    borderRadius: 60,
  },
  btnCancel: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    columnGap: 5,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  btnApply: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    columnGap: 5,
    backgroundColor: "green",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
