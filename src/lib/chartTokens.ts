import type { ThemeMode } from '../context/ThemeContext';

/**
 * AG Charts desenha em canvas, então não entende `var(--...)`: os tokens
 * de cor precisam ser resolvidos para hex antes de chegar às opções do
 * gráfico. Os valores espelham os definidos em `index.css`.
 */
export interface ChartTokens {
  surface: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  axis: string;
  accent: string;
}

export const CHART_TOKENS: Record<ThemeMode, ChartTokens> = {
  light: {
    surface: '#fcfcfb',
    textPrimary: '#0b0b0b',
    textSecondary: '#52514e',
    textMuted: '#898781',
    border: '#e1e0d9',
    axis: '#c3c2b7',
    accent: '#2a78d6',
  },
  dark: {
    surface: '#1a1a19',
    textPrimary: '#ffffff',
    textSecondary: '#c3c2b7',
    textMuted: '#898781',
    border: '#2c2c2a',
    axis: '#383835',
    accent: '#3987e5',
  },
};
