export type ExpenseType = "Thu" | "Chi";

export interface Expense {
  id?: number;
  title: string;
  amount: number;
  createdAt: string; // ISO string
  type: ExpenseType;
  deleted?: number; // 0 or 1
  remoteId?: string; // optional, mapping to MockAPI ID
}
