import axios from "axios";
import { Expense, addExpense, getExpenses } from "../database/db";

const API_URL = "https://6903fdc6d0f10a340b265523.mockapi.io/data";

// ✅ Gửi dữ liệu từ SQLite lên MockAPI
export const syncToAPI = async (): Promise<void> => {
  try {
    const localExpenses = getExpenses();

    for (const exp of localExpenses) {
      // MockAPI có thể bị trùng, nên ta kiểm tra trước khi post
      const exists = await axios.get(`${API_URL}?title=${exp.title}&amount=${exp.amount}`);
      if (exists.data.length === 0) {
        await axios.post(API_URL, exp);
      }
    }

    console.log("✅ Đã đồng bộ dữ liệu lên MockAPI");
  } catch (error) {
    console.error("❌ Lỗi syncToAPI:", error);
  }
};

// ✅ Lấy dữ liệu từ MockAPI về và thêm vào SQLite (nếu chưa có)
export const syncFromAPI = async (): Promise<void> => {
  try {
    const response = await axios.get<Expense[]>(API_URL);
    const apiData = response.data;

    apiData.forEach((exp) => {
      addExpense({
        title: exp.title,
        amount: exp.amount,
        type: exp.type,
        createdAt: exp.createdAt,
      });
    });

    console.log("✅ Đã đồng bộ dữ liệu từ MockAPI về SQLite");
  } catch (error) {
    console.error("❌ Lỗi syncFromAPI:", error);
  }
};
