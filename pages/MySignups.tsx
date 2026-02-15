import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useStore } from "../lib/store";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Label,
} from "../components/ui";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/Form";
import {
  Settings as SettingsIcon,
  Save,
  Trash2,
  Coins,
  Loader2,
} from "lucide-react";
import { CURRENCIES, fetchExchangeRate } from "../lib/api";

const settingsSchema = z.object({
  totalLimit: z.coerce.number().min(1, "Limit musi być większy od 0"),
  currency: z.string().min(3, "Wybierz walutę"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const Settings = () => {
  const { budget, updateBudget, resetExpenses, expenses, replaceAllExpenses } =
    useStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema) as any,
    defaultValues: {
      totalLimit: budget.totalLimit,
      currency: budget.currency,
    },
  });

  const onSubmit: SubmitHandler<SettingsFormData> = async (data) => {
    setIsUpdating(true);
    try {
      const oldCurrency = budget.currency;
      const newCurrency = data.currency;

      if (oldCurrency !== newCurrency) {
        // Need to convert expenses
        const updatedExpenses = await Promise.all(
          expenses.map(async (expense) => {
            // If expense already has originalAmount/Currency, it means it was a foreign transaction.
            // We need to convert from THAT original currency to the NEW base currency.
            if (expense.originalAmount && expense.originalCurrency) {
              const rate = await fetchExchangeRate(
                expense.originalCurrency,
                newCurrency,
              );
              if (rate) {
                return {
                  ...expense,
                  amount: expense.originalAmount * rate, // New base amount
                  // originalAmount and originalCurrency stay the same
                  exchangeRate: rate,
                };
              }
            } else {
              // Expense was in the OLD base currency (treated as "local").
              // Now it becomes "foreign" (or just converted if we don't want to keep history?
              // User said: "przewalutowal orgianlna kwote do tej obecnej" - convert original amount to current.
              // Logic: Expense was 100 PLN. Base changes to EUR.
              // It should now handle 100 PLN as "original" and calculate EUR amount.
              const rate = await fetchExchangeRate(oldCurrency, newCurrency);
              if (rate) {
                return {
                  ...expense,
                  amount: expense.amount * rate,
                  originalAmount: expense.amount, // Save the old base amount as original
                  originalCurrency: oldCurrency,
                  exchangeRate: rate,
                };
              }
            }
            return expense; // Fallback if rate fails
          }),
        );
        replaceAllExpenses(updatedExpenses);
      }

      updateBudget({
        totalLimit: data.totalLimit,
        currency: data.currency,
      });
      alert("Ustawienia zostały zaktualizowane!");
    } catch (error) {
      console.error("Failed to update settings:", error);
      alert("Wystąpił błąd podczas aktualizacji.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = () => {
    if (
      confirm(
        "Czy na pewno chcesz usunąć WSZYSTKIE wydatki? Tej operacji nie można cofnąć.",
      )
    ) {
      resetExpenses();
      setTimeout(() => alert("Wydatki zostały zresetowane."), 100);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in pt-10">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <SettingsIcon className="w-8 h-8" /> Ustawienia Budżetu
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Limity i Waluta</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="gap-4 flex flex-col pt-4"
            >
              <FormField
                control={form.control}
                name="totalLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Całkowity Limit Budżetu (PLN)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      To jest maksymalna kwota, którą planujesz wydać.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waluta Główna</FormLabel>
                    <div className="relative">
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        {...field}
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                      <Coins className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      W tej walucie będą wyświetlane podsumowania.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                    Aktualizowanie...
                  </>
                ) : (
                  "Zapisz Ustawienia"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-500">Strefa Niebezpieczna</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Tutaj możesz zresetować wszystkie swoje wydatki. Tej operacji nie
            można cofnąć.
          </p>
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={handleReset}
          >
            <Trash2 className="w-4 h-4" /> Zresetuj Wszystkie Wydatki
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
