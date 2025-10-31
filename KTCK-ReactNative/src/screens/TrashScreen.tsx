import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import {
  getTrash,
  restoreExpense,
  deleteExpensePermanently,
  Expense,
} from "../database/db";
import { syncToAPI } from "../api/mockAPI";

const TrashScreen: React.FC = () => {
  const [trashList, setTrashList] = useState<Expense[]>([]);

  const loadTrash = () => {
    const trash = getTrash();
    setTrashList(trash);
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = (id: number) => {
    restoreExpense(id);
    Alert.alert("✅ Đã khôi phục khoản chi thành công!");
    loadTrash();
  };

  const handleDeleteForever = async (id: number) => {
    Alert.alert("⚠️ Xác nhận", "Bạn có chắc muốn xóa vĩnh viễn khoản chi này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          const exp = trashList.find((e) => e.id === id);
          // if (exp) {
          //   // Xóa trên MockAPI
          //   try {
          //     await syncToAPI([{ ...exp, deleted: 1 }]);
          //   } catch (e) {
          //     console.warn("Không thể đồng bộ với API:", e);
          //   }
          // }
          deleteExpensePermanently(id);
          loadTrash();
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.amount}>
          {item.amount.toLocaleString()} ₫ • {item.type}
        </Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => handleRestore(item.id!)}>
          <Text style={styles.restore}>Khôi phục</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteForever(item.id!)}>
          <Text style={styles.delete}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🗑️ Thùng rác</Text>
      {trashList.length === 0 ? (
        <Text style={styles.empty}>Không có khoản chi nào trong thùng rác</Text>
      ) : (
        <FlatList
          data={trashList}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default TrashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  amount: {
    fontSize: 14,
    color: "#777",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  restore: {
    color: "blue",
    fontWeight: "600",
  },
  delete: {
    color: "red",
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: 30,
  },
});
