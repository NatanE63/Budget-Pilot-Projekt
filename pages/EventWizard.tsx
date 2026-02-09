import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useStore } from "../lib/store";
import {
  Button,
  Input,
  Label,
  Select,
  Card,
  CardContent,
} from "../components/ui";
import Stepper from "../components/Stepper";
import { Category } from "../types";

// --- ZOD SCHEMAS ---

// Step 1: Basics (Amount, Title)
const step1Schema = z.object({
  title: z.string().min(2, "Nazwa wydatku jest wymagana"),
  amount: z.coerce.number().min(0.01, "Kwota musi być większa od 0"),
});

// Step 2: Details (Category, Date, Desc)
const step2Schema = z.object({
  category: z.enum([
    "Restauracje",
    "Atrakcje",
    "Transport",
    "Nocleg",
    "Zakupy",
    "Inne",
  ] as const),
  date: z.string().min(1, "Data jest wymagana"),
  location: z.string().optional(),
  description: z.string().optional(),
});

// Step 3: Confirmation (just review)
const step3Schema = z.object({
  confirmed: z.literal(true),
});

const finalSchema = step1Schema.and(step2Schema); // combined for data type

// Explicitly type FormData to match the output type
type FormData = {
  title: string;
  amount: number;
  category:
    | "Restauracje"
    | "Atrakcje"
    | "Transport"
    | "Nocleg"
    | "Zakupy"
    | "Inne";
  date: string;
  location?: string;
  description?: string;
};

// --- WIZARD PAGE ---

const AddExpense = () => {
  const navigate = useNavigate();
  const { addExpense } = useStore();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(finalSchema) as any,
    mode: "onChange",
    defaultValues: {
      title: "",
      amount: 0,
      category: "Restauracje",
      date: new Date().toISOString().split("T")[0],
      location: "",
      description: "",
    },
  });

  const {
    formState: { errors, isValid },
    trigger,
    control,
    getValues,
    register,
  } = form;

  const handleNext = async (e?: React.MouseEvent) => {
    e?.preventDefault(); // Prevent any default form submission if triggered by button

    // Validate only current step fields
    const fieldsToValidate =
      currentStep === 0
        ? (["title", "amount"] as const)
        : (["category", "date"] as const);

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSubmit = (data: FormData) => {
    addExpense({
      id: crypto.randomUUID(),
      title: data.title,
      amount: Number(data.amount),
      category: data.category,
      date: data.date,
      location: data.location,
      description: data.description,
    });

    // Slight delay for UX
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const onSubmit = (data: FormData) => {
    // Prevent default form submission via Enter key from triggering final submit
    // Only allow navigation via Enter key on non-final steps
    if (currentStep < 2) {
      handleNext();
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 animate-fade-in">
      <Card>
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Dodaj Nowy Wydatek
          </h2>
          <Stepper currentStep={currentStep} className="mb-8 max-w-sm mx-auto">
            <Stepper.Step stepIndex={0} label="Kwota" />
            <Stepper.Step stepIndex={1} label="Szczegóły" />
            <Stepper.Step stepIndex={2} label="Potwierdź" />
          </Stepper>
        </div>

        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* STEP 1 */}
            {currentStep === 0 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Co kupiłeś?</Label>
                  <Input
                    {...register("title")}
                    placeholder="np. Obiad w pizzerii"
                    autoFocus
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Kwota (PLN)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("amount")}
                    placeholder="0.00"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-xs">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Kategoria</Label>
                  <Select {...register("category")}>
                    <option value="Restauracje">Restauracje</option>
                    <option value="Atrakcje">Atrakcje</option>
                    <option value="Transport">Transport</option>
                    <option value="Nocleg">Nocleg</option>
                    <option value="Zakupy">Zakupy</option>
                    <option value="Inne">Inne</option>
                  </Select>
                  {errors.category && (
                    <p className="text-red-500 text-xs">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input type="date" {...register("date")} />
                  {errors.date && (
                    <p className="text-red-500 text-xs">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Lokalizacja (Opcjonalnie)</Label>
                  <Input
                    {...register("location")}
                    placeholder="np. Kraków, Rynek"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Opis (Opcjonalnie)</Label>
                  <Input
                    {...register("description")}
                    placeholder="Dodatkowe notatki..."
                  />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in text-center">
                <div className="bg-muted p-6 rounded-lg space-y-3">
                  <h3 className="text-lg font-medium text-foreground">
                    Podsumowanie
                  </h3>
                  <div className="text-4xl font-bold text-primary my-4">
                    {Number(getValues("amount")).toFixed(2)} PLN
                  </div>
                  <div className="text-sm text-muted-foreground text-left space-y-1 pl-4 border-l-2 border-primary">
                    <p>
                      <strong>Co:</strong> {getValues("title")}
                    </p>
                    <p>
                      <strong>Kategoria:</strong> {getValues("category")}
                    </p>
                    <p>
                      <strong>Data:</strong> {getValues("date")}
                    </p>
                    {getValues("location") && (
                      <p>
                        <strong>Gdzie:</strong> {getValues("location")}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Czy wszystko się zgadza?
                </p>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Wstecz
              </Button>
              {currentStep < 2 ? (
                <Button type="button" onClick={handleNext}>
                  Dalej
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={form.handleSubmit(handleFinalSubmit)}
                >
                  Zapisz Wydatek
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddExpense;
