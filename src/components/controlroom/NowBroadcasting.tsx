import { useAppStore } from '../../store/useAppStore';
import { CHANNELS } from '../../data/channels';

export const NowBroadcasting = () => {
  const sessions = useAppStore((s) => s.sessions);
  const channelHealth = useAppStore((s) => s.channelHealth);

  return (
    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
        .live-dot { animation: livePulse 1.4s ease-in-out infinite; }
      `}</style>

      {CHANNELS.map((ch) => {
        const session = sessions.find((s) => s.channelId === ch.id && s.status === 'live');
        const health = channelHealth.find((h) => h.channelId === ch.id);
        const fill = health?.fillRate ?? 0;
        const fillColor = fill > 85 ? 'var(--live)' : fill > 60 ? 'var(--upcoming)' : '#22c55e';
        const isLive = !!session;

        return (
          <div key={ch.id} style={{
            flex: '1 0 160px',
            minWidth: 160,
            background: 'var(--bg-surface)',
            border: `1px solid ${isLive ? ch.color + '55' : 'var(--border)'}`,
            borderTop: `3px solid ${ch.color}`,
            borderRadius: 10,
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: ch.color, fontWeight: 800, fontSize: 11 }}>CH {ch.number}</span>
              {isLive
                ? <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div className="live-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--live)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--live)', fontSize: 10, fontWeight: 700 }}>LIVE</span>
                  </div>
                : <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>IDLE</span>
              }
            </div>

            {/* Speaker */}
            {session ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={session.speaker.avatar}
                      alt=""
                      style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${ch.color}` }}
                    />
                    <div className="live-dot" style={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'var(--live)', border: '1.5px solid var(--bg-surface)',
                    }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: 'var(--text-primary)', fontSize: 11, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session.speaker.name}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session.speaker.company}
                    </div>
                  </div>
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {session.title}
                </div>

                {/* Viewer bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>👥 {health?.viewerCount.toLocaleString()}</span>
                    <span style={{ color: fillColor, fontSize: 10, fontWeight: 700 }}>{fill}%</span>
                  </div>
                  <div style={{ height: 3, background: 'var(--border)', borderRadius: 2 }}>
                    <div style={{ width: `${fill}%`, height: '100%', background: fillColor, borderRadius: 2, transition: 'width 0.5s' }} />
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: 11, flex: 1, display: 'flex', alignItems: 'center' }}>
                {ch.name} — no active session
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
