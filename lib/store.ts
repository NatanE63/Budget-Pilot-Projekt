import { useState, useEffect } from 'react';
import { Expense, Budget } from '../types';
import { INITIAL_EXPENSES, INITIAL_BUDGET } from './constants';

export function useStore() {
  // Expenses Store
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const stored = localStorage.getItem('budgetpilot_expenses');
    return stored ? JSON.parse(stored) : INITIAL_EXPENSES;
  });

  // Budget Store
  const [budget, setBudget] = useState<Budget>(() => {
    const stored = localStorage.getItem('budgetpilot_budget');
    return stored ? JSON.parse(stored) : INITIAL_BUDGET;
  });

  useEffect(() => {
    localStorage.setItem('budgetpilot_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budgetpilot_budget', JSON.stringify(budget));
  }, [budget]);

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const updateBudget = (newLimit: number) => {
    setBudget(prev => ({ ...prev, totalLimit: newLimit }));
  };

  return { expenses, budget, addExpense, removeExpense, updateBudget };
}
