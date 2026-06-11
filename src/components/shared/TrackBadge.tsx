import type { Track } from '../../types';

const TRACK_COLORS: Record<Track, string> = {
  react: '#61dafb',
  js: '#f7df1e',
  devops: '#ff6b6b',
  ux: '#a78bfa',
  performance: '#34d399',
  ai: '#fb923c',
};

interface Props {
  track: Track;
}

export const TrackBadge = ({ track }: Props) => (
  <span style={{
    background: TRACK_COLORS[track] + '22',
    color: TRACK_COLORS[track],
    border: `1px solid ${TRACK_COLORS[track]}44`,
    borderRadius: 4,
    padding: '2px 8px',
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }}>
    {track}
  </span>
);
