import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { useMemo, useState } from 'react';
import { ActionsCell } from '../components/expenses/ActionsCell';
import { CategoryCell } from '../components/expenses/CategoryCell';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { Modal } from '../components/ui/Modal';
import { useAppData } from '../context/AppDataContext';
import { AG_GRID_LOCALE_PT_BR } from '../lib/agGridLocale';
import { gridTheme } from '../lib/agGridTheme';
import { formatDateBR } from '../lib/date';
import { centsToReais, formatCurrency } from '../lib/money';
import { PAYMENT_METHOD_LABELS, type Expense, type ExpenseInput } from '../types/expense';

export function ExpensesPage() {
  const { expenses, categories, getCategoryById, addExpense, updateExpense, removeExpense } =
    useAppData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  async function handleAdd(input: ExpenseInput) {
    await addExpense(input);
    setIsAdding(false);
  }

  async function handleEdit(input: ExpenseInput) {
    if (!editingExpense) return;
    await updateExpense(editingExpense.id, input);
    setEditingExpense(null);
  }

  function handleDelete(expense: Expense) {
    if (!window.confirm(`Excluir o lançamento "${expense.description}"?`)) return;
    void removeExpense(expense.id);
  }

  const columnDefs = useMemo<ColDef<Expense>[]>(
    () => [
      {
        headerName: 'Data',
        field: 'date',
        sort: 'desc',
        minWidth: 120,
        maxWidth: 140,
        filter: 'agTextColumnFilter',
        valueFormatter: (params) => (params.value ? formatDateBR(params.value) : ''),
      },
      {
        headerName: 'Descrição',
        field: 'description',
        flex: 2,
        minWidth: 160,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Categoria',
        colId: 'category',
        flex: 1,
        minWidth: 140,
        valueGetter: (params) => getCategoryById(params.data?.categoryId ?? '')?.name ?? '',
        filter: 'agTextColumnFilter',
        cellRenderer: CategoryCell,
        cellRendererParams: { getCategoryById },
      },
      {
        headerName: 'Forma de pagamento',
        field: 'paymentMethod',
        flex: 1,
        minWidth: 160,
        filter: 'agTextColumnFilter',
        valueFormatter: (params) =>
          params.value ? PAYMENT_METHOD_LABELS[params.value as Expense['paymentMethod']] : '',
      },
      {
        headerName: 'Valor',
        colId: 'amount',
        minWidth: 130,
        maxWidth: 150,
        filter: 'agNumberColumnFilter',
        valueGetter: (params) => (params.data ? centsToReais(params.data.amountCents) : 0),
        valueFormatter: (params) => formatCurrency(Math.round((params.value ?? 0) * 100)),
        cellClass: 'text-right font-medium',
        headerClass: 'text-right',
        sort: 'desc',
      },
      {
        headerName: '',
        colId: 'actions',
        width: 90,
        sortable: false,
        filter: false,
        resizable: false,
        cellRenderer: ActionsCell,
        cellRendererParams: { onEdit: setEditingExpense, onDelete: handleDelete },
      },
    ],
    [getCategoryById],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Lançamentos</h2>
        <button
          type="button"
          disabled={categories.length === 0}
          onClick={() => setIsAdding(true)}
          className="rounded-md bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          + Novo lançamento
        </button>
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-[var(--color-text-muted)]">
          Cadastre pelo menos uma categoria antes de adicionar lançamentos.
        </p>
      )}

      <div style={{ height: 520, width: '100%' }}>
        <AgGridReact<Expense>
          theme={gridTheme}
          rowData={expenses}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, resizable: true }}
          animateRows
          pagination
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50]}
          getRowId={(params) => params.data.id}
          localeText={AG_GRID_LOCALE_PT_BR}
        />
      </div>

      {isAdding && (
        <Modal title="Novo lançamento" onClose={() => setIsAdding(false)}>
          <ExpenseForm
            categories={categories}
            submitLabel="Adicionar"
            onSubmit={handleAdd}
            onCancel={() => setIsAdding(false)}
          />
        </Modal>
      )}

      {editingExpense && (
        <Modal title="Editar lançamento" onClose={() => setEditingExpense(null)}>
          <ExpenseForm
            categories={categories}
            initialExpense={editingExpense}
            submitLabel="Salvar"
            onSubmit={handleEdit}
            onCancel={() => setEditingExpense(null)}
          />
        </Modal>
      )}
    </div>
  );
}
