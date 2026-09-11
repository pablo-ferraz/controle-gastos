import { useState, type FormEvent } from 'react';

interface CategoryFormProps {
  initialName?: string;
  submitLabel: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export function CategoryForm({ initialName = '', submitLabel, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Informe um nome para a categoria.');
      return;
    }
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-[var(--color-text-secondary)]">Nome</span>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError(null);
          }}
          placeholder="Ex.: Assinaturas"
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
        />
        {error && <span className="text-[var(--color-danger)]">{error}</span>}
      </label>
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
