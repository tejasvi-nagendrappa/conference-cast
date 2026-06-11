import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Track, SessionLevel } from '../../types';

const TRACKS: { value: Track; label: string; color: string }[] = [
  { value: 'react',       label: '⚛ React',       color: '#61dafb' },
  { value: 'js',          label: '⬡ JavaScript',  color: '#f7df1e' },
  { value: 'devops',      label: '🚀 DevOps',      color: '#ff6b6b' },
  { value: 'ux',          label: '🎨 UX & Design', color: '#a78bfa' },
  { value: 'performance', label: '⚡ Performance', color: '#34d399' },
  { value: 'ai',          label: '🤖 AI',          color: '#fb923c' },
];

const LEVELS: { value: SessionLevel; label: string }[] = [
  { value: 'beginner',     label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced',     label: 'Advanced' },
];

interface Props { onClose: () => void; }

export const PersonalizeDrawer = ({ onClose }: Props) => {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);

  const [name, setName] = useState(profile?.name ?? '');
  const [role, setRole] = useState(profile?.role ?? '');
  const [tracks, setTracks] = useState<Track[]>(profile?.tracks ?? []);
  const [level, setLevel] = useState<SessionLevel>(profile?.level ?? 'intermediate');

  const toggleTrack = (t: Track) =>
    setTracks((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const save = () => {
    setProfile({ name: name || 'Attendee', role: role || 'Developer', tracks: tracks.length ? tracks : TRACKS.map(t => t.value), level });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 320,
        height: '100vh',
        background: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border)',
        zIndex: 101,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 15 }}>Personalise</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>Tune your lineup</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Name */}
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 6, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
              />
            </div>

            {/* Role */}
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Engineer"
                style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 6, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
              />
            </div>

            {/* Topics */}
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>Interested Topics</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {TRACKS.map(({ value, label, color }) => {
                  const active = tracks.includes(value);
                  return (
                    <button
                      key={value}
                      onClick={() => toggleTrack(value)}
                      style={{
                        background: active ? color + '22' : 'var(--bg-elevated)',
                        border: `1px solid ${active ? color : 'var(--border-strong)'}`,
                        borderRadius: 20,
                        color: active ? color : 'var(--text-muted)',
                        fontSize: 12,
                        fontWeight: active ? 600 : 400,
                        padding: '4px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level */}
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>Experience Level</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {LEVELS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setLevel(value)}
                    style={{
                      flex: 1,
                      background: level === value ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                      border: `1px solid ${level === value ? 'var(--accent)' : 'var(--border-strong)'}`,
                      borderRadius: 6,
                      color: level === value ? 'var(--accent)' : 'var(--text-muted)',
                      fontSize: 12,
                      fontWeight: level === value ? 600 : 400,
                      padding: '7px 4px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={save}
            style={{ width: '100%', background: 'var(--accent)', border: 'none', borderRadius: 7, color: '#fff', fontSize: 13, fontWeight: 700, padding: '10px', cursor: 'pointer' }}
          >
            Save & Update Lineup
          </button>
        </div>
      </div>
    </>
  );
};
