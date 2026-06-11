import { usePersonalLineup } from '../../hooks/usePersonalLineup';
import { useAppStore } from '../../store/useAppStore';
import { CHANNELS } from '../../data/channels';
import { StatusBadge } from '../shared/StatusBadge';
import { TrackBadge } from '../shared/TrackBadge';
import { format } from 'date-fns';
import type { Session } from '../../types';

interface Props { onSelectSession: (session: Session) => void; }

export const PersonalLineup = ({ onSelectSession }: Props) => {
  const lineup = usePersonalLineup();
  const activeSessionId = useAppStore((s) => s.activeSessionId);

  if (lineup.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: '24px 12px', lineHeight: 1.6 }}>
        No sessions match your filters.<br />Try enabling more topics.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lineup.map((session) => {
        const channel = CHANNELS.find((c) => c.id === session.channelId);
        const isActive = activeSessionId === session.id;

        return (
          <div
            key={session.id}
            onClick={() => onSelectSession(session)}
            style={{
              background: isActive ? 'var(--bg-hover)' : 'var(--bg-surface)',
              border: `1px solid ${isActive ? (channel?.color ?? 'var(--accent)') : 'var(--border)'}`,
              borderRadius: 7,
              padding: '8px 10px',
              cursor: 'pointer',
              transition: 'border-color 0.15s, background 0.15s',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
            }}
          >
            {channel && (
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 5,
                background: channel.color + '18',
                border: `1px solid ${channel.color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: channel.color,
                fontSize: 10,
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {channel.number}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600, lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {session.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                <TrackBadge track={session.track} />
                <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{format(session.startTime, 'HH:mm')}</span>
                <StatusBadge status={session.status} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
