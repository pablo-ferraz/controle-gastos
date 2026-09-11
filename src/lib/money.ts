/**
 * Valores monetários são sempre representados em centavos (inteiros) para
 * evitar erros de ponto flutuante. A conversão para/de reais só acontece
 * na borda (entrada do usuário e formatação para exibição).
 */

export function reaisToCents(amountInReais: number): number {
  return Math.round(amountInReais * 100);
}

export function centsToReais(cents: number): number {
  return cents / 100;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(cents: number): string {
  return currencyFormatter.format(centsToReais(cents));
}
