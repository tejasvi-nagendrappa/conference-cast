import { create } from 'zustand';
import type { AttendeeProfile, Session, QAMessage, ChannelHealth, Track } from '../types';
import { SESSIONS } from '../data/sessions';
import { INITIAL_QA } from '../data/qa';
import { CHANNELS } from '../data/channels';

const PROFILE_KEY = 'cc_profile';

const loadProfile = (): AttendeeProfile | null => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as AttendeeProfile) : null;
  } catch {
    return null;
  }
};

const saveProfile = (profile: AttendeeProfile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

type Theme = 'dark' | 'light';

interface AppState {
  theme: Theme;
  profile: AttendeeProfile | null;
  activeTrackFilters: Track[];
  sessions: Session[];
  activeSessionId: string | null;
  qaMessages: QAMessage[];
  channelHealth: ChannelHealth[];
  viewershipHistory: { time: string; ch1: number; ch2: number; ch3: number; ch4: number; ch5: number }[];

  toggleTheme: () => void;
  setProfile: (profile: AttendeeProfile) => void;
  toggleTrackFilter: (track: Track) => void;
  setActiveSession: (id: string | null) => void;
  addQAMessage: (msg: Omit<QAMessage, 'id' | 'timestamp' | 'votes' | 'answered'>) => void;
  upvoteQuestion: (id: string) => void;
  tickViewership: () => void;
}

const buildChannelHealth = (sessions: Session[]): ChannelHealth[] =>
  CHANNELS.map((ch) => {
    const session = sessions.find((s) => s.channelId === ch.id && s.status === 'live');
    const viewerCount = session?.viewerCount ?? 0;
    const capacity = session?.capacity ?? 1;
    return {
      channelId: ch.id,
      viewerCount,
      fillRate: Math.round((viewerCount / capacity) * 100),
      qaActivity: Math.floor(Math.random() * 8),
      trend: 'stable' as const,
    };
  });

const ALL_TRACKS: Track[] = ['react', 'js', 'devops', 'ux', 'performance', 'ai'];

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

export const useAppStore = create<AppState>()((set) => {
  const initialTheme: Theme = (localStorage.getItem('cc_theme') as Theme) ?? 'dark';
  applyTheme(initialTheme);

  return {
  theme: initialTheme,
  profile: loadProfile(),
  activeTrackFilters: ALL_TRACKS,
  sessions: SESSIONS,
  activeSessionId: null,
  qaMessages: INITIAL_QA,
  channelHealth: buildChannelHealth(SESSIONS),
  viewershipHistory: [],

  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('cc_theme', next);
      applyTheme(next);
      return { theme: next };
    }),

  setProfile: (profile) => {
    saveProfile(profile);
    set({ profile, activeTrackFilters: profile.tracks.length ? profile.tracks : ALL_TRACKS });
  },

  toggleTrackFilter: (track) =>
    set((state) => {
      const active = state.activeTrackFilters;
      const next = active.includes(track)
        ? active.length > 1 ? active.filter((t) => t !== track) : ALL_TRACKS
        : [...active, track];
      return { activeTrackFilters: next };
    }),

  setActiveSession: (id) => set({ activeSessionId: id }),

  addQAMessage: (msg) =>
    set((state) => ({
      qaMessages: [
        ...state.qaMessages,
        { ...msg, id: `q${Date.now()}`, timestamp: new Date(), votes: 0, answered: false },
      ],
    })),

  upvoteQuestion: (id) =>
    set((state) => ({
      qaMessages: state.qaMessages.map((q) => (q.id === id ? { ...q, votes: q.votes + 1 } : q)),
    })),

  tickViewership: () =>
    set((state) => {
      const updatedSessions = state.sessions.map((s) => {
        if (s.status !== 'live') return s;
        const delta = Math.floor(Math.random() * 20) - 8;
        return { ...s, viewerCount: Math.max(50, Math.min(s.capacity, s.viewerCount + delta)) };
      });

      const snap = { time: new Date().toLocaleTimeString(), ch1: 0, ch2: 0, ch3: 0, ch4: 0, ch5: 0 };
      updatedSessions.filter((s) => s.status === 'live').forEach((s) => {
        const key = s.channelId as keyof typeof snap;
        if (key in snap) (snap as unknown as Record<string, number>)[key] = s.viewerCount;
      });

      return {
        sessions: updatedSessions,
        channelHealth: buildChannelHealth(updatedSessions),
        viewershipHistory: [...state.viewershipHistory.slice(-19), snap],
      };
    }),
  };
});
