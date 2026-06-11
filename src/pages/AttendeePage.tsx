import { useCallback, useState } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';

const BroadcastIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="13" r="2.5" fill="var(--live)" />
    <path d="M8.5 9.5a5 5 0 0 1 7 7" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <path d="M5.5 6.5a9 9 0 0 1 13 13" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5"/>
    <line x1="12" y1="15.5" x2="12" y2="20" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="9" y1="20" x2="15" y2="20" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
import { useAppStore } from '../store/useAppStore';
import { TrackFilterBar } from '../components/epg/TrackFilterBar';
import { HorizontalLineup } from '../components/lineup/HorizontalLineup';
import { LiveGrid } from '../components/live/LiveGrid';
import { UpcomingList } from '../components/live/UpcomingList';
import { EPGTimeline } from '../components/epg/EPGTimeline';
import { PersonalizeDrawer } from '../components/onboarding/PersonalizeDrawer';
import { useSimulatedViewership } from '../hooks/useSimulatedViewership';
import type { Session } from '../types';

type Tab = 'live' | 'upcoming' | 'guide';

export const AttendeePage = () => {
  useSimulatedViewership();

  const [tab, setTab] = useState<Tab>('live');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');

  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const profile = useAppStore((s) => s.profile);
  const sessions = useAppStore((s) => s.sessions);
  const setActiveSession = useAppStore((s) => s.setActiveSession);

  const liveCount = sessions.filter((s) => s.status === 'live').length;
  const upcomingCount = sessions.filter((s) => s.status === 'upcoming').length;

  const handleSelect = useCallback((session: Session) => {
    setActiveSession(session.id);
    if (session.status === 'live') setTab('live');
  }, [setActiveSession]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', overflow: 'hidden', color: 'var(--text-primary)' }}>

      {/* Topbar */}
      <div style={{
        height: 52,
        minHeight: 52,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        gap: 12,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <BroadcastIcon />
          <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: 15, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>ConferenceCast</span>
          <span className="topbar-subtitle" style={{ alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--border-strong)', fontSize: 18, lineHeight: 1 }}>|</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>React Summit 2026</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span className="topbar-on-air" style={{ color: 'var(--live)', fontSize: 11, fontWeight: 700, letterSpacing: 1, background: 'color-mix(in srgb, var(--live) 12%, transparent)', padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>
            ● ON AIR
          </span>

          <Button
            onClick={() => setDrawerOpen(true)}
            fillMode={profile ? 'outline' : 'flat'}
            themeColor={profile ? 'primary' : 'base'}
            size="small"
            style={{ fontWeight: 600, whiteSpace: 'nowrap', fontSize: 12 }}
          >
            ✦ {profile?.name ?? 'Personalise'}
          </Button>

          <button
            onClick={toggleTheme}
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 6, color: 'var(--text-secondary)', fontSize: 15, padding: '4px 8px', cursor: 'pointer', lineHeight: 1, flexShrink: 0 }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <a
            href="#/control-room"
            style={{ background: 'var(--accent)', borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 600, padding: '5px 10px', textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            🎬 <span className="topbar-control-room-label">Control Room</span>
          </a>
        </div>
      </div>

      {/* Track filters */}
      <TrackFilterBar />

      {/* Personal lineup strip */}
      <div style={{
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border)',
        padding: '10px 16px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>★ Your Lineup</span>
          {profile && (
            <span style={{ color: 'var(--accent)', fontSize: 10, fontWeight: 600 }}>✦ AI-personalised for {profile.name}</span>
          )}
        </div>
        <HorizontalLineup onSelectSession={handleSelect} />
      </div>

      {/* Tab bar */}
      <div style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 2,
        flexShrink: 0,
      }}>
        {([
          { id: 'live',     label: '● LIVE',     count: liveCount,     color: 'var(--live)' },
          { id: 'upcoming', label: '◷ UPCOMING', count: upcomingCount, color: 'var(--upcoming)' },
          { id: 'guide',    label: '📡 GUIDE',   count: null,          color: 'var(--accent)' },
        ] as const).map(({ id, label, count, color }) => {
          const isActive = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
                padding: '12px 16px 10px',
                cursor: 'pointer',
                color: isActive ? color : 'var(--text-muted)',
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'color 0.15s',
                letterSpacing: 0.3,
              }}
            >
              {label}
              {count !== null && (
                <span style={{
                  background: isActive ? color + '22' : 'var(--bg-elevated)',
                  color: isActive ? color : 'var(--text-muted)',
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  minWidth: 18,
                  textAlign: 'center',
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search bar — Kendo Input */}
      {tab !== 'guide' && (
        <div style={{ padding: '8px 16px', background: 'var(--bg-base)', borderBottom: '1px solid var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.value as string)}
            placeholder="🔍  Search sessions, speakers, topics…"
            style={{ maxWidth: 420, fontSize: 12 }}
          />
          {search && (
            <Button
              fillMode="flat"
              size="small"
              onClick={() => setSearch('')}
              style={{ color: 'var(--text-muted)', fontSize: 11 }}
            >
              ✕ Clear
            </Button>
          )}
        </div>
      )}

      {/* Tab content */}
      <div style={{ flex: 1, overflow: tab === 'guide' ? 'hidden' : 'auto', padding: tab === 'guide' ? 0 : '16px', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {tab === 'live' && <LiveGrid onSelectSession={handleSelect} search={search} />}
        {tab === 'upcoming' && <UpcomingList onSelectSession={handleSelect} search={search} />}
        {tab === 'guide' && (
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <EPGTimeline onSelectSession={(s) => { handleSelect(s); if (s.status === 'live') setTab('live'); }} />
          </div>
        )}
      </div>

      {drawerOpen && <PersonalizeDrawer onClose={() => setDrawerOpen(false)} />}
    </div>
  );
};
