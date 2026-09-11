import type { CustomCellRendererProps } from 'ag-grid-react';
import { colorForCategory } from '../../lib/categoryPalette';
import { useTheme } from '../../context/ThemeContext';
import type { Category } from '../../types/category';
import type { Expense } from '../../types/expense';

interface CategoryCellProps extends CustomCellRendererProps<Expense, string> {
  getCategoryById: (id: string) => Category | undefined;
}

export function CategoryCell({ data, getCategoryById }: CategoryCellProps) {
  const { resolvedTheme } = useTheme();
  if (!data) return null;
  const category = getCategoryById(data.categoryId);
  if (!category) return <span className="text-[var(--color-text-muted)]">—</span>;

  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: colorForCategory(category.colorIndex, resolvedTheme) }}
      />
      {category.name}
    </span>
  );
}
