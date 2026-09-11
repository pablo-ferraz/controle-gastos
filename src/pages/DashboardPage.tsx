import { useMemo } from 'react';
import { CategoryBarChart } from '../components/dashboard/CategoryBarChart';
import { DailyTrendChart } from '../components/dashboard/DailyTrendChart';
import { RecentExpensesList } from '../components/dashboard/RecentExpensesList';
import { StatTile } from '../components/dashboard/StatTile';
import { useAppData } from '../context/AppDataContext';
import {
  dailyTotalsForMonth,
  filterByMonth,
  mostRecentExpenses,
  sumCents,
  totalsByCategory,
} from '../lib/analytics';
import { currentMonthKey, formatMonthLabel } from '../lib/date';
import { formatCurrency } from '../lib/money';

export function DashboardPage() {
  const { expenses, categories, getCategoryById, isLoading } = useAppData();
  const monthKey = currentMonthKey();

  const monthExpenses = useMemo(() => filterByMonth(expenses, monthKey), [expenses, monthKey]);
  const totalCents = useMemo(() => sumCents(monthExpenses), [monthExpenses]);
  const categoryTotals = useMemo(
    () => totalsByCategory(monthExpenses, categories),
    [monthExpenses, categories],
  );
  const dailyTotals = useMemo(() => dailyTotalsForMonth(expenses, monthKey), [expenses, monthKey]);
  const recentExpenses = useMemo(() => mostRecentExpenses(expenses, 5), [expenses]);

  if (isLoading) {
    return <p className="text-sm text-[var(--color-text-muted)]">Carregando...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <StatTile label={`Total gasto em ${formatMonthLabel(monthKey)}`} value={formatCurrency(totalCents)} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">
            Gastos por categoria
          </h2>
          <CategoryBarChart totals={categoryTotals} />
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">
            Evolução diária no mês
          </h2>
          <DailyTrendChart dailyTotals={dailyTotals} />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 className="mb-1 text-sm font-semibold text-[var(--color-text-secondary)]">
          Lançamentos recentes
        </h2>
        <RecentExpensesList expenses={recentExpenses} getCategoryById={getCategoryById} />
      </div>
    </div>
  );
}
