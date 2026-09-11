export type PaymentMethod = 'dinheiro' | 'debito' | 'credito' | 'pix' | 'transferencia' | 'outro';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  dinheiro: 'Dinheiro',
  debito: 'Cartão de débito',
  credito: 'Cartão de crédito',
  pix: 'Pix',
  transferencia: 'Transferência',
  outro: 'Outro',
};

export const PAYMENT_METHODS = Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[];

export interface Expense {
  id: string;
  date: string;
  description: string;
  categoryId: string;
  amountCents: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseInput {
  date: string;
  description: string;
  categoryId: string;
  amountCents: number;
  paymentMethod: PaymentMethod;
}
