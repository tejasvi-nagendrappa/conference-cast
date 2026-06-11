import { Chip } from '@progress/kendo-react-buttons';
import { useAppStore } from '../../store/useAppStore';
import type { Track } from '../../types';

const TRACKS: { value: Track; label: string; color: string }[] = [
  { value: 'react',       label: '⚛ React',  color: '#61dafb' },
  { value: 'js',          label: '⬡ JS',     color: '#f7df1e' },
  { value: 'devops',      label: '🚀 DevOps', color: '#ff6b6b' },
  { value: 'ux',          label: '🎨 UX',    color: '#a78bfa' },
  { value: 'performance', label: '⚡ Perf',  color: '#34d399' },
  { value: 'ai',          label: '🤖 AI',    color: '#fb923c' },
];

export const TrackFilterBar = () => {
  const activeFilters = useAppStore((s) => s.activeTrackFilters);
  const toggle = useAppStore((s) => s.toggleTrackFilter);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '7px 12px',
      background: 'var(--bg-base)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
      flexWrap: 'wrap',
    }}>
      <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginRight: 2 }}>
        Topics
      </span>
      {TRACKS.map(({ value, label, color }) => {
        const active = activeFilters.includes(value);
        return (
          <Chip
            key={value}
            text={label}
            selected={active}
            onClick={() => toggle(value)}
            style={{
              '--kendo-chip-bg': active ? color + '22' : 'transparent',
              '--kendo-chip-border': active ? color + '88' : 'var(--border-strong)',
              '--kendo-chip-text': active ? color : 'var(--text-muted)',
              background: active ? color + '18' : 'transparent',
              border: `1px solid ${active ? color + '88' : 'var(--border-strong)'}`,
              color: active ? color : 'var(--text-muted)',
              fontWeight: active ? 600 : 400,
              fontSize: 11,
              cursor: 'pointer',
              transition: 'all 0.15s',
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
};
