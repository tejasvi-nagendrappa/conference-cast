import { useAppStore } from '../../store/useAppStore';
import { CHANNELS } from '../../data/channels';

export const ChannelHealthTable = () => {
  const health = useAppStore((s) => s.channelHealth);
  const sessions = useAppStore((s) => s.sessions);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border)' }}>
          {['Channel', 'Session', 'Viewers', 'Capacity', 'Q&A', 'Trend'].map((h) => (
            <th key={h} style={{ padding: '6px 10px', color: 'var(--text-muted)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {CHANNELS.map((ch) => {
          const h = health.find((x) => x.channelId === ch.id);
          const session = sessions.find((s) => s.channelId === ch.id && s.status === 'live');
          const fill = h?.fillRate ?? 0;
          const fillColor = fill > 85 ? 'var(--live)' : fill > 60 ? 'var(--upcoming)' : '#22c55e';
          const trendIcon = { up: '↑', down: '↓', stable: '→' }[h?.trend ?? 'stable'];
          const trendColor = { up: '#22c55e', down: 'var(--live)', stable: 'var(--upcoming)' }[h?.trend ?? 'stable'];

          return (
            <tr key={ch.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px 10px' }}>
                <span style={{ color: ch.color, fontWeight: 700, fontSize: 11 }}>CH {ch.number}</span>
                <div style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 1 }}>{ch.name}</div>
              </td>
              <td style={{ padding: '10px 10px', color: 'var(--text-primary)', fontSize: 12, maxWidth: 160 }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {session?.title ?? <span style={{ color: 'var(--text-muted)' }}>—</span>}
                </div>
              </td>
              <td style={{ padding: '10px 10px', color: 'var(--text-primary)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                {h?.viewerCount ?? 0}
              </td>
              <td style={{ padding: '10px 10px', minWidth: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, height: 5, background: 'var(--border)', borderRadius: 3 }}>
                    <div style={{ width: `${fill}%`, height: '100%', background: fillColor, borderRadius: 3, transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ color: fillColor, fontSize: 11, fontWeight: 600, minWidth: 32 }}>{fill}%</span>
                </div>
              </td>
              <td style={{ padding: '10px 10px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                {h?.qaActivity ?? 0}
              </td>
              <td style={{ padding: '10px 10px', color: trendColor, fontWeight: 700, fontSize: 16 }}>
                {trendIcon}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
