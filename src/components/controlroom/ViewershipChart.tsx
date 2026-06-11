import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartLegend,
  ChartTooltip,
} from '@progress/kendo-react-charts';
import { useAppStore } from '../../store/useAppStore';
import { CHANNELS } from '../../data/channels';

export const ViewershipChart = () => {
  const history = useAppStore((s) => s.viewershipHistory);
  const theme = useAppStore((s) => s.theme);
  const labelColor = theme === 'dark' ? '#64748b' : '#94a3b8';

  if (history.length < 2) {
    return (
      <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        Collecting data...
      </div>
    );
  }

  const categories = history.map((h) => h.time);

  return (
    <Chart style={{ height: 220, background: 'transparent' }}>
      <ChartLegend position="bottom" labels={{ color: labelColor, font: '11px sans-serif' }} />
      <ChartTooltip />
      <ChartCategoryAxis>
        <ChartCategoryAxisItem
          categories={categories}
          labels={{ color: labelColor, font: '10px sans-serif', rotation: -30, step: Math.max(1, Math.floor(history.length / 5)) }}
          line={{ color: 'transparent' }}
          majorGridLines={{ visible: false }}
        />
      </ChartCategoryAxis>
      <ChartValueAxis>
        <ChartValueAxisItem
          labels={{ color: labelColor, font: '10px sans-serif' }}
          majorGridLines={{ color: theme === 'dark' ? '#1f2d3d' : '#e2e8f0' }}
          line={{ color: 'transparent' }}
        />
      </ChartValueAxis>
      <ChartSeries>
        {CHANNELS.map((ch) => (
          <ChartSeriesItem
            key={ch.id}
            type="line"
            name={ch.name}
            data={history.map((h) => (h as unknown as Record<string, number>)[ch.id] ?? 0)}
            color={ch.color}
            markers={{ visible: false }}
            width={2}
          />
        ))}
      </ChartSeries>
    </Chart>
  );
};
