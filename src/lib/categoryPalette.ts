import type { ThemeMode } from '../context/ThemeContext';

/**
 * Paleta categórica fixa (8 matizes espalhadas pelo círculo cromático,
 * validada para contraste e diferenciação sob daltonismo). A ordem nunca
 * deve ser alterada nem embaralhada — é o que garante que cores adjacentes
 * fiquem sempre distinguíveis.
 */
export const CATEGORY_PALETTE: Record<ThemeMode, readonly string[]> = {
  light: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'],
  dark: ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'],
};

export const CATEGORY_PALETTE_SIZE = CATEGORY_PALETTE.light.length;

export function colorForCategory(colorIndex: number, mode: ThemeMode): string {
  const palette = CATEGORY_PALETTE[mode];
  const safeIndex = ((colorIndex % palette.length) + palette.length) % palette.length;
  return palette[safeIndex];
}

export function nextColorIndex(existingCount: number): number {
  return existingCount % CATEGORY_PALETTE_SIZE;
}
