import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { nextColorIndex } from '../lib/categoryPalette';
import { categoryRepository } from '../repositories/categoryRepository';
import { expenseRepository } from '../repositories/expenseRepository';
import type { Category, CategoryInput } from '../types/category';
import type { Expense, ExpenseInput } from '../types/expense';

interface AppDataContextValue {
  expenses: Expense[];
  categories: Category[];
  isLoading: boolean;
  addExpense: (input: ExpenseInput) => Promise<void>;
  updateExpense: (id: string, patch: Partial<ExpenseInput>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, patch: Partial<CategoryInput>) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  expenseCountByCategory: (categoryId: string) => number;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([expenseRepository.list(), categoryRepository.list()]).then(
      ([expenseList, categoryList]) => {
        if (!active) return;
        setExpenses(expenseList);
        setCategories(categoryList);
        setIsLoading(false);
      },
    );
    return () => {
      active = false;
    };
  }, []);

  const addExpense = useCallback(async (input: ExpenseInput) => {
    const created = await expenseRepository.create(input);
    setExpenses((prev) => [...prev, created]);
  }, []);

  const updateExpense = useCallback(async (id: string, patch: Partial<ExpenseInput>) => {
    const updated = await expenseRepository.update(id, patch);
    setExpenses((prev) => prev.map((expense) => (expense.id === id ? updated : expense)));
  }, []);

  const removeExpense = useCallback(async (id: string) => {
    await expenseRepository.remove(id);
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

  const addCategory = useCallback(
    async (name: string) => {
      const created = await categoryRepository.create({
        name,
        colorIndex: nextColorIndex(categories.length),
      });
      setCategories((prev) => [...prev, created]);
    },
    [categories.length],
  );

  const updateCategory = useCallback(async (id: string, patch: Partial<CategoryInput>) => {
    const updated = await categoryRepository.update(id, patch);
    setCategories((prev) => prev.map((category) => (category.id === id ? updated : category)));
  }, []);

  const removeCategory = useCallback(async (id: string) => {
    await categoryRepository.remove(id);
    setCategories((prev) => prev.filter((category) => category.id !== id));
  }, []);

  const getCategoryById = useCallback(
    (id: string) => categories.find((category) => category.id === id),
    [categories],
  );

  const expenseCountByCategory = useCallback(
    (categoryId: string) => expenses.filter((expense) => expense.categoryId === categoryId).length,
    [expenses],
  );

  const value = useMemo<AppDataContextValue>(
    () => ({
      expenses,
      categories,
      isLoading,
      addExpense,
      updateExpense,
      removeExpense,
      addCategory,
      updateCategory,
      removeCategory,
      getCategoryById,
      expenseCountByCategory,
    }),
    [
      expenses,
      categories,
      isLoading,
      addExpense,
      updateExpense,
      removeExpense,
      addCategory,
      updateCategory,
      removeCategory,
      getCategoryById,
      expenseCountByCategory,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData deve ser usado dentro de <AppDataProvider>.');
  return ctx;
}
