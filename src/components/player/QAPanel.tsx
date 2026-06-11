import { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';

interface Props { sessionId: string; }

export const QAPanel = ({ sessionId }: Props) => {
  const [question, setQuestion] = useState('');
  const allMessages = useAppStore((s) => s.qaMessages);
  const addQAMessage = useAppStore((s) => s.addQAMessage);
  const upvote = useAppStore((s) => s.upvoteQuestion);

  const sorted = useMemo(
    () => [...allMessages.filter((q) => q.sessionId === sessionId)].sort((a, b) => b.votes - a.votes),
    [allMessages, sessionId]
  );

  const handleSubmit = () => {
    if (!question.trim()) return;
    addQAMessage({ sessionId, attendeeName: 'You', question: question.trim() });
    setQuestion('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 10 }}>
      <div style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
        Live Q&A · {sorted.length} questions
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>
            Be the first to ask a question
          </div>
        )}
        {sorted.map((q) => (
          <div key={q.id} style={{
            background: q.answered ? 'color-mix(in srgb, #22c55e 8%, var(--bg-elevated))' : 'var(--bg-elevated)',
            border: `1px solid ${q.answered ? '#22c55e33' : 'var(--border)'}`,
            borderRadius: 7,
            padding: '9px 11px',
          }}>
            <div style={{ color: 'var(--text-primary)', fontSize: 12, marginBottom: 6, lineHeight: 1.4 }}>{q.question}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{q.attendeeName}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {q.answered && <span style={{ color: '#22c55e', fontSize: 10, fontWeight: 600 }}>✓ Answered</span>}
                <button
                  onClick={() => upvote(q.id)}
                  style={{ background: 'transparent', border: '1px solid var(--border-strong)', borderRadius: 4, color: 'var(--text-secondary)', fontSize: 10, padding: '2px 7px', cursor: 'pointer' }}
                >
                  ▲ {q.votes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Ask a question..."
          style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 6, padding: '7px 11px', color: 'var(--text-primary)', fontSize: 12, outline: 'none' }}
        />
        <button
          onClick={handleSubmit}
          style={{ background: 'var(--accent)', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 600, padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Ask
        </button>
      </div>
    </div>
  );
};
