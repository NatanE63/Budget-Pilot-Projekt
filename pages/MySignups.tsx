import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Label } from '../components/ui';
import { Settings as SettingsIcon, Save } from 'lucide-react';

const Settings = () => {
  const { budget, updateBudget } = useStore();
  const [limit, setLimit] = useState(budget.totalLimit);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateBudget(Number(limit));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Całkowity Limit Budżetu (PLN)</Label>
            <Input 
              type="number" 
              value={limit} 
              onChange={(e) => setLimit(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              To jest maksymalna kwota, którą planujesz wydać.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Waluta (Domyślna)</Label>
            <Input value="PLN" disabled className="bg-muted" />
          </div>

          <Button onClick={handleSave} className="w-full gap-2">
            <Save className="w-4 h-4" /> 
            {saved ? 'Zapisano!' : 'Zapisz Zmiany'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
