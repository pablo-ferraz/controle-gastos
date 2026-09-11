import { DEFAULT_CATEGORIES } from '../data/defaultCategories';
import { generateId } from '../lib/id';
import type { Category, CategoryInput } from '../types/category';
import { LocalStorageRepository } from './localStorageRepository';

const STORAGE_KEY = 'controle-gastos:categories';

function seedDefaultCategories(): Category[] {
  const now = new Date().toISOString();
  return DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }));
}

export const categoryRepository = new LocalStorageRepository<Category, CategoryInput>(
  STORAGE_KEY,
  seedDefaultCategories,
);
