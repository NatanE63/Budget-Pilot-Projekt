// Categories specific to travel/leisure
export type Category =
  | "Restauracje"
  | "Atrakcje"
  | "Transport"
  | "Nocleg"
  | "Zakupy"
  | "Inne";

const CATEGORIES: readonly string[] = [
  "Restauracje",
  "Atrakcje",
  "Transport",
  "Nocleg",
  "Zakupy",
  "Inne",
];

// Type predicate – narrows unknown value to Category
export function isCategory(value: string): value is Category {
  return CATEGORIES.includes(value);
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: Category;
  description?: string;
  location?: string;
  receiptImage?: string; // Optional URL placeholder
}

export interface Budget {
  totalLimit: number;
  currency: string;
}

// Utility Types
export type SortDirection = "asc" | "desc";
