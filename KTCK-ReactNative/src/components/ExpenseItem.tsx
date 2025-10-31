import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Expense } from "../database/db";

interface ExpenseItemProps {
  item: Expense;
  onPress: () => void;
  onLongPress: () => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ item, onPress, onLongPress }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.row}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={[styles.amount, { color: item.type === "Thu" ? "green" : "red" }]}>
          {item.amount.toLocaleString()}₫
        </Text>
      </View>
      <View style={styles.row}>
        <Text>{item.createdAt}</Text>
        <Text style={styles.type}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ExpenseItem;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 16, fontWeight: "bold" },
  amount: { fontSize: 16, fontWeight: "bold" },
  type: { fontStyle: "italic" },
});
