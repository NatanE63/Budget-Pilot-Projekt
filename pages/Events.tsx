import React, { useState } from "react";
import { useStore } from "../lib/store";
import { ExpenseCard } from "../components/EventCard"; // Actually ExpenseCard content
import { Input, Select, Button } from "../components/ui";
import { Category } from "../types";
import { Search, Filter } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

const Expenses = () => {
  const { expenses, budget } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "All">("All");

  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location &&
        item.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Twoje Wydatki</h1>
          <p className="text-muted-foreground">
            Lista wszystkich paragonów i płatności.
          </p>
        </div>

        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj Tytułu lub Lokacji"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Popover.Root>
            <Popover.Trigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filtr
              </Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="w-56 rounded-md border bg-popover p-4 shadow-md text-popover-foreground z-50">
                <h4 className="font-medium mb-2">Kategoria</h4>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                >
                  <option value="All">Wszystkie</option>
                  <option value="Restauracje">Restauracje</option>
                  <option value="Atrakcje">Atrakcje</option>
                  <option value="Transport">Transport</option>
                  <option value="Nocleg">Nocleg</option>
                  <option value="Zakupy">Zakupy</option>
                  <option value="Inne">Inne</option>
                </Select>
                <Popover.Arrow className="fill-popover" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              currency={budget.currency}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            Brak wyników wyszukiwania.
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses;
