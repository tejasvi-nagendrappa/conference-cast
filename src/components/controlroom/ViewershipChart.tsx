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
  ChartArea,
} from '@progress/kendo-react-charts';
import { useAppStore } from '../../store/useAppStore';
import { CHANNELS } from '../../data/channels';

export const ViewershipChart = () => {
  const history = useAppStore((s) => s.viewershipHistory);
  const theme = useAppStore((s) => s.theme);
  const labelColor = theme === 'dark' ? '#64748b' : '#94a3b8';
  const gridColor = theme === 'dark' ? '#1f2d3d' : '#e2e8f0';

  const categories = history.map((h) => h.time);

  return (
    <Chart style={{ height: 300, background: 'transparent' }}>
      <ChartArea background="transparent" />
      <ChartLegend
        position="bottom"
        labels={{ color: labelColor, font: '11px sans-serif' }}
      />
      <ChartTooltip shared />
      <ChartCategoryAxis>
        <ChartCategoryAxisItem
          categories={categories}
          labels={{
            color: labelColor,
            font: '10px sans-serif',
            step: Math.max(1, Math.floor(history.length / 6)),
          }}
          line={{ color: 'transparent' }}
          majorGridLines={{ visible: false }}
        />
      </ChartCategoryAxis>
      <ChartValueAxis>
        <ChartValueAxisItem
          labels={{ color: labelColor, font: '10px sans-serif' }}
          majorGridLines={{ color: gridColor, dashType: 'dot' }}
          line={{ color: 'transparent' }}
          min={0}
        />
      </ChartValueAxis>
      <ChartSeries>
        {CHANNELS.map((ch) => (
          <ChartSeriesItem
            key={ch.id}
            type="area"
            name={ch.name}
            data={history.map((h) => (h as unknown as Record<string, number>)[ch.id] ?? 0)}
            color={ch.color}
            opacity={0.35}
            line={{ color: ch.color, width: 2.5 }}
            markers={{ visible: false }}
          />
        ))}
      </ChartSeries>
    </Chart>
  );
};
