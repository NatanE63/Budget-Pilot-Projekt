import React from "react";
import { Expense, Budget } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui";
import {
  formatMoney,
  formatDate,
  getCategoryIcon,
  getCategoryColor,
} from "../lib/utils";
import { MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface ExpenseCardProps {
  expense: Expense;
  currency: string;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  currency,
}) => {
  const Icon = getCategoryIcon(expense.category);
  const colorClass = getCategoryColor(expense.category);

  return (
    <Link to={`/expenses/${expense.id}`} className="block h-full @container">
      <Card
        className="group h-full flex flex-col @md:flex-row hover:shadow-md transition-all cursor-pointer border-l-4"
        style={{ borderLeftColor: "var(--primary)" }}
      >
        <CardHeader className="p-4 pb-2 @md:pb-4 flex flex-row items-start justify-between space-y-0 @md:flex-col @md:justify-start @md:w-1/3 @md:border-r @md:border-b-0">
          <div className="space-y-1">
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-1 ${colorClass}`}
            >
              <Icon className="w-3 h-3 mr-1" />
              {expense.category}
            </div>
            <CardTitle className="text-base @lg:text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
              {expense.title}
            </CardTitle>
          </div>
          <div className="text-lg font-bold text-foreground @md:mt-2">
            {formatMoney(expense.amount, currency)}
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2 @md:pt-4 flex-grow space-y-2 text-sm text-muted-foreground">
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
