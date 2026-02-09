import { Expense, Budget } from '../types';

export const INITIAL_BUDGET: Budget = {
  totalLimit: 5000,
  currency: 'PLN'
};

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: '1',
    title: 'Obiad w Trattoria al Forno',
    amount: 245.50,
    date: '2024-05-12',
    category: 'Restauracje',
    description: 'Pizza i wino dla 4 osób.',
    location: 'Rzym, Włochy',
    receiptImage: 'https://picsum.photos/200/300'
  },
  {
    id: '2',
    title: 'Bilety do Koloseum',
    amount: 320.00,
    date: '2024-05-13',
    category: 'Atrakcje',
    description: 'Wejście priorytetowe z przewodnikiem.',
    location: 'Rzym, Włochy'
  },
  {
    id: '3',
    title: 'Uber do hotelu',
    amount: 45.90,
    date: '2024-05-13',
    category: 'Transport',
    description: 'Powrót nocny.',
    location: 'Rzym, Włochy'
  },
  {
    id: '4',
    title: 'Pamiątki na straganie',
    amount: 85.00,
    date: '2024-05-14',
    category: 'Zakupy',
    description: 'Magnesy i pocztówki.',
    location: 'Watykan'
  },
  {
    id: '5',
    title: 'Hotel Grand Vista (Zaliczka)',
    amount: 1200.00,
    date: '2024-05-10',
    category: 'Nocleg',
    description: 'Rezerwacja przez Booking.',
    location: 'Rzym, Włochy'
  }
];
