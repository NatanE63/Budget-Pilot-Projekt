import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Category } from '../types';
import { Utensils, Car, Ticket, ShoppingBag, BedDouble, HelpCircle } from 'lucide-react';
import React from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount: number, currency: string = 'PLN'): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'Restauracje': return Utensils;
    case 'Transport': return Car;
    case 'Atrakcje': return Ticket;
    case 'Zakupy': return ShoppingBag;
    case 'Nocleg': return BedDouble;
    default: return HelpCircle;
  }
};

export const getCategoryColor = (category: Category) => {
  switch (category) {
    case 'Restauracje': return 'text-orange-500 bg-orange-100';
    case 'Transport': return 'text-blue-500 bg-blue-100';
    case 'Atrakcje': return 'text-purple-500 bg-purple-100';
    case 'Zakupy': return 'text-pink-500 bg-pink-100';
    case 'Nocleg': return 'text-indigo-500 bg-indigo-100';
    default: return 'text-gray-500 bg-gray-100';
  }
};
