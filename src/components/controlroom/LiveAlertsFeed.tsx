import { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CHANNELS } from '../../data/channels';

interface Alert {
  id: string;
  channelId: string;
  type: 'capacity' | 'qa' | 'low' | 'live';
  message: string;
  time: string;
}

export const LiveAlertsFeed = () => {
  const health = useAppStore((s) => s.channelHealth);
  const sessions = useAppStore((s) => s.sessions);

  const alerts = useMemo((): Alert[] => {
    const result: Alert[] = [];
    health.forEach((h) => {
      const ch = CHANNELS.find((c) => c.id === h.channelId);
      const session = sessions.find((s) => s.channelId === h.channelId && s.status === 'live');
      if (!ch || !session) return;

      if (h.fillRate > 85)
        result.push({ id: `cap-${h.channelId}`, channelId: h.channelId, type: 'capacity', message: `${ch.name} at ${h.fillRate}% capacity`, time: 'now' });
      if (h.qaActivity > 5)
        result.push({ id: `qa-${h.channelId}`, channelId: h.channelId, type: 'qa', message: `${ch.name} — high Q&A activity (${h.qaActivity}/min)`, time: 'now' });
      if (h.fillRate < 40)
        result.push({ id: `low-${h.channelId}`, channelId: h.channelId, type: 'low', message: `${ch.name} below 40% attendance`, time: 'now' });
    });

    sessions.filter((s) => s.status === 'live').forEach((s) => {
      const ch = CHANNELS.find((c) => c.id === s.channelId);
      if (ch)
        result.push({ id: `live-${s.id}`, channelId: s.channelId, type: 'live', message: `${ch.name}: "${s.title}" is live`, time: 'ongoing' });
    });

    return result.slice(0, 8);
  }, [health, sessions]);

  const typeConfig = {
    capacity: { color: 'var(--live)',     icon: '⚠', label: 'High Capacity' },
    qa:       { color: '#a78bfa',          icon: '💬', label: 'Q&A Spike' },
    low:      { color: 'var(--upcoming)', icon: '↓',  label: 'Low Attendance' },
    live:     { color: '#22c55e',          icon: '●',  label: 'On Air' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {alerts.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: 12, padding: '16px 0', textAlign: 'center' }}>All channels healthy</div>
      )}
      {alerts.map((alert) => {
        const ch = CHANNELS.find((c) => c.id === alert.channelId);
        const cfg = typeConfig[alert.type];
        return (
          <div key={alert.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 12px',
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ color: cfg.color, fontSize: 14, flexShrink: 0 }}>{cfg.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--text-primary)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {alert.message}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 1 }}>{cfg.label}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              {ch && <div style={{ width: 6, height: 6, borderRadius: '50%', background: ch.color }} />}
              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{alert.time}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
