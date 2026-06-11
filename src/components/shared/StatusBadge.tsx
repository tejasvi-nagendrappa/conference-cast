import type { SessionStatus } from '../../types';

interface Props { status: SessionStatus; }

const config: Record<SessionStatus, { label: string; color: string }> = {
  live:     { label: '● LIVE',     color: 'var(--live)' },
  upcoming: { label: '◷ UPCOMING', color: 'var(--upcoming)' },
  ended:    { label: '✓ ENDED',    color: 'var(--ended)' },
};

export const StatusBadge = ({ status }: Props) => {
  const { label, color } = config[status];
  return (
    <span style={{ color, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
};
