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

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: "1",
    title: "Obiad w Trattoria al Forno",
    amount: 245.5,
    date: getDaysAgo(4), // 5 dni temu
    category: "Restauracje",
    description: "Pizza i wino dla 4 osób.",
    location: "Rzym, Włochy",
    receiptImage: "https://picsum.photos/200/300",
  },
  {
    id: "2",
    title: "Bilety do Koloseum",
    amount: 320.0,
    date: getDaysAgo(3), // 4 dni temu
    category: "Atrakcje",
    description: "Wejście priorytetowe z przewodnikiem.",
    location: "Rzym, Włochy",
  },
  {
    id: "3",
    title: "Uber do hotelu",
    amount: 45.9,
    date: getDaysAgo(2), // 3 dni temu
    category: "Transport",
    description: "Powrót nocny.",
    location: "Rzym, Włochy",
  },
  {
    id: "4",
    title: "Pamiątki na straganie",
    amount: 85.0,
    date: getDaysAgo(1), // 2 dni temu (przedwczoraj)
    category: "Zakupy",
    description: "Magnesy i pocztówki.",
    location: "Watykan",
  },
  {
    id: "5",
    title: "okok",
    amount: 1234.0,
    date: getDaysAgo(0), // wczoraj
    category: "Nocleg",
    description: "Rezerwacja przez Booking.",
    location: "Rzym, Włochy",
  },
];
