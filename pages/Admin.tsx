import React from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui";
import DataTable, { Column } from "../components/DataTable";
import { Expense } from "../types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatMoney } from "../lib/utils";

const COLORS = [
  "#FF8042",
  "#0088FE",
  "#8884d8",
  "#FFBB28",
  "#00C49F",
  "#ffc658",
];

const Reports = () => {
  const { expenses, budget } = useStore();

  // Calculate totals by category
  const categoryData = React.useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => {
      const current = map.get(e.category) || 0;
      map.set(e.category, current + e.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Raporty i Analizy</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Wydatki wg Kategorii</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) =>
                      formatMoney(val, budget.currency)
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Brak danych
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statystyki</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Liczba transakcji</span>
              <span className="font-bold">{expenses.length}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Średni wydatek</span>
              <span className="font-bold">
                {expenses.length > 0
                  ? formatMoney(
                      expenses.reduce((a, b) => a + b.amount, 0) /
                        expenses.length,
                      budget.currency,
                    )
                  : "0,00 zł"}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">
                Najdroższa kategoria
              </span>
              <span className="font-bold">
                {categoryData.sort((a, b) => b.value - a.value)[0]?.name || "-"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Szczegółowa Tabela</h2>
        <DataTable<Expense>
          data={expenses}
          keyExtractor={(e) => e.id}
          emptyMessage="Brak wydatków do wyświetlenia."
          columns={
            [
              { header: "Nazwa", accessor: "title" },
              { header: "Kategoria", accessor: "category" },
              { header: "Data", accessor: "date" },
              {
                header: "Kwota",
                accessor: (e) => formatMoney(e.amount, budget.currency),
                className: "text-right font-medium",
              },
            ] satisfies Column<Expense>[]
          }
        />
      </div>
    </div>
  );
};

export default Reports;
