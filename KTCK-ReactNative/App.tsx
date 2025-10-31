import React  from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import AddExpenseScreen from "./src/screens/AddExpenseScreen";
import TrashScreen from "./src/screens/TrashScreen";
import StatisticsScreen from "./src/screens/StatisticsScreen";

export type RootStackParamList = { 
  Home: undefined; 
  AddExpense: { id?: number } | undefined; 
  Trash: undefined; 
  Statistics: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return(
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "EXPENSE TRACKER" }} />
          <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: "Add / Edit Expense" }} />
          <Stack.Screen name="Trash" component={TrashScreen} options={{ title: "Trash" }} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ title: "Statistics" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}