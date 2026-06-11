import { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CHANNELS } from '../../data/channels';
import { StatusBadge } from '../shared/StatusBadge';
import { TrackBadge } from '../shared/TrackBadge';
import { format } from 'date-fns';
import type { Session } from '../../types';

interface Props {
  onSelectSession: (session: Session) => void;
}

export const ChannelGuide = ({ onSelectSession }: Props) => {
  const sessions = useAppStore((s) => s.sessions);
  const activeSessionId = useAppStore((s) => s.activeSessionId);
  const activeFilters = useAppStore((s) => s.activeTrackFilters);

  const filteredSessions = useMemo(
    () => sessions.filter((s) => activeFilters.includes(s.track)),
    [sessions, activeFilters]
  );

  const sessionsByChannel = (channelId: string) =>
    filteredSessions
      .filter((s) => s.channelId === channelId)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {CHANNELS.map((channel) => {
        const channelSessions = sessionsByChannel(channel.id);
        if (channelSessions.length === 0) return null;

        return (
          <div key={channel.id} style={{ display: 'flex', alignItems: 'stretch', minHeight: 76 }}>
            {/* Channel label */}
            <div style={{
              width: 120,
              minWidth: 120,
              background: '#1a1a2e',
              borderLeft: `3px solid ${channel.color}`,
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 3,
            }}>
              <span style={{ color: channel.color, fontWeight: 700, fontSize: 11 }}>CH {channel.number}</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 12 }}>{channel.name}</span>
              <span style={{ color: '#64748b', fontSize: 10 }}>{channel.room}</span>
            </div>

            {/* Sessions */}
            <div style={{ flex: 1, display: 'flex', gap: 2, minWidth: 0 }}>
              {channelSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session)}
                  style={{
                    flex: 1,
                    background: activeSessionId === session.id ? '#1e3a5f' : '#16213e',
                    border: `1px solid ${activeSessionId === session.id ? channel.color : '#2d3748'}`,
                    borderRadius: 4,
                    padding: '8px 10px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, background 0.15s',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 4,
                    minWidth: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                    <span style={{ color: '#f1f5f9', fontSize: 12, fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {session.title}
                    </span>
                    <StatusBadge status={session.status} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <img src={session.speaker.avatar} alt={session.speaker.name} style={{ width: 18, height: 18, borderRadius: '50%' }} />
                      <span style={{ color: '#94a3b8', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{session.speaker.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <TrackBadge track={session.track} />
                      <span style={{ color: '#64748b', fontSize: 10, whiteSpace: 'nowrap' }}>{format(session.startTime, 'HH:mm')}</span>
                      {session.status === 'live' && (
                        <span style={{ color: '#94a3b8', fontSize: 10, whiteSpace: 'nowrap' }}>👥 {session.viewerCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
