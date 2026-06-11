import { Grid, GridColumn } from '@progress/kendo-react-grid';
import type { GridCellProps } from '@progress/kendo-react-grid';
import { useAppStore } from '../../store/useAppStore';
import { CHANNELS } from '../../data/channels';
import type { ChannelHealth } from '../../types';

const FillRateCell = (props: GridCellProps) => {
  const { fillRate } = props.dataItem as ChannelHealth;
  const color = fillRate > 80 ? '#ef4444' : fillRate > 50 ? '#f59e0b' : '#22c55e';
  return (
    <td>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 6, background: '#2d3748', borderRadius: 3 }}>
          <div style={{ width: `${fillRate}%`, height: '100%', background: color, borderRadius: 3 }} />
        </div>
        <span style={{ color, fontSize: 12, fontWeight: 600, minWidth: 36 }}>{fillRate}%</span>
      </div>
    </td>
  );
};

const TrendCell = (props: GridCellProps) => {
  const { trend } = props.dataItem as ChannelHealth;
  const icons: Record<string, string> = { up: '↑', down: '↓', stable: '→' };
  const colors: Record<string, string> = { up: '#22c55e', down: '#ef4444', stable: '#f59e0b' };
  return <td style={{ color: colors[trend], fontWeight: 700, fontSize: 16 }}>{icons[trend]}</td>;
};

const ChannelCell = (props: GridCellProps) => {
  const { channelId } = props.dataItem as ChannelHealth;
  const channel = CHANNELS.find((c) => c.id === channelId);
  return (
    <td>
      <span style={{ color: channel?.color ?? '#fff', fontWeight: 600, fontSize: 13 }}>
        CH {channel?.number} · {channel?.name}
      </span>
    </td>
  );
};

export const ChannelHealthGrid = () => {
  const health = useAppStore((s) => s.channelHealth);

  return (
    <div>
      <div style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
        Channel Health
      </div>
      <Grid data={health} style={{ background: 'transparent', border: '1px solid #2d3748' }}>
        <GridColumn field="channelId" title="Channel" cells={{ data: ChannelCell }} />
        <GridColumn field="viewerCount" title="Viewers" width={90} />
        <GridColumn field="fillRate" title="Capacity" cells={{ data: FillRateCell }} />
        <GridColumn field="qaActivity" title="Q&A / min" width={90} />
        <GridColumn field="trend" title="Trend" width={70} cells={{ data: TrendCell }} />
      </Grid>
    </div>
  );
};
