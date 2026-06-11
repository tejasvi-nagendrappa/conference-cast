import { useAppStore } from '../../store/useAppStore';
import { CHANNELS } from '../../data/channels';
import { StatusBadge } from '../shared/StatusBadge';
import { TrackBadge } from '../shared/TrackBadge';
import { QAPanel } from './QAPanel';
import { format } from 'date-fns';

export const SessionPlayer = () => {
  const sessions = useAppStore((s) => s.sessions);
  const activeSessionId = useAppStore((s) => s.activeSessionId);
  const session = sessions.find((s) => s.id === activeSessionId);

  if (!session) return null;

  const channel = CHANNELS.find((c) => c.id === session.channelId);
  const fillRate = Math.round((session.viewerCount / session.capacity) * 100);
  const fillColor = fillRate > 80 ? 'var(--live)' : '#22c55e';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Video */}
      <div style={{ position: 'relative', background: '#000', aspectRatio: '16/9', width: '100%', flexShrink: 0 }}>
        <iframe
          src="https://www.youtube.com/embed/T-slCsOrLcc?controls=1&modestbranding=1"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {session.status === 'live' && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: 'var(--live)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3, letterSpacing: 1 }}>
            ● LIVE
          </div>
        )}
        {channel && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.75)', color: channel.color, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3 }}>
            CH {channel.number}
          </div>
        )}
      </div>

      {/* Session info */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 13, fontWeight: 700, lineHeight: 1.35 }}>
            {session.title}
          </h2>
          <StatusBadge status={session.status} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <img src={session.speaker.avatar} alt={session.speaker.name} style={{ width: 24, height: 24, borderRadius: '50%' }} />
            <div>
              <div style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}>{session.speaker.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{session.speaker.company}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <TrackBadge track={session.track} />
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{format(session.startTime, 'HH:mm')}–{format(session.endTime, 'HH:mm')}</span>
          </div>
        </div>

        {session.status === 'live' && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>👥 {session.viewerCount} watching</span>
            <div style={{ flex: 1, height: 3, background: 'var(--border)', borderRadius: 2 }}>
              <div style={{ width: `${fillRate}%`, height: '100%', background: fillColor, borderRadius: 2, transition: 'width 0.5s' }} />
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{fillRate}%</span>
          </div>
        )}
      </div>

      {/* Q&A */}
      <div style={{ flex: 1, padding: '12px 14px', overflow: 'hidden', minHeight: 0 }}>
        <QAPanel sessionId={session.id} />
      </div>
    </div>
  );
};
