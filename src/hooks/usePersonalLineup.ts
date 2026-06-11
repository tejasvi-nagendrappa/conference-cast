import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Session } from '../types';

export const usePersonalLineup = (): Session[] => {
  const profile = useAppStore((s) => s.profile);
  const sessions = useAppStore((s) => s.sessions);
  const activeFilters = useAppStore((s) => s.activeTrackFilters);

  return useMemo(() => {
    if (!profile) return [];
    return sessions
      .filter((s) => activeFilters.includes(s.track))
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }, [profile, sessions, activeFilters]);
};
