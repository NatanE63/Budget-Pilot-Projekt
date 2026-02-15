import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller, Resolver } from "react-hook-form";
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
import ReCAPTCHA from "react-google-recaptcha";
import { Category } from "../types";
import { getCategoryIcon, getCategoryColor } from "../lib/utils";

// --- ZOD SCHEMAS ---

// Step 1: Basics (Amount, Title)
const step1Schema = z.object({
  title: z
    .string()
    .min(2, "Nazwa wydatku jest wymagana")
    .regex(/^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż]/, "Nazwa musi zaczynać się od litery"),
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
  date: z
    .string()
    .min(1, "Data jest wymagana")
    .refine(
      (val) => new Date(val) <= new Date(),
      "Data nie może być z przyszłości",
    ),
  location: z.string().optional(),
  description: z.string().optional(),
});

// Step 3: Confirmation (captcha)
const step3Schema = z.object({
  captcha: z.string().min(1, "Potwierdź, że nie jesteś robotem"),
});

const finalSchema = step1Schema.and(step2Schema).and(step3Schema); // combined for data type

// Explicitly type FormData to match the output type
type FormData = {
  title: string;
  amount: number | string;
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
  captcha: string;
};

// --- WIZARD PAGE ---

const AddExpense = () => {
  const navigate = useNavigate();
  const { addExpense } = useStore();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(finalSchema) as Resolver<FormData>,
    mode: "onChange",
    defaultValues: {
      title: "",
      amount: "",
      category: "Restauracje",
      date: new Date().toISOString().split("T")[0],
      location: "",
      description: "",
      captcha: "",
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
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => {
                      const categories: Category[] = [
                        "Restauracje",
                        "Atrakcje",
                        "Transport",
                        "Nocleg",
                        "Zakupy",
                        "Inne",
                      ];
                      return (
                        <div className="grid grid-cols-3 gap-2">
                          {categories.map((cat) => {
                            const Icon = getCategoryIcon(cat);
                            const isSelected = field.value === cat;
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => field.onChange(cat)}
                                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-xs font-medium transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary/10 text-primary scale-105"
                                    : "border-muted bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted"
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      );
                    }}
                  />
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
                <div className="flex justify-center mt-6">
                  <Controller
                    name="captcha"
                    control={control}
                    render={({ field }) => (
                      <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        onChange={(token) => field.onChange(token)}
                      />
                    )}
                  />
                </div>
                {errors.captcha && (
                  <p className="text-red-500 text-xs text-center mt-2">
                    {errors.captcha.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-4">
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
