import { Expense, Budget } from "../types";

// Helper to get date strings for consecutive days
const getDaysAgo = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

export const INITIAL_BUDGET: Budget = {
  totalLimit: 5000,
  currency: "PLN",
};

export const INITIAL_EXPENSES: Expense[] = [];
