import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from './components/ui';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Events'; // Re-using file slot for Expense List
import AddExpense from './pages/EventWizard'; // Re-using file slot for Wizard
import Settings from './pages/MySignups'; // Re-using file slot for Settings
import Reports from './pages/Admin'; // Re-using file slot for Reports
import ExpenseDetails from './pages/EventDetails'; // Re-using file slot details
import { LayoutDashboard, Wallet, PlusCircle, Settings as SettingsIcon, PieChart } from 'lucide-react';
import { cn } from './lib/utils';

const NavBar = () => {
  const location = useLocation();

  const navItemClass = (path: string) => cn(
    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
    location.pathname === path ? "bg-muted text-primary" : "text-muted-foreground"
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight text-primary">Budget Pilot</span>
          </Link>
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link to="/" className={navItemClass('/')}>
              <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">Pulpit</span>
            </Link>
            <Link to="/expenses" className={navItemClass('/expenses')}>
              <Wallet className="w-4 h-4" /> <span className="hidden sm:inline">Wydatki</span>
            </Link>
            <Link to="/add" className={navItemClass('/add')}>
              <PlusCircle className="w-4 h-4" /> <span className="hidden sm:inline">Dodaj</span>
            </Link>
            <Link to="/reports" className={navItemClass('/reports')}>
              <PieChart className="w-4 h-4" /> <span className="hidden sm:inline">Raporty</span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-2">
           <Link to="/settings">
             <Button variant="ghost" size="sm">
                <SettingsIcon className="w-4 h-4 mr-2" /> Ustawienia
             </Button>
           </Link>
        </div>
      </div>
    </header>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <NavBar />
        <main className="flex-1">
           <div className="container py-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/expenses/:id" element={<ExpenseDetails />} />
                <Route path="/add" element={<AddExpense />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
           </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
