import { useCallback, useRef, useState } from 'react';
import { usePersonalLineup } from '../../hooks/usePersonalLineup';
import { useAppStore } from '../../store/useAppStore';
import { CHANNELS } from '../../data/channels';
import { useAIRecommendation } from '../../hooks/useAIRecommendation';
import type { Session } from '../../types';

const LineupCard = ({ session, isActive, onSelect }: { session: Session; isActive: boolean; onSelect: () => void }) => {
  const channel = CHANNELS.find((c) => c.id === session.channelId);
  const rec = useAIRecommendation(session);
  const isLive = session.status === 'live';

  return (
    <div
      onClick={onSelect}
      style={{
        minWidth: 180,
        maxWidth: 180,
        background: isActive ? `linear-gradient(135deg, ${channel?.color ?? 'var(--accent)'}22, var(--bg-elevated))` : 'var(--bg-surface)',
        border: `1px solid ${isActive ? (channel?.color ?? 'var(--accent)') : 'var(--border)'}`,
        borderTop: `3px solid ${channel?.color ?? 'var(--border)'}`,
        borderRadius: 8,
        padding: '10px 11px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s, transform 0.12s',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flexShrink: 0,
        transform: isActive ? 'translateY(-2px)' : 'none',
        boxShadow: isActive ? `0 4px 12px ${channel?.color ?? 'var(--accent)'}33` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: channel?.color ?? 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}>
          CH {channel?.number}
        </span>
        {isLive ? (
          <span style={{ color: 'var(--live)', fontSize: 9, fontWeight: 700, letterSpacing: 0.5 }}>● LIVE</span>
        ) : (
          <span style={{ color: 'var(--upcoming)', fontSize: 9, fontWeight: 600 }}>◷ NEXT</span>
        )}
      </div>

      <div style={{ color: 'var(--text-primary)', fontSize: 11, fontWeight: 600, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: 30 }}>
        {session.title}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 'auto' }}>
        <img src={session.speaker.avatar} alt="" style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0 }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {session.speaker.name}
        </span>
      </div>

      {/* AI match score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingTop: 5, borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: 9, color: rec.color, fontWeight: 700 }}>✦ AI</span>
        <span style={{ fontSize: 10, color: rec.color, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{rec.score}%</span>
        <span style={{ fontSize: 9, color: rec.color, marginLeft: 'auto' }}>{rec.label}</span>
      </div>
    </div>
  );
};

interface Props {
  onSelectSession: (session: Session) => void;
}

const SCROLL_AMOUNT = 380;

const ArrowBtn = ({ dir, onClick, disabled }: { dir: 'left' | 'right'; onClick: () => void; disabled: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      flexShrink: 0,
      width: 30,
      height: 30,
      borderRadius: '50%',
      border: '1px solid var(--border-strong)',
      background: disabled ? 'transparent' : 'var(--bg-elevated)',
      color: disabled ? 'var(--border-strong)' : 'var(--text-secondary)',
      cursor: disabled ? 'default' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      lineHeight: 1,
      transition: 'background 0.15s, color 0.15s',
    }}
  >
    {dir === 'left' ? '‹' : '›'}
  </button>
);

export const HorizontalLineup = ({ onSelectSession }: Props) => {
  const lineup = usePersonalLineup();
  const activeSessionId = useAppStore((s) => s.activeSessionId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);

  const handleSelect = useCallback(
    (session: Session) => onSelectSession(session),
    [onSelectSession]
  );

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: 'smooth' });
  };

  const onScroll = () => {
    if (scrollRef.current) setScrollPos(scrollRef.current.scrollLeft);
  };

  if (lineup.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        No sessions match your filters. Enable more topics.
      </div>
    );
  }

  const atStart = scrollPos <= 4;
  const atEnd = scrollRef.current
    ? scrollPos >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 4
    : false;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <ArrowBtn dir="left" onClick={() => scroll('left')} disabled={atStart} />
      <div
        ref={scrollRef}
        onScroll={onScroll}
        style={{ display: 'flex', gap: 8, overflowX: 'auto', flex: 1, scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: 2 }}
      >
        {lineup.map((session) => (
          <LineupCard
            key={session.id}
            session={session}
            isActive={activeSessionId === session.id}
            onSelect={() => handleSelect(session)}
          />
        ))}
      </div>
      <ArrowBtn dir="right" onClick={() => scroll('right')} disabled={atEnd} />
    </div>
  );
};
