import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { Button, Card } from "../components/ui";
import { MapPin, Calendar, ArrowLeft, Trash2, ImageIcon } from "lucide-react";
import {
  formatDate,
  formatMoney,
  getCategoryIcon,
  getCategoryColor,
} from "../lib/utils";
import { getCategoryImageUrl } from "../lib/useCategoryImage";

const ExpenseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { expenses, budget, removeExpense } = useStore();
  const expense = expenses.find((e) => e.id === id);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!expense) return <div>Nie znaleziono wydatku.</div>;

  const Icon = getCategoryIcon(expense.category);
  const colorClass = getCategoryColor(expense.category);
  const imageUrl = getCategoryImageUrl(expense.category, expense.id);

  const handleDelete = () => {
    const updated = expenses.filter((e) => e.id !== expense.id);
    localStorage.setItem("budgetpilot_expenses", JSON.stringify(updated));
    removeExpense(expense.id);
    navigate("/expenses");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Link to="/expenses">
        <Button variant="ghost" className="pl-0 gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" /> Wróć do listy
        </Button>
      </Link>

      <Card className="overflow-hidden">
        <div className="h-48 bg-muted relative overflow-hidden">
          {!imageError && (
            <img
              src={imageUrl}
              alt={expense.category}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            />
          )}

          {imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          )}

          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="w-8 h-8" />
                <span className="text-xs">Ładowanie zdjęcia...</span>
              </div>
            </div>
          )}

          <div
            className={`absolute top-4 left-6 p-4 rounded-xl border-4 border-white shadow-lg ${colorClass}`}
          >
            <Icon className="w-8 h-8" />
          </div>
        </div>
        <div className="pt-6 px-6 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{expense.title}</h1>
              <span className="text-muted-foreground">{expense.category}</span>
            </div>
            <div className="text-right">
              {expense.originalAmount &&
              expense.originalCurrency &&
              expense.originalCurrency !== budget.currency ? (
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold text-primary">
                    {formatMoney(
                      expense.originalAmount,
                      expense.originalCurrency,
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    ≈ {formatMoney(expense.amount, budget.currency)}
                  </div>
                  {expense.exchangeRate && (
                    <div className="text-xs text-muted-foreground opacity-80 mt-1">
                      Kurs: {expense.exchangeRate.toFixed(4)} (z dnia{" "}
                      {expense.date.split("-").reverse().join("-")})
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-2xl font-bold text-primary">
                  {formatMoney(expense.amount, budget.currency)}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span>{expense.date.split("-").reverse().join("-")}</span>
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
            {!confirmDelete ? (
              <Button
                variant="destructive"
                onClick={() => setConfirmDelete(true)}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" /> Usuń Wydatek
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Na pewno?</span>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="gap-2"
                >
                  Tak, usuń
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConfirmDelete(false)}
                >
                  Anuluj
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExpenseDetails;
