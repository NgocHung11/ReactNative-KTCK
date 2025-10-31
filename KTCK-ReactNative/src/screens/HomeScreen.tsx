import React, { useEffect, useState } from "react";
import { View, FlatList, Alert, Button, TextInput, RefreshControl, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExpenseItem from "../components/ExpenseItem";
import { initDB, getExpenses, deleteExpense, Expense } from "../database/db";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Nav = NativeStackNavigationProp<RootStackParamList, "Home">;

const HomeScreen: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"Tất cả" | "Thu" | "Chi">("Tất cả"); // Dùng cho câu 10 sau
  const navigation = useNavigation<Nav>();

  const loadData = () => setExpenses(getExpenses());

  useEffect(() => {
    initDB();
    loadData();
  }, []);

  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa khoản này?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        onPress: () => {
          deleteExpense(id);
          loadData();
        },
      },
    ]);
  };

  // 🔍 Lọc danh sách theo search + filter
  const filteredExpenses = expenses.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "Tất cả" || item.type === filter)
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>EXPENSE TRACKER</Text>

      {/* 🔍 Thanh tìm kiếm */}
      <TextInput
        placeholder="Tìm kiếm khoản thu/chi..."
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          borderRadius: 8,
          marginBottom: 10,
        }}
        value={search}
        onChangeText={setSearch}
      />

      {/* 🔘 Bộ lọc Thu/Chi (Câu 10 - chuẩn bị sẵn) */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10 }}>
        {["Tất cả", "Thu", "Chi"].map((t) => (
          <Button key={t} title={t} onPress={() => setFilter(t as any)} />
        ))}
      </View>

      <Button title="Thêm khoản thu/chi" onPress={() => navigation.navigate("AddExpense")} />
      <Button title="Thùng rác" onPress={() => navigation.navigate("Trash")} />
      <Button title="Xem thống kê" onPress={() => navigation.navigate("Statistics")} />

      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <ExpenseItem
            item={item}
            onPress={() => navigation.navigate("AddExpense", { id: item.id })}
            onLongPress={() => handleDelete(item.id!)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
