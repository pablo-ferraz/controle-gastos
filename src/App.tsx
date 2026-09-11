import { useState } from 'react';
import { ThemeToggle } from './components/layout/ThemeToggle';
import { AppDataProvider } from './context/AppDataContext';
import { ThemeProvider } from './context/ThemeContext';
import { CategoriesPage } from './pages/CategoriesPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExpensesPage } from './pages/ExpensesPage';

type Tab = 'dashboard' | 'expenses' | 'categories';

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'expenses', label: 'Lançamentos' },
  { id: 'categories', label: 'Categorias' },
];

function AppShell() {
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-[var(--color-page)] text-[var(--color-text-primary)]">
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-lg font-semibold">Controle de Gastos</h1>
            <div className="sm:hidden">
              <ThemeToggle />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <nav className="flex gap-1 rounded-lg bg-[var(--color-surface-muted)] p-1">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    tab === item.id
                      ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        {tab === 'dashboard' && <DashboardPage />}
        {tab === 'expenses' && <ExpensesPage />}
        {tab === 'categories' && <CategoriesPage />}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppDataProvider>
        <AppShell />
      </AppDataProvider>
    </ThemeProvider>
  );
}

export default App;
