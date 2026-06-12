import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CHANNELS } from '../../data/channels';
import { TrackBadge } from '../shared/TrackBadge';
import { useAIRecommendation } from '../../hooks/useAIRecommendation';
import { QAPanel } from '../player/QAPanel';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import type { Session } from '../../types';

const ExpandedPlayer = ({ session, onClose }: { session: Session; onClose: () => void }) => {
  const channel = CHANNELS.find((c) => c.id === session.channelId);
  const fillRate = Math.round((session.viewerCount / session.capacity) * 100);
  const fillColor = fillRate > 80 ? 'var(--live)' : '#22c55e';
  const rec = useAIRecommendation(session);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [session.id]);

  return (
    <div ref={ref} style={{
      gridColumn: '1 / -1',
      background: 'var(--bg-surface)',
      border: `1px solid ${channel?.color ?? 'var(--border)'}`,
      borderRadius: 10,
      overflow: 'hidden',
      animation: 'slideDown 0.2s ease',
    }}>
      <style>{`@keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <div className="expanded-player-layout">
        {/* Video */}
        <div className="expanded-video-pane" style={{ position: 'relative', background: '#000' }}>
          <iframe
            src={`https://www.youtube.com/embed/${session.videoId ?? 'T-slCsOrLcc'}?controls=1&modestbranding=1&autoplay=1`}
            style={{ width: '100%', height: '100%', minHeight: 220, border: 'none', display: 'block' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {session.status === 'live' && (
            <div style={{ position: 'absolute', top: 10, left: 10, background: 'var(--live)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 3, letterSpacing: 1 }}>
              ● LIVE
            </div>
          )}
          {channel && (
            <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.8)', color: channel.color, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 3 }}>
              CH {channel.number} · {channel.name}
            </div>
          )}
        </div>

        {/* Info + Q&A */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 280, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
              <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 14, fontWeight: 700, lineHeight: 1.35, flex: 1 }}>
                {session.title}
              </h2>
              <button
                onClick={onClose}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 2px', flexShrink: 0 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <img src={session.speaker.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />
              <div>
                <div style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}>{session.speaker.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{session.speaker.company}</div>
              </div>
              <TrackBadge track={session.track} />
            </div>

            {/* Viewer bar */}
            {session.status === 'live' && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>👥 {session.viewerCount.toLocaleString()}</span>
                <div style={{ flex: 1, height: 3, background: 'var(--border)', borderRadius: 2 }}>
                  <div style={{ width: `${fillRate}%`, height: '100%', background: fillColor, borderRadius: 2, transition: 'width 0.5s' }} />
                </div>
                <span style={{ color: fillColor, fontSize: 10, fontWeight: 600 }}>{fillRate}%</span>
              </div>
            )}

            {/* AI reason */}
            <div style={{ marginTop: 8, padding: '5px 8px', background: rec.color + '18', border: `1px solid ${rec.color}33`, borderRadius: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, color: rec.color, fontWeight: 700 }}>✦ AI {rec.score}% — {rec.label}</span>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{rec.why}</span>
            </div>
          </div>

          {/* Q&A */}
          <div style={{ flex: 1, overflow: 'hidden', padding: '10px 14px' }}>
            <QAPanel sessionId={session.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SessionCard = ({ session, isActive, onSelect, isTrending }: { session: Session; isActive: boolean; onSelect: () => void; isTrending: boolean }) => {
  const channel = CHANNELS.find((c) => c.id === session.channelId);
  const rec = useAIRecommendation(session);
  const fillRate = Math.round((session.viewerCount / session.capacity) * 100);

  return (
    <div
      onClick={onSelect}
      style={{
        background: isActive ? `linear-gradient(135deg, ${channel?.color ?? 'var(--accent)'}22, var(--bg-elevated))` : 'var(--bg-surface)',
        border: `1px solid ${isActive ? (channel?.color ?? 'var(--accent)') : 'var(--border)'}`,
        borderLeft: `4px solid ${channel?.color ?? 'var(--border)'}`,
        borderRadius: 8,
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        boxShadow: isActive ? `0 2px 12px ${channel?.color ?? 'var(--accent)'}22` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: channel?.color, fontSize: 10, fontWeight: 700 }}>CH {channel?.number} · {channel?.name}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isTrending && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', background: '#f59e0b18', border: '1px solid #f59e0b44', borderRadius: 4, padding: '1px 6px' }}>
              🔥 Trending
            </span>
          )}
          <span style={{ color: 'var(--live)', fontSize: 10, fontWeight: 700 }}>● LIVE</span>
        </div>
      </div>

      <div style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>
        {session.title}
      </div>

      <div style={{ color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {session.description}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
        <img src={session.speaker.avatar} alt="" style={{ width: 20, height: 20, borderRadius: '50%' }} />
        <span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}>{session.speaker.name}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{session.speaker.company}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <TrackBadge track={session.track} />
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginLeft: 'auto' }}>
          👥 {session.viewerCount.toLocaleString()}
        </span>
        <div style={{ width: 70 }}>
          <ProgressBar
            value={fillRate}
            style={{ height: 4 }}
            progressStyle={{ background: fillRate > 80 ? 'var(--live)' : '#22c55e', transition: 'width 0.5s' }}
          />
        </div>
        <span style={{ fontSize: 10, color: fillRate > 80 ? 'var(--live)' : '#22c55e', fontWeight: 600, minWidth: 28 }}>{fillRate}%</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', background: rec.color + '14', borderRadius: 5 }}>
        <span style={{ fontSize: 10, color: rec.color, fontWeight: 700 }}>✦ {rec.score}%</span>
        <span style={{ fontSize: 10, color: rec.color }}>{rec.label}</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>▶ Watch</span>
      </div>
    </div>
  );
};

interface Props {
  onSelectSession: (session: Session) => void;
  search?: string;
}

export const LiveGrid = ({ onSelectSession, search = '' }: Props) => {
  const sessions = useAppStore((s) => s.sessions);
  const activeFilters = useAppStore((s) => s.activeTrackFilters);
  const activeSessionId = useAppStore((s) => s.activeSessionId);
  const setActiveSession = useAppStore((s) => s.setActiveSession);

  const q = search.toLowerCase();
  const liveSessions = sessions.filter((s) =>
    s.status === 'live' &&
    activeFilters.includes(s.track) &&
    (!q || s.title.toLowerCase().includes(q) || s.speaker.name.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q)))
  );
  const activeSession = sessions.find((s) => s.id === activeSessionId && s.status === 'live');
  const trendingId = liveSessions.reduce((top, s) => s.viewerCount > (top?.viewerCount ?? 0) ? s : top, liveSessions[0])?.id;

  const handleSelect = (session: Session) => {
    if (activeSessionId === session.id) {
      setActiveSession(null);
    } else {
      setActiveSession(session.id);
      onSelectSession(session);
    }
  };

  if (liveSessions.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
        No live sessions match your filters.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
      {liveSessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          isActive={activeSessionId === session.id}
          isTrending={session.id === trendingId}
          onSelect={() => handleSelect(session)}
        />
      ))}
      {activeSession && (
        <ExpandedPlayer
          key={`expanded-${activeSession.id}`}
          session={activeSession}
          onClose={() => setActiveSession(null)}
        />
      )}
    </div>
  );
};
