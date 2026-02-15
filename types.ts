// Categories specific to travel/leisure
export type Category =
  | "Restauracje"
  | "Atrakcje"
  | "Transport"
  | "Nocleg"
  | "Zakupy"
  | "Inne";

export const CATEGORIES: readonly string[] = [
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
  amount: number; // Always in Base Currency (Budget.currency)
  date: string;
  category: Category;
  description?: string;
  location?: string;
  receiptImage?: string; 
  originalAmount?: number; // Amount in transaction currency
  originalCurrency?: string; // Transaction currency code (e.g., EUR)
  exchangeRate?: number; // Rate used for conversion
}

export interface Budget {
  totalLimit: number;
  currency: string; // Base Currency (e.g., PLN)
}

// Utility Types
export type SortDirection = "asc" | "desc";
