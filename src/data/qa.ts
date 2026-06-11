import type { QAMessage } from '../types';

export const INITIAL_QA: QAMessage[] = [
  { id: 'q1', sessionId: 's1', attendeeName: 'Alex K.', question: 'How do RSCs handle authentication at the edge?', votes: 14, timestamp: new Date(), answered: false },
  { id: 'q2', sessionId: 's1', attendeeName: 'Priya M.', question: 'What\'s the migration path from pages to app router for large codebases?', votes: 9, timestamp: new Date(), answered: false },
  { id: 'q3', sessionId: 's1', attendeeName: 'Tom R.', question: 'Can you share the repo for the demo?', votes: 6, timestamp: new Date(), answered: true },
  { id: 'q4', sessionId: 's2', attendeeName: 'Chen L.', question: 'Will Vite 6 support module federation natively?', votes: 11, timestamp: new Date(), answered: false },
  { id: 'q5', sessionId: 's2', attendeeName: 'Maria S.', question: 'How does Turbopack compare to Rspack in real benchmarks?', votes: 8, timestamp: new Date(), answered: false },
];
