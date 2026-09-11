import { currentMonthKey, dayOfMonth, daysInMonth, monthKeyOf } from './date';
import type { Category } from '../types/category';
import type { Expense } from '../types/expense';

export function filterByMonth(expenses: Expense[], monthKey: string = currentMonthKey()): Expense[] {
  return expenses.filter((expense) => monthKeyOf(expense.date) === monthKey);
}

export function sumCents(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amountCents, 0);
}

export interface CategoryTotal {
  categoryId: string;
  categoryName: string;
  colorIndex: number;
  totalCents: number;
}

export function totalsByCategory(expenses: Expense[], categories: Category[]): CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const expense of expenses) {
    totals.set(expense.categoryId, (totals.get(expense.categoryId) ?? 0) + expense.amountCents);
  }
  return categories
    .map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      colorIndex: category.colorIndex,
      totalCents: totals.get(category.id) ?? 0,
    }))
    .filter((entry) => entry.totalCents > 0)
    .sort((a, b) => b.totalCents - a.totalCents);
}

export interface DailyTotal {
  day: number;
  totalCents: number;
}

export function dailyTotalsForMonth(
  expenses: Expense[],
  monthKey: string = currentMonthKey(),
): DailyTotal[] {
  const totalDays = daysInMonth(monthKey);
  const totals = new Array<number>(totalDays).fill(0);
  for (const expense of expenses) {
    if (monthKeyOf(expense.date) !== monthKey) continue;
    totals[dayOfMonth(expense.date) - 1] += expense.amountCents;
  }
  return totals.map((totalCents, index) => ({ day: index + 1, totalCents }));
}

export function mostRecentExpenses(expenses: Expense[], limit = 5): Expense[] {
  return [...expenses]
    .sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.createdAt.localeCompare(a.createdAt);
    })
    .slice(0, limit);
}
