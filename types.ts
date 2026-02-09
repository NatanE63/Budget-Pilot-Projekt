// Categories specific to travel/leisure
export type Category = 'Restauracje' | 'Atrakcje' | 'Transport' | 'Nocleg' | 'Zakupy' | 'Inne';

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
export type SortDirection = 'asc' | 'desc';
