import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { Button, Card, CardContent } from '../components/ui';
import { MapPin, Calendar, ArrowLeft, Trash2 } from 'lucide-react';
import { formatDate, formatMoney, getCategoryIcon, getCategoryColor } from '../lib/utils';

const ExpenseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { expenses, budget, removeExpense } = useStore();
  const expense = expenses.find(e => e.id === id);

  if (!expense) return <div>Nie znaleziono wydatku.</div>;

  const Icon = getCategoryIcon(expense.category);
  const colorClass = getCategoryColor(expense.category);

  const handleDelete = () => {
    if (confirm("Czy na pewno chcesz usunąć ten wydatek?")) {
      removeExpense(expense.id);
      navigate('/expenses');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Link to="/expenses">
        <Button variant="ghost" className="pl-0 gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" /> Wróć do listy
        </Button>
      </Link>

      <Card className="overflow-hidden">
         <div className="h-32 bg-muted relative">
            <div className={`absolute -bottom-8 left-6 p-4 rounded-xl border-4 border-white ${colorClass}`}>
               <Icon className="w-8 h-8" />
            </div>
         </div>
         <div className="pt-10 px-6 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{expense.title}</h1>
                <span className="text-muted-foreground">{expense.category}</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {formatMoney(expense.amount, budget.currency)}
              </div>
            </div>

            <div className="mt-8 space-y-4">
               <div className="flex items-center gap-3">
                 <Calendar className="w-5 h-5 text-muted-foreground" />
                 <span>{formatDate(expense.date)}</span>
               </div>
               {expense.location && (
                 <div className="flex items-center gap-3">
                   <MapPin className="w-5 h-5 text-muted-foreground" />
                   <span>{expense.location}</span>
                 </div>
               )}
               {expense.description && (
                 <div className="bg-muted p-4 rounded-lg mt-4 text-sm italic">
                   "{expense.description}"
                 </div>
               )}
            </div>

            <div className="mt-8 pt-6 border-t flex justify-end">
              <Button variant="destructive" onClick={handleDelete} className="gap-2">
                 <Trash2 className="w-4 h-4" /> Usuń Wydatek
              </Button>
            </div>
         </div>
      </Card>
    </div>
  );
};

export default ExpenseDetails;
