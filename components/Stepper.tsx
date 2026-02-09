import React from 'react';
import { cn } from '../lib/utils';

interface StepperContextProps {
  currentStep: number;
}

const StepperContext = React.createContext<StepperContextProps | undefined>(undefined);

interface StepperProps {
  currentStep: number;
  children?: React.ReactNode;
  className?: string;
}

// Main Compound Component
const Stepper = ({ currentStep, children, className }: StepperProps) => {
  return (
    <StepperContext.Provider value={{ currentStep }}>
      <div className={cn("flex w-full items-center justify-between", className)}>
        {children}
      </div>
    </StepperContext.Provider>
  );
};

interface StepProps {
  stepIndex: number; // 0-based
  label: string;
}

const Step = ({ stepIndex, label }: StepProps) => {
  const context = React.useContext(StepperContext);
  if (!context) throw new Error("Stepper.Step must be used within Stepper");

  const isActive = context.currentStep === stepIndex;
  const isCompleted = context.currentStep > stepIndex;

  return (
    <div className="flex flex-col items-center flex-1 relative">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 z-10 bg-background",
          isActive ? "border-primary text-primary" : "border-muted text-muted-foreground",
          isCompleted && "bg-primary border-primary text-primary-foreground"
        )}
      >
        {isCompleted ? "✓" : stepIndex + 1}
      </div>
      <span
        className={cn(
          "text-xs mt-2 font-medium absolute -bottom-6 w-max transition-colors",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
      {/* Connector Line */}
      <div className={cn(
        "absolute top-4 left-1/2 w-full h-[2px] -z-0",
        "bg-muted",
         // Simple hack for first/last step lines would go here but kept simple for brevity
      )} />
    </div>
  );
};

Stepper.Step = Step;

export default Stepper;