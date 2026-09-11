import { themeQuartz } from 'ag-grid-community';

/**
 * Tema único do AG Grid com parâmetros diferentes por modo. A troca entre
 * os dois conjuntos acontece via atributo `data-ag-theme-mode` no <html>
 * (definido pelo ThemeContext), sem precisar recriar o tema em runtime.
 */
export const gridTheme = themeQuartz
  .withParams(
    {
      backgroundColor: '#fcfcfb',
      foregroundColor: '#0b0b0b',
      borderColor: '#e1e0d9',
      headerBackgroundColor: '#f0efec',
      headerTextColor: '#52514e',
      oddRowBackgroundColor: '#f9f9f7',
      rowHoverColor: '#f0efec',
      accentColor: '#2a78d6',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    },
    'light',
  )
  .withParams(
    {
      backgroundColor: '#1a1a19',
      foregroundColor: '#ffffff',
      borderColor: '#2c2c2a',
      headerBackgroundColor: '#232322',
      headerTextColor: '#c3c2b7',
      oddRowBackgroundColor: '#1f1f1e',
      rowHoverColor: '#232322',
      accentColor: '#3987e5',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    },
    'dark',
  );
