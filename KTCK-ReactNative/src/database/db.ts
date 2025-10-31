import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("expense.db");

export interface Expense {
  id?: number;
  title: string;
  amount: number;
  type: "Thu" | "Chi";
  createdAt: string;
  deleted?: number;
}

export const initDB = () => {
  db.execSync(
    `CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      amount REAL,
      type TEXT,
      createdAt TEXT,
      deleted INTEGER DEFAULT 0
    );`
  );
};

export const getExpenses = (): Expense[] => {
  return db.getAllSync<Expense>(
    "SELECT * FROM expenses WHERE deleted = 0 ORDER BY id DESC;"
  );
};

export const getTrash = (): Expense[] => {
  return db.getAllSync<Expense>(
    "SELECT * FROM expenses WHERE deleted = 1 ORDER BY id DESC;"
  );
};

export const addExpense = (expense: Expense) => {
  db.runSync(
    "INSERT INTO expenses (title, amount, type, createdAt) VALUES (?, ?, ?, ?)",
    [expense.title, expense.amount, expense.type, expense.createdAt]
  );
};

export const updateExpense = (id: number, expense: Expense) => {
  db.runSync("UPDATE expenses SET title=?, amount=?, type=? WHERE id=?", [
    expense.title,
    expense.amount,
    expense.type,
    id,
  ]);
};

export const deleteExpense = (id: number) => {
  db.runSync("UPDATE expenses SET deleted = 1 WHERE id = ?", [id]);
};

// ✅ Khôi phục từ thùng rác
export const restoreExpense = (id: number) => {
  db.runSync("UPDATE expenses SET deleted = 0 WHERE id = ?", [id]);
};

// ✅ Xóa vĩnh viễn khỏi DB
export const deleteExpensePermanently = (id: number) => {
  db.runSync("DELETE FROM expenses WHERE id = ?", [id]);
};
