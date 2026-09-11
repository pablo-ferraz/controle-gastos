/**
 * Contrato usado pelos componentes React para ler/escrever dados.
 * A implementação atual guarda tudo no localStorage, mas qualquer
 * implementação futura (ex.: uma API HTTP) pode assumir esse mesmo
 * contrato sem exigir mudanças nos componentes.
 */
export interface CrudRepository<T, CreateInput> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  create(input: CreateInput): Promise<T>;
  update(id: string, patch: Partial<CreateInput>): Promise<T>;
  remove(id: string): Promise<void>;
}
