import React from "react";
import { useStore } from "../lib/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "../components/ui";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
  CreditCard,
} from "lucide-react";
import { formatMoney, getCategoryIcon, getCategoryColor } from "../lib/utils";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { expenses, budget } = useStore();

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = budget.totalLimit - totalSpent;
  const percentageUsed = Math.min((totalSpent / budget.totalLimit) * 100, 100);

  const recentExpenses = expenses.slice(0, 5);

  // Group by Date for Chart
  const chartData = expenses
    .reduce((acc: any[], curr) => {
      const dateObj = new Date(curr.date);
      const displayDate = dateObj.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "short",
      });
      const fullDate = curr.date; // Use full ISO date (YYYY-MM-DD) for comparison

      const existing = acc.find((item) => item.fullDate === fullDate);
      if (existing) {
        existing.amount += curr.amount;
      } else {
        acc.push({
          name: displayDate,
          amount: curr.amount,
          fullDate: fullDate,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => a.fullDate.localeCompare(b.fullDate)); // Sort by full date, show all expenses

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Przegląd Budżetu</h1>
        <Link to="/add">
          <Button>+ Nowy Wydatek</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wydano Łącznie
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatMoney(totalSpent, budget.currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Suma wszystkich wydatków
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pozostały Budżet
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${remaining < 0 ? "text-red-500" : "text-green-600"}`}
            >
              {formatMoney(remaining, budget.currency)}
            </div>
            <div className="w-full bg-secondary h-2 mt-3 rounded-full overflow-hidden">
              <div
                className={`h-full ${remaining < 0 ? "bg-red-500" : "bg-primary"}`}
                style={{ width: `${percentageUsed}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Limit Budżetu</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatMoney(budget.totalLimit, budget.currency)}
            </div>
            <Link
              to="/settings"
              className="text-xs text-primary underline mt-1 block"
            >
              Zmień limit
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Wydatki w czasie</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorAmount"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(value: number) =>
                      formatMoney(value, budget.currency)
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ostatnie Transakcje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExpenses.length === 0 && (
                <p className="text-sm text-muted-foreground">Brak wydatków.</p>
              )}
              {recentExpenses.map((item) => {
                const Icon = getCategoryIcon(item.category);
                const colorClass = getCategoryColor(item.category);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.date}
                        </p>
                      </div>
                    </div>
                    <div className="font-bold text-sm">
                      {formatMoney(item.amount, budget.currency)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <Link to="/expenses">
                <Button variant="ghost" size="sm">
                  Zobacz wszystkie
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
