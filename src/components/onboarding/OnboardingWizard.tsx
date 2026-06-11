import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import { useAppStore } from '../../store/useAppStore';
import type { Track, SessionLevel, AttendeeProfile } from '../../types';

const TRACKS: { value: Track; label: string; emoji: string }[] = [
  { value: 'react', label: 'React', emoji: '⚛️' },
  { value: 'js', label: 'JavaScript', emoji: '🟨' },
  { value: 'devops', label: 'DevOps', emoji: '🚀' },
  { value: 'ux', label: 'UX & Design', emoji: '🎨' },
  { value: 'performance', label: 'Performance', emoji: '⚡' },
  { value: 'ai', label: 'AI', emoji: '🤖' },
];

const LEVELS: { value: SessionLevel; label: string; desc: string }[] = [
  { value: 'beginner', label: 'Beginner', desc: 'New to the topic' },
  { value: 'intermediate', label: 'Intermediate', desc: '1–3 years experience' },
  { value: 'advanced', label: 'Advanced', desc: 'Deep expertise' },
];

export const OnboardingWizard = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [level, setLevel] = useState<SessionLevel>('intermediate');
  const setProfile = useAppStore((s) => s.setProfile);
  const navigate = useNavigate();

  const toggleTrack = (t: Track) =>
    setSelectedTracks((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const finish = () => {
    const profile: AttendeeProfile = {
      name: name || 'Attendee',
      role: role || 'Developer',
      tracks: selectedTracks.length ? selectedTracks : ['react', 'js'],
      level,
    };
    setProfile(profile);
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 480,
        background: '#16213e',
        border: '1px solid #2d3748',
        borderRadius: 12,
        padding: 40,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📺</div>
          <h1 style={{ margin: 0, color: '#f1f5f9', fontSize: 24, fontWeight: 800 }}>ConferenceCast</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13 }}>
            Your personal broadcast channel for tech events
          </p>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28, justifyContent: 'center' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              height: 4, width: 48, borderRadius: 2,
              background: i <= step ? '#3b82f6' : '#2d3748',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>

        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: 18 }}>Who are you?</h2>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 6 }}>Your name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tejasvi"
                style={{ width: '100%', background: '#1a1a2e', border: '1px solid #374151', borderRadius: 6, padding: '10px 12px', color: '#f1f5f9', fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 6 }}>Your role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Engineer"
                style={{ width: '100%', background: '#1a1a2e', border: '1px solid #374151', borderRadius: 6, padding: '10px 12px', color: '#f1f5f9', fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <Button themeColor="primary" onClick={() => setStep(1)} style={{ marginTop: 8 }}>
              Continue →
            </Button>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: 18 }}>What do you care about?</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>Select all that apply</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {TRACKS.map((t) => {
                const active = selectedTracks.includes(t.value);
                return (
                  <div
                    key={t.value}
                    onClick={() => toggleTrack(t.value)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `1px solid ${active ? '#3b82f6' : '#2d3748'}`,
                      background: active ? '#1e3a5f' : '#1a1a2e',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.15s',
                    }}
                  >
                    <span>{t.emoji}</span>
                    <span style={{ color: '#f1f5f9', fontSize: 13, fontWeight: active ? 600 : 400 }}>{t.label}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button onClick={() => setStep(0)} style={{ flex: 1 }}>← Back</Button>
              <Button themeColor="primary" onClick={() => setStep(2)} style={{ flex: 2 }}>Continue →</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: 18 }}>Your experience level</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {LEVELS.map((l) => (
                <div
                  key={l.value}
                  onClick={() => setLevel(l.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: `1px solid ${level === l.value ? '#3b82f6' : '#2d3748'}`,
                    background: level === l.value ? '#1e3a5f' : '#1a1a2e',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14 }}>{l.label}</div>
                  <div style={{ color: '#64748b', fontSize: 12 }}>{l.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</Button>
              <Button themeColor="primary" onClick={finish} style={{ flex: 2 }}>
                🎬 Build My Lineup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
