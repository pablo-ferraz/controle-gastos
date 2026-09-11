import { useState } from 'react';
import { CategoryForm } from '../components/categories/CategoryForm';
import { Modal } from '../components/ui/Modal';
import { useAppData } from '../context/AppDataContext';
import { colorForCategory } from '../lib/categoryPalette';
import { useTheme } from '../context/ThemeContext';
import type { Category } from '../types/category';

export function CategoriesPage() {
  const { categories, expenseCountByCategory, addCategory, updateCategory, removeCategory } =
    useAppData();
  const { resolvedTheme } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(name: string) {
    await addCategory(name);
    setIsAdding(false);
  }

  async function handleEdit(name: string) {
    if (!editingCategory) return;
    await updateCategory(editingCategory.id, { name });
    setEditingCategory(null);
  }

  async function handleDelete(category: Category) {
    const count = expenseCountByCategory(category.id);
    if (count > 0) {
      setError(
        count === 1
          ? `"${category.name}" não pode ser excluída: existe 1 lançamento nessa categoria.`
          : `"${category.name}" não pode ser excluída: existem ${count} lançamentos nessa categoria.`,
      );
      return;
    }
    if (!window.confirm(`Excluir a categoria "${category.name}"?`)) return;
    setError(null);
    await removeCategory(category.id);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Categorias</h2>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="rounded-md bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          + Nova categoria
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-[var(--color-danger)] bg-[var(--color-danger-surface)] px-3 py-2 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      )}

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const count = expenseCountByCategory(category.id);
          return (
            <li
              key={category.id}
              className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: colorForCategory(category.colorIndex, resolvedTheme) }}
                />
                <div>
                  <p className="text-sm font-medium">{category.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {count} lançamento{count === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditingCategory(category)}
                  aria-label={`Editar ${category.name}`}
                  className="rounded-md px-2 py-1 text-sm hover:bg-[var(--color-surface-muted)]"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(category)}
                  aria-label={`Excluir ${category.name}`}
                  className="rounded-md px-2 py-1 text-sm hover:bg-[var(--color-surface-muted)]"
                >
                  🗑️
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {categories.length === 0 && (
        <p className="text-sm text-[var(--color-text-muted)]">Nenhuma categoria cadastrada.</p>
      )}

      {isAdding && (
        <Modal title="Nova categoria" onClose={() => setIsAdding(false)}>
          <CategoryForm submitLabel="Adicionar" onSubmit={handleAdd} onCancel={() => setIsAdding(false)} />
        </Modal>
      )}

      {editingCategory && (
        <Modal title="Editar categoria" onClose={() => setEditingCategory(null)}>
          <CategoryForm
            initialName={editingCategory.name}
            submitLabel="Salvar"
            onSubmit={handleEdit}
            onCancel={() => setEditingCategory(null)}
          />
        </Modal>
      )}
    </div>
  );
}
