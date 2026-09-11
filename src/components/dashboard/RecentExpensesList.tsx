import { useTheme } from '../../context/ThemeContext';
import { colorForCategory } from '../../lib/categoryPalette';
import { formatDateBR } from '../../lib/date';
import { formatCurrency } from '../../lib/money';
import type { Category } from '../../types/category';
import type { Expense } from '../../types/expense';

interface RecentExpensesListProps {
  expenses: Expense[];
  getCategoryById: (id: string) => Category | undefined;
}

export function RecentExpensesList({ expenses, getCategoryById }: RecentExpensesListProps) {
  const { resolvedTheme } = useTheme();

  if (expenses.length === 0) {
    return <p className="text-sm text-[var(--color-text-muted)]">Nenhum lançamento ainda.</p>;
  }

  return (
    <ul className="flex flex-col divide-y divide-[var(--color-border)]">
      {expenses.map((expense) => {
        const category = getCategoryById(expense.categoryId);
        return (
          <li key={expense.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: category
                    ? colorForCategory(category.colorIndex, resolvedTheme)
                    : 'transparent',
                }}
              />
              <div className="min-w-0">
                <p className="truncate font-medium">{expense.description}</p>
                <p className="truncate text-xs text-[var(--color-text-muted)]">
                  {formatDateBR(expense.date)} · {category?.name ?? '—'}
                </p>
              </div>
            </div>
            <span className="shrink-0 font-medium">{formatCurrency(expense.amountCents)}</span>
          </li>
        );
      })}
    </ul>
  );
}
