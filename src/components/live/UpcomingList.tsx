import { useMemo } from 'react';
import { format } from 'date-fns';
import { useAppStore } from '../../store/useAppStore';
import { CHANNELS } from '../../data/channels';
import { TrackBadge } from '../shared/TrackBadge';
import { useAIRecommendation } from '../../hooks/useAIRecommendation';
import { useCountdown } from '../../hooks/useCountdown';
import type { Session } from '../../types';

const UpcomingCard = ({ session, onSelect }: { session: Session; onSelect: () => void }) => {
  const channel = CHANNELS.find((c) => c.id === session.channelId);
  const rec = useAIRecommendation(session);
  const countdown = useCountdown(session.startTime);

  return (
    <div
      onClick={onSelect}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderLeft: `4px solid ${channel?.color ?? 'var(--border)'}`,
        borderRadius: 8,
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface)'; }}
    >
      {/* Channel badge */}
      <div style={{
        minWidth: 42,
        height: 42,
        background: (channel?.color ?? 'var(--accent)') + '18',
        border: `1px solid ${channel?.color ?? 'var(--accent)'}44`,
        borderRadius: 7,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ color: channel?.color, fontSize: 9, fontWeight: 700 }}>CH</span>
        <span style={{ color: channel?.color, fontSize: 14, fontWeight: 800, lineHeight: 1 }}>{channel?.number}</span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.35 }}>
          {session.title}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
          <img src={session.speaker.avatar} alt="" style={{ width: 16, height: 16, borderRadius: '50%' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}>{session.speaker.name}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{session.speaker.company}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrackBadge track={session.track} />
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{session.level}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0, minWidth: 70 }}>
        <span style={{ color: 'var(--upcoming)', fontSize: 12, fontWeight: 700 }}>
          {format(session.startTime, 'HH:mm')}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: 10, whiteSpace: 'nowrap' }}>{countdown}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: rec.color + '14', padding: '3px 6px', borderRadius: 4 }}>
          <span style={{ fontSize: 10, color: rec.color, fontWeight: 700 }}>✦ {rec.score}%</span>
        </div>
      </div>
    </div>
  );
};

interface Props {
  onSelectSession: (session: Session) => void;
  search?: string;
}

export const UpcomingList = ({ onSelectSession, search = '' }: Props) => {
  const sessions = useAppStore((s) => s.sessions);
  const activeFilters = useAppStore((s) => s.activeTrackFilters);

  const groups = useMemo(() => {
    const q = search.toLowerCase();
    const upcoming = sessions.filter((s) =>
      s.status === 'upcoming' &&
      activeFilters.includes(s.track) &&
      (!q || s.title.toLowerCase().includes(q) || s.speaker.name.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q)))
    );
    const map = new Map<string, Session[]>();
    upcoming.forEach((s) => {
      const key = format(s.startTime, 'HH:mm');
      const existing = map.get(key) ?? [];
      map.set(key, [...existing, s]);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [sessions, activeFilters, search]);

  if (groups.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
        No upcoming sessions match your filters.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {groups.map(([time, groupSessions]) => (
        <div key={time}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ color: 'var(--upcoming)', fontSize: 13, fontWeight: 700 }}>◷ {time}</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{groupSessions.length} session{groupSessions.length > 1 ? 's' : ''}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {groupSessions.map((s) => (
              <UpcomingCard key={s.id} session={s} onSelect={() => onSelectSession(s)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
