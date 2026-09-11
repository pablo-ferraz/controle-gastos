import type { Expense, ExpenseInput } from '../types/expense';
import { LocalStorageRepository } from './localStorageRepository';

const STORAGE_KEY = 'controle-gastos:expenses';

export const expenseRepository = new LocalStorageRepository<Expense, ExpenseInput>(STORAGE_KEY);
