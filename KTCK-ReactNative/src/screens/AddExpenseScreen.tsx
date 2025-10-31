import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { addExpense, updateExpense, getExpenses, Expense } from "../database/db";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { syncToAPI } from "../api/mockAPI"; // ⬅️ thêm import này

type Nav = NativeStackNavigationProp<RootStackParamList, "AddExpense">;
type Route = RouteProp<RootStackParamList, "AddExpense">;

const AddExpenseScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"Thu" | "Chi">("Chi");
  const titleRef = useRef<TextInput>(null);

  useEffect(() => {
    if (route.params?.id) {
      const expense = getExpenses().find((x) => x.id === route.params!.id);
      if (expense) {
        setTitle(expense.title);
        setAmount(expense.amount.toString());
        setType(expense.type);
      }
    }
  }, [route.params]);

  const handleSave = async () => {
    if (!title || !amount) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const newExpense: Expense = {
      title,
      amount: parseFloat(amount),
      type,
      createdAt: new Date().toLocaleDateString(),
    };

    if (route.params?.id) {
      updateExpense(route.params.id, newExpense);
    } else {
      addExpense(newExpense);
    }

    await syncToAPI(); // ⬅️ Đồng bộ sau khi thêm/sửa

    titleRef.current?.clear();
    setAmount("");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput ref={titleRef} style={styles.input} placeholder="Tên khoản chi" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Số tiền" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <Button title={`Chuyển loại (${type})`} onPress={() => setType(type === "Chi" ? "Thu" : "Chi")} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 10 },
  input: { borderWidth: 1, borderColor: "#aaa", padding: 10, borderRadius: 8 },
});
