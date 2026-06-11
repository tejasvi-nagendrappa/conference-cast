export type Track = 'react' | 'js' | 'devops' | 'ux' | 'performance' | 'ai';

export type SessionLevel = 'beginner' | 'intermediate' | 'advanced';

export type SessionStatus = 'upcoming' | 'live' | 'ended';

export interface Speaker {
  id: string;
  name: string;
  avatar: string;
  company: string;
  bio: string;
}

export interface Channel {
  id: string;
  number: number;
  name: string;
  room: string;
  color: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  speaker: Speaker;
  channelId: string;
  track: Track;
  level: SessionLevel;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  tags: string[];
  viewerCount: number;
  capacity: number;
}

export interface QAMessage {
  id: string;
  sessionId: string;
  attendeeName: string;
  question: string;
  votes: number;
  timestamp: Date;
  answered: boolean;
}

export interface AttendeeProfile {
  name: string;
  role: string;
  tracks: Track[];
  level: SessionLevel;
}

export interface ViewershipDataPoint {
  time: Date;
  channelId: string;
  count: number;
}

export interface ChannelHealth {
  channelId: string;
  viewerCount: number;
  fillRate: number;
  qaActivity: number;
  trend: 'up' | 'down' | 'stable';
}
