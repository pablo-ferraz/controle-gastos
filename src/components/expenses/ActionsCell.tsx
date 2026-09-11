import type { CustomCellRendererProps } from 'ag-grid-react';
import type { Expense } from '../../types/expense';

interface ActionsCellProps extends CustomCellRendererProps<Expense> {
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ActionsCell({ data, onEdit, onDelete }: ActionsCellProps) {
  if (!data) return null;

  return (
    <div className="flex h-full items-center gap-1">
      <button
        type="button"
        onClick={() => onEdit(data)}
        aria-label="Editar lançamento"
        className="rounded-md px-2 py-1 text-sm hover:bg-[var(--color-surface-muted)]"
      >
        ✏️
      </button>
      <button
        type="button"
        onClick={() => onDelete(data)}
        aria-label="Excluir lançamento"
        className="rounded-md px-2 py-1 text-sm hover:bg-[var(--color-surface-muted)]"
      >
        🗑️
      </button>
    </div>
  );
}
