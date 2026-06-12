import { useSimulatedViewership } from '../hooks/useSimulatedViewership';
import { ViewershipChart } from '../components/controlroom/ViewershipChart';
import { ChannelHealthTable } from '../components/controlroom/ChannelHealthTable';
import { LiveAlertsFeed } from '../components/controlroom/LiveAlertsFeed';
import { NowBroadcasting } from '../components/controlroom/NowBroadcasting';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';

const KPI = ({ label, value, color, sub, trend }: { label: string; value: string | number; color: string; sub?: string; trend?: 'up' | 'down' | 'stable' }) => {
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : null;
  const trendColor = trend === 'up' ? '#22c55e' : trend === 'down' ? 'var(--live)' : undefined;
  return (
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
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ color, fontSize: 28, fontWeight: 800, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{value}</span>
        {trendIcon && <span style={{ color: trendColor, fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{trendIcon}</span>}
      </div>
      {sub && <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{sub}</span>}
    </div>
  );
};

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

  const viewershipHistory = useAppStore((s) => s.viewershipHistory);

  const liveSessions = sessions.filter((s) => s.status === 'live');
  const totalViewers = liveSessions.reduce((sum, s) => sum + s.viewerCount, 0);
  const avgFill = channelHealth.length
    ? Math.round(channelHealth.reduce((sum, h) => sum + h.fillRate, 0) / channelHealth.length)
    : 0;
  const totalQA = channelHealth.reduce((s, h) => s + h.qaActivity, 0);

  const viewerTrend = (() => {
    if (viewershipHistory.length < 4) return 'stable' as const;
    const recent = viewershipHistory.slice(-4);
    const older = (recent[0].ch1 + recent[0].ch2 + recent[0].ch3 + recent[0].ch4 + recent[0].ch5);
    const latest = (recent[3].ch1 + recent[3].ch2 + recent[3].ch3 + recent[3].ch4 + recent[3].ch5);
    if (latest > older + 30) return 'up' as const;
    if (latest < older - 30) return 'down' as const;
    return 'stable' as const;
  })();

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
        <div className="cr-kpi-grid">
          <KPI label="Live Channels"  value={liveSessions.length}           color="var(--live)"     sub="of 5 total" />
          <KPI label="Total Viewers"  value={totalViewers.toLocaleString()} color="#22c55e"         sub="across all rooms" trend={viewerTrend} />
          <KPI label="Avg Capacity"   value={`${avgFill}%`}               color="var(--upcoming)" sub="room fill rate" trend={avgFill > 75 ? 'up' : 'stable'} />
          <KPI label="Q&A Activity"   value={totalQA}                     color="#a78bfa"          sub="questions / min" trend={totalQA > 15 ? 'up' : 'stable'} />
        </div>

        {/* Now Broadcasting */}
        <SectionCard title="📺 Now Broadcasting">
          <div style={{ margin: '-14px -16px', padding: '14px 16px' }}>
            <NowBroadcasting />
          </div>
        </SectionCard>

        {/* Chart + Alerts */}
        <div className="cr-chart-grid">
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
