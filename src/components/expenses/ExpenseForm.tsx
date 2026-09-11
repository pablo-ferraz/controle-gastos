import { useState, type FormEvent } from 'react';
import { reaisToCents, centsToReais } from '../../lib/money';
import { todayISO } from '../../lib/date';
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS, type Expense, type ExpenseInput } from '../../types/expense';
import type { Category } from '../../types/category';

interface ExpenseFormProps {
  categories: Category[];
  initialExpense?: Expense;
  submitLabel: string;
  onSubmit: (input: ExpenseInput) => void;
  onCancel: () => void;
}

export function ExpenseForm({
  categories,
  initialExpense,
  submitLabel,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const [date, setDate] = useState(initialExpense?.date ?? todayISO());
  const [description, setDescription] = useState(initialExpense?.description ?? '');
  const [categoryId, setCategoryId] = useState(initialExpense?.categoryId ?? categories[0]?.id ?? '');
  const [amount, setAmount] = useState(
    initialExpense ? String(centsToReais(initialExpense.amountCents)) : '',
  );
  const [paymentMethod, setPaymentMethod] = useState(initialExpense?.paymentMethod ?? 'pix');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!description.trim()) {
      setError('Informe uma descrição.');
      return;
    }
    if (!categoryId) {
      setError('Selecione uma categoria.');
      return;
    }
    const amountValue = Number(amount);
    if (!amount || Number.isNaN(amountValue) || amountValue <= 0) {
      setError('Informe um valor maior que zero.');
      return;
    }

    onSubmit({
      date,
      description: description.trim(),
      categoryId,
      amountCents: reaisToCents(amountValue),
      paymentMethod,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-secondary)]">Data</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-secondary)]">Valor (R$)</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0,00"
            required
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-[var(--color-text-secondary)]">Descrição</span>
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Ex.: Supermercado"
          required
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-secondary)]">Categoria</span>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            required
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-secondary)]">Forma de pagamento</span>
          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value as Expense['paymentMethod'])}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {PAYMENT_METHOD_LABELS[method]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-md bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
