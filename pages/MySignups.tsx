import React, { useState } from "react";
import { useForm, Resolver, SubmitHandler } from "react-hook-form";
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
import { Settings as SettingsIcon, Save, Trash2 } from "lucide-react";

const settingsSchema = z.object({
  totalLimit: z.coerce.number().min(1, "Limit musi być większy od 0"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const Settings = () => {
  const { budget, updateBudget, resetExpenses } = useStore();
  const [saved, setSaved] = useState(false);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema) as Resolver<SettingsFormData>,
    defaultValues: {
      totalLimit: budget.totalLimit,
    },
  });

  const onSubmit: SubmitHandler<SettingsFormData> = (data) => {
    updateBudget(data.totalLimit);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <div className="space-y-2">
                <Label>Waluta (Domyślna)</Label>
                <Input value="PLN" disabled className="bg-muted" />
              </div>

              <Button type="submit" className="w-full gap-2">
                <Save className="w-4 h-4" />
                {saved ? "Zapisano!" : "Zapisz Zmiany"}
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
