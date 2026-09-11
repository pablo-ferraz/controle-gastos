import type { AgCartesianChartOptions } from 'ag-charts-community';
import { AgCharts } from 'ag-charts-react';
import { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import type { DailyTotal } from '../../lib/analytics';
import { CHART_TOKENS } from '../../lib/chartTokens';
import { centsToReais, formatCurrency } from '../../lib/money';

interface ChartRow {
  day: number;
  amount: number;
}

export function DailyTrendChart({ dailyTotals }: { dailyTotals: DailyTotal[] }) {
  const { resolvedTheme } = useTheme();
  const tokens = CHART_TOKENS[resolvedTheme];

  const data: ChartRow[] = useMemo(
    () => dailyTotals.map((entry) => ({ day: entry.day, amount: centsToReais(entry.totalCents) })),
    [dailyTotals],
  );

  const hasExpenses = data.some((entry) => entry.amount > 0);

  const options: AgCartesianChartOptions = useMemo(
    () => ({
      data,
      background: { fill: tokens.surface },
      padding: { top: 8, right: 16, bottom: 8, left: 8 },
      series: [
        {
          type: 'area',
          xKey: 'day',
          yKey: 'amount',
          stroke: tokens.accent,
          strokeWidth: 2,
          fill: tokens.accent,
          fillOpacity: 0.12,
          marker: { enabled: false },
          tooltip: {
            renderer: (params) => ({
              title: `Dia ${(params.datum as ChartRow).day}`,
              content: formatCurrency(Math.round((params.datum as ChartRow).amount * 100)),
            }),
          },
        },
      ],
      axes: {
        x: {
          type: 'number',
          position: 'bottom',
          label: { color: tokens.textMuted },
          gridLine: { enabled: false },
          line: { stroke: tokens.axis },
        },
        y: {
          type: 'number',
          position: 'left',
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
    [data, tokens],
  );

  if (!hasExpenses) {
    return (
      <p className="flex h-[240px] items-center justify-center text-sm text-[var(--color-text-muted)]">
        Nenhum gasto registrado neste mês ainda.
      </p>
    );
  }

  return <AgCharts options={options} style={{ height: 240, width: '100%' }} />;
}
