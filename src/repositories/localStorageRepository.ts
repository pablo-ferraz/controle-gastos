import { generateId } from '../lib/id';
import type { CrudRepository } from './types';

interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Implementação genérica de CrudRepository sobre localStorage. Os métodos
 * são assíncronos (mesmo sem operação de I/O real) para que a troca futura
 * por um repositório baseado em API não exija alterar quem os consome.
 */
export class LocalStorageRepository<T extends BaseEntity, CreateInput>
  implements CrudRepository<T, CreateInput>
{
  private readonly storageKey: string;
  private readonly seedFactory?: () => T[];

  constructor(storageKey: string, seedFactory?: () => T[]) {
    this.storageKey = storageKey;
    this.seedFactory = seedFactory;
  }

  private readAll(): T[] {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(this.storageKey);
    if (raw === null) {
      const seeded = this.seedFactory?.() ?? [];
      this.writeAll(seeded);
      return seeded;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  async list(): Promise<T[]> {
    return this.readAll();
  }

  async get(id: string): Promise<T | undefined> {
    return this.readAll().find((item) => item.id === id);
  }

  async create(input: CreateInput): Promise<T> {
    const now = new Date().toISOString();
    const item = { ...input, id: generateId(), createdAt: now, updatedAt: now } as unknown as T;
    const items = this.readAll();
    items.push(item);
    this.writeAll(items);
    return item;
  }

  async update(id: string, patch: Partial<CreateInput>): Promise<T> {
    const items = this.readAll();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Registro "${id}" não encontrado em "${this.storageKey}".`);
    }
    const updated: T = { ...items[index], ...patch, id, updatedAt: new Date().toISOString() };
    items[index] = updated;
    this.writeAll(items);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const items = this.readAll().filter((item) => item.id !== id);
    this.writeAll(items);
  }
}
