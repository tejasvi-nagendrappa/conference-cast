import { useMemo, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CHANNELS } from '../../data/channels';
import { TrackBadge } from '../shared/TrackBadge';
import type { Session } from '../../types';

const START_HOUR = 9;
const END_HOUR = 13;
const PX_PER_MIN = 3.5;
const LABEL_WIDTH = 130;
const ROW_HEIGHT = 88;
const HEADER_HEIGHT = 36;
const TOTAL_MINS = (END_HOUR - START_HOUR) * 60;
const TIMELINE_WIDTH = TOTAL_MINS * PX_PER_MIN;

const timeToX = (date: Date) =>
  (date.getHours() * 60 + date.getMinutes() - START_HOUR * 60) * PX_PER_MIN;

const nowX = () => {
  const now = new Date();
  const x = timeToX(now);
  return Math.max(0, Math.min(TIMELINE_WIDTH, x));
};

const timeLabels = () => {
  const labels = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    labels.push({ label: `${h.toString().padStart(2, '0')}:00`, x: (h - START_HOUR) * 60 * PX_PER_MIN });
  }
  return labels;
};

interface Props {
  onSelectSession: (session: Session) => void;
}

export const EPGTimeline = ({ onSelectSession }: Props) => {
  const sessions = useAppStore((s) => s.sessions);
  const activeFilters = useAppStore((s) => s.activeTrackFilters);
  const activeSessionId = useAppStore((s) => s.activeSessionId);
  const nowLineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => sessions.filter((s) => activeFilters.includes(s.track)),
    [sessions, activeFilters]
  );

  // Scroll to NOW on mount
  useEffect(() => {
    const x = nowX();
    if (containerRef.current) {
      containerRef.current.scrollLeft = Math.max(0, x - 120);
    }
  }, []);

  const nx = nowX();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', minHeight: 0 }}>
      <div ref={containerRef} style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
        <div style={{ display: 'flex', minWidth: LABEL_WIDTH + TIMELINE_WIDTH }}>

          {/* Left labels column */}
          <div style={{ width: LABEL_WIDTH, minWidth: LABEL_WIDTH, flexShrink: 0, position: 'sticky', left: 0, zIndex: 10, background: 'var(--bg-base)' }}>
            {/* Corner */}
            <div style={{ height: HEADER_HEIGHT, borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', background: 'var(--bg-surface)' }} />
            {/* Channel labels */}
            {CHANNELS.map((ch) => (
              <div key={ch.id} style={{
                height: ROW_HEIGHT,
                borderBottom: '1px solid var(--border)',
                borderRight: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 14px',
                gap: 3,
              }}>
                <div style={{ color: ch.color, fontSize: 11, fontWeight: 700 }}>CH {ch.number}</div>
                <div style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}>{ch.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{ch.room}</div>
              </div>
            ))}
          </div>

          {/* Timeline area */}
          <div style={{ flex: 1, position: 'relative', minWidth: TIMELINE_WIDTH }}>
            {/* Time header */}
            <div style={{ height: HEADER_HEIGHT, position: 'relative', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
              {timeLabels().map(({ label, x }) => (
                <div key={label} style={{ position: 'absolute', left: x, top: 0, height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: 'var(--border)' }} />
                </div>
              ))}
            </div>

            {/* Channel rows */}
            {CHANNELS.map((ch) => {
              const chSessions = filtered.filter((s) => s.channelId === ch.id);
              return (
                <div key={ch.id} style={{ height: ROW_HEIGHT, position: 'relative', borderBottom: '1px solid var(--border)', background: 'var(--bg-base)' }}>
                  {/* Hour grid lines */}
                  {timeLabels().map(({ x }, i) => (
                    <div key={i} style={{ position: 'absolute', left: x, top: 0, bottom: 0, width: 1, background: 'var(--border)', opacity: 0.4 }} />
                  ))}

                  {/* Session blocks */}
                  {chSessions.map((session) => {
                    const x = timeToX(session.startTime);
                    const w = Math.max(80, (session.endTime.getTime() - session.startTime.getTime()) / 60000 * PX_PER_MIN - 3);
                    const isActive = activeSessionId === session.id;
                    const isLive = session.status === 'live';
                    const isEnded = session.status === 'ended';

                    return (
                      <div
                        key={session.id}
                        onClick={() => !isEnded && onSelectSession(session)}
                        style={{
                          position: 'absolute',
                          left: x + 2,
                          top: 6,
                          width: w,
                          height: ROW_HEIGHT - 14,
                          background: isEnded
                            ? 'transparent'
                            : isActive
                              ? `linear-gradient(135deg, ${ch.color}33, ${ch.color}18)`
                              : isLive
                                ? 'var(--bg-elevated)'
                                : 'var(--bg-surface)',
                          border: `1px solid ${isEnded ? 'var(--border)' : isActive ? ch.color : isLive ? ch.color + '55' : 'var(--border-strong)'}`,
                          borderLeft: `3px solid ${isEnded ? 'var(--border)' : ch.color}`,
                          borderRadius: 6,
                          padding: '6px 9px',
                          cursor: isEnded ? 'default' : 'pointer',
                          overflow: 'hidden',
                          opacity: isEnded ? 0.4 : 1,
                          transition: 'border-color 0.15s, background 0.15s',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 3,
                          boxShadow: isActive ? `0 0 0 1px ${ch.color}44` : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                          {isLive && (
                            <span style={{ color: 'var(--live)', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, flexShrink: 0 }}>● LIVE</span>
                          )}
                          {isEnded && (
                            <span style={{ color: 'var(--ended)', fontSize: 9, fontWeight: 600, flexShrink: 0 }}>ENDED</span>
                          )}
                          <span style={{ color: 'var(--text-muted)', fontSize: 10, flexShrink: 0 }}>
                            {session.startTime.getHours().toString().padStart(2,'0')}:{session.startTime.getMinutes().toString().padStart(2,'0')}
                          </span>
                        </div>
                        <div style={{ color: isEnded ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: 12, fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {session.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 'auto' }}>
                          <img src={session.speaker.avatar} style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0, filter: isEnded ? 'grayscale(1)' : 'none' }} alt="" />
                          <span style={{ color: 'var(--text-muted)', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.speaker.name}</span>
                          {!isEnded && <TrackBadge track={session.track} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* NOW line */}
            {nx > 0 && nx < TIMELINE_WIDTH && (
              <div
                ref={nowLineRef}
                style={{ position: 'absolute', left: nx, top: 0, bottom: 0, width: 2, background: 'var(--live)', zIndex: 5, pointerEvents: 'none' }}
              >
                <div style={{ position: 'absolute', top: -HEADER_HEIGHT, left: '50%', transform: 'translateX(-50%)', background: 'var(--live)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 3, whiteSpace: 'nowrap' }}>
                  NOW
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
