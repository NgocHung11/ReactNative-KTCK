import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import { StackedBarChart } from "react-native-chart-kit";
import { getExpenses, Expense } from "../database/db";

interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
}

const StatisticsScreen: React.FC = () => {
  const [stats, setStats] = useState<MonthlyStats[]>([]);

  useEffect(() => {
    const data = getExpenses();
    const monthlyData = calculateMonthlyStats(data);
    setStats(monthlyData);
  }, []);

  // Tính tổng thu/chi theo tháng
  const calculateMonthlyStats = (expenses: Expense[]): MonthlyStats[] => {
    const map = new Map<string, MonthlyStats>();

    expenses.forEach((exp) => {
      // Giả định định dạng ngày: "dd/mm/yyyy"
      const [day, month, year] = exp.createdAt.split("/");
      const key = `${month}/${year}`;

      if (!map.has(key)) {
        map.set(key, { month: key, income: 0, expense: 0 });
      }

      const item = map.get(key)!;
      if (exp.type === "Thu") item.income += exp.amount;
      else item.expense += exp.amount;
    });

    return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
  };

  const labels = stats.map((s) => s.month);
  const data = stats.map((s) => [s.income, s.expense]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 Thống kê Thu - Chi theo tháng</Text>

      {stats.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có dữ liệu thống kê</Text>
      ) : (
        <View style={styles.chartContainer}>
          {/* <StackedBarChart
            data={{
              labels,
              legend: ["Thu", "Chi"],
              data,
              barColors: ["#4CAF50", "#F44336"], // xanh = thu, đỏ = chi
            }}
            width={Dimensions.get("window").width - 20}
            height={280}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: () => "#333",
              propsForLabels: { fontSize: 12 },
            }}
            style={{ borderRadius: 10 }}
          /> */}
        </View>
      )}
    </ScrollView>
  );
};

export default StatisticsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  chartContainer: { alignItems: "center", marginTop: 10 },
  emptyText: { textAlign: "center", color: "#777", marginTop: 20 },
});
