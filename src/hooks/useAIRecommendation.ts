import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Session, Track } from '../types';

const TRACK_REASONS: Record<Track, string[]> = {
  react:       ['matches your React interest', 'aligns with your frontend focus', 'relevant to your React expertise'],
  js:          ['matches your JavaScript track', 'relevant to your JS tooling interest', 'aligns with your JS expertise'],
  devops:      ['matches your DevOps interest', 'relevant to your deployment workflow', 'aligns with your ops background'],
  ux:          ['matches your UX interest', 'relevant to your design focus', 'aligns with your design expertise'],
  performance: ['matches your performance interest', 'relevant to your optimization goals', 'aligns with your perf focus'],
  ai:          ['matches your AI interest', 'highly relevant to your AI curiosity', 'top pick for your AI focus'],
};

const LEVEL_REASONS: Record<string, string> = {
  beginner:     'suited to your experience level',
  intermediate: 'matched to your skill level',
  advanced:     'challenging enough for your expertise',
};

export interface AIRecommendation {
  score: number;
  why: string;
  label: 'Top Pick' | 'Great Match' | 'Good Fit' | 'Explore';
  color: string;
}

export const useAIRecommendation = (session: Session): AIRecommendation => {
  const profile = useAppStore((s) => s.profile);

  return useMemo(() => {
    if (!profile) {
      return { score: 72, why: 'Personalise your profile for a tailored score', label: 'Explore', color: '#64748b' };
    }

    let score = 50;
    const reasons: string[] = [];

    // Track match
    if (profile.tracks.includes(session.track)) {
      score += 35;
      const trackReasons = TRACK_REASONS[session.track];
      reasons.push(trackReasons[session.id.charCodeAt(1) % trackReasons.length]);
    }

    // Level match
    const levelMap: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };
    const userLevel = levelMap[profile.level] ?? 1;
    const sessionLevel = levelMap[session.level] ?? 1;
    const levelDelta = Math.abs(userLevel - sessionLevel);
    if (levelDelta === 0) { score += 12; reasons.push(LEVEL_REASONS[session.level]); }
    else if (levelDelta === 1) { score += 5; }

    // Status bonus
    if (session.status === 'live') score += 3;

    // Popularity signal
    if (session.viewerCount > 200) { score += 2; }

    score = Math.min(99, Math.max(55, score));

    const why = reasons.length > 0
      ? reasons.slice(0, 2).join(' · ')
      : 'Broadens your knowledge outside your usual tracks';

    const label: AIRecommendation['label'] =
      score >= 90 ? 'Top Pick' :
      score >= 78 ? 'Great Match' :
      score >= 65 ? 'Good Fit' : 'Explore';

    const color =
      score >= 90 ? '#22c55e' :
      score >= 78 ? '#3b82f6' :
      score >= 65 ? '#a78bfa' : '#64748b';

    return { score, why, label, color };
  }, [session, profile]);
};
