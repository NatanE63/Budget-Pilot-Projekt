import React from 'react';
import { Expense, Budget } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import { formatMoney, formatDate, getCategoryIcon, getCategoryColor } from '../lib/utils';
import { MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExpenseCardProps {
  expense: Expense;
  currency: string;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, currency }) => {
  const Icon = getCategoryIcon(expense.category);
  const colorClass = getCategoryColor(expense.category);

  return (
    <Link to={`/expenses/${expense.id}`} className="block h-full">
      <Card className="group h-full flex flex-col hover:shadow-md transition-all cursor-pointer border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
        <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
          <div className="space-y-1">
             <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-1 ${colorClass}`}>
                <Icon className="w-3 h-3 mr-1" />
                {expense.category}
             </div>
             <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-1">
               {expense.title}
             </CardTitle>
          </div>
          <div className="text-lg font-bold text-foreground">
            {formatMoney(expense.amount, currency)}
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 flex-grow space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(expense.date)}</span>
          </div>
          {expense.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{expense.location}</span>
            </div>
          )}
          {expense.description && (
             <p className="line-clamp-2 mt-2 text-xs italic opacity-80">
               "{expense.description}"
             </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
