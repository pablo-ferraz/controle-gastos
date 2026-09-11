import type { AgCartesianChartOptions } from 'ag-charts-community';
import { AgCharts } from 'ag-charts-react';
import { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import type { CategoryTotal } from '../../lib/analytics';
import { colorForCategory } from '../../lib/categoryPalette';
import { CHART_TOKENS } from '../../lib/chartTokens';
import { centsToReais, formatCurrency } from '../../lib/money';

interface ChartRow {
  categoryName: string;
  colorIndex: number;
  amount: number;
}

export function CategoryBarChart({ totals }: { totals: CategoryTotal[] }) {
  const { resolvedTheme } = useTheme();
  const tokens = CHART_TOKENS[resolvedTheme];

  const data: ChartRow[] = useMemo(
    () =>
      totals.map((total) => ({
        categoryName: total.categoryName,
        colorIndex: total.colorIndex,
        amount: centsToReais(total.totalCents),
      })),
    [totals],
  );

  const options: AgCartesianChartOptions = useMemo(
    () => ({
      data,
      background: { fill: tokens.surface },
      padding: { top: 8, right: 32, bottom: 8, left: 8 },
      series: [
        {
          type: 'bar',
          direction: 'horizontal',
          xKey: 'categoryName',
          yKey: 'amount',
          cornerRadius: 4,
          itemStyler: (params) => ({
            fill: colorForCategory((params.datum as ChartRow).colorIndex, resolvedTheme),
          }),
          label: {
            enabled: true,
            placement: ['outside-end', 'inside-end'],
            color: tokens.textSecondary,
            formatter: (params) => formatCurrency(Math.round(Number(params.value) * 100)),
          },
          tooltip: {
            renderer: (params) => ({
              title: (params.datum as ChartRow).categoryName,
              content: formatCurrency(Math.round((params.datum as ChartRow).amount * 100)),
            }),
          },
        },
      ],
      axes: {
        x: {
          type: 'category',
          position: 'left',
          label: { color: tokens.textSecondary },
          line: { stroke: tokens.axis },
          gridLine: { enabled: false },
        },
        y: {
          type: 'number',
          position: 'bottom',
          label: {
            color: tokens.textMuted,
            formatter: (params) => formatCurrency(Math.round(Number(params.value) * 100)),
          },
          gridLine: { style: [{ stroke: tokens.border }] },
          line: { enabled: false },
        },
      },
      legend: { enabled: false },
    }),
    [data, tokens, resolvedTheme],
  );

  if (data.length === 0) {
    return (
      <p className="flex h-[240px] items-center justify-center text-sm text-[var(--color-text-muted)]">
        Nenhum gasto registrado neste mês ainda.
      </p>
    );
  }

  return <AgCharts options={options} style={{ height: 240, width: '100%' }} />;
}
