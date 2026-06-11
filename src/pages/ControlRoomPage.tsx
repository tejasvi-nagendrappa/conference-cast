import { useSimulatedViewership } from '../hooks/useSimulatedViewership';
import { ViewershipChart } from '../components/controlroom/ViewershipChart';
import { ChannelHealthTable } from '../components/controlroom/ChannelHealthTable';
import { LiveAlertsFeed } from '../components/controlroom/LiveAlertsFeed';
import { useAppStore } from '../store/useAppStore';
import { CHANNELS } from '../data/channels';
import { Link } from 'react-router-dom';

const KPI = ({ label, value, color, sub }: { label: string; value: string | number; color: string; sub?: string }) => (
  <div style={{
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  }}>
    <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</span>
    <span style={{ color, fontSize: 28, fontWeight: 800, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{value}</span>
    {sub && <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{sub}</span>}
  </div>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</span>
    </div>
    <div style={{ padding: '14px 16px' }}>{children}</div>
  </div>
);

export const ControlRoomPage = () => {
  useSimulatedViewership();

  const sessions = useAppStore((s) => s.sessions);
  const channelHealth = useAppStore((s) => s.channelHealth);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  const liveSessions = sessions.filter((s) => s.status === 'live');
  const totalViewers = liveSessions.reduce((sum, s) => sum + s.viewerCount, 0);
  const avgFill = channelHealth.length
    ? Math.round(channelHealth.reduce((sum, h) => sum + h.fillRate, 0) / channelHealth.length)
    : 0;
  const totalQA = channelHealth.reduce((s, h) => s + h.qaActivity, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>

      {/* Topbar */}
      <div style={{
        height: 52,
        minHeight: 52,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>📡</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: 15 }}>Control Room</span>
          <span style={{ color: 'var(--border-strong)', fontSize: 18 }}>|</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>React Summit 2026</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--live)', fontSize: 11, fontWeight: 700, letterSpacing: 1, background: 'color-mix(in srgb, var(--live) 12%, transparent)', padding: '3px 8px', borderRadius: 4 }}>
            ● BROADCASTING LIVE
          </span>
          <button
            onClick={toggleTheme}
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 6, color: 'var(--text-secondary)', fontSize: 15, padding: '4px 8px', cursor: 'pointer', lineHeight: 1 }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link to="/" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 6, color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, padding: '5px 12px', textDecoration: 'none' }}>
            ← Attendee View
          </Link>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <KPI label="Live Channels"  value={liveSessions.length}        color="var(--live)"     sub="of 5 total" />
          <KPI label="Total Viewers"  value={totalViewers.toLocaleString()} color="#22c55e"       sub="across all rooms" />
          <KPI label="Avg Capacity"   value={`${avgFill}%`}              color="var(--upcoming)" sub="room fill rate" />
          <KPI label="Q&A Activity"   value={totalQA}                    color="#a78bfa"          sub="questions / min" />
        </div>

        {/* Channel tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {CHANNELS.map((ch) => {
            const h = channelHealth.find((x) => x.channelId === ch.id);
            const session = liveSessions.find((s) => s.channelId === ch.id);
            const fill = h?.fillRate ?? 0;
            const fillColor = fill > 85 ? 'var(--live)' : fill > 60 ? 'var(--upcoming)' : '#22c55e';

            return (
              <div key={ch.id} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderTop: `3px solid ${ch.color}`,
                borderRadius: 10,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: ch.color, fontWeight: 700, fontSize: 11 }}>CH {ch.number}</span>
                  {session && <span style={{ color: 'var(--live)', fontSize: 9, fontWeight: 700, letterSpacing: 0.8 }}>● LIVE</span>}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}>{ch.name}</div>
                <div style={{ color: 'var(--text-primary)', fontSize: 12, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {session?.title ?? <span style={{ color: 'var(--text-muted)' }}>No active session</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
                    👥 {h?.viewerCount ?? 0}
                  </span>
                  <span style={{ color: fillColor, fontSize: 11, fontWeight: 600 }}>{fill}%</span>
                </div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }}>
                  <div style={{ width: `${fill}%`, height: '100%', background: fillColor, borderRadius: 2, transition: 'width 0.5s' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart + Alerts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
          <SectionCard title="📈 Live Viewership — All Channels">
            <ViewershipChart />
          </SectionCard>
          <SectionCard title="🔔 Live Alerts">
            <div style={{ margin: '-14px -16px' }}>
              <LiveAlertsFeed />
            </div>
          </SectionCard>
        </div>

        {/* Channel health table */}
        <SectionCard title="📊 Channel Health">
          <div style={{ margin: '-14px -16px' }}>
            <ChannelHealthTable />
          </div>
        </SectionCard>

      </div>
    </div>
  );
};
