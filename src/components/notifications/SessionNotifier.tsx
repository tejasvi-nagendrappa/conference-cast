import { useEffect, useRef, useState } from 'react';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { useAppStore } from '../../store/useAppStore';

interface Toast {
  id: number;
  message: string;
}

export const SessionNotifier = () => {
  const sessions = useAppStore((s) => s.sessions);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notifiedRef = useRef<Set<string>>(new Set());
  const counterRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      sessions.forEach((s) => {
        if (s.status !== 'upcoming') return;
        const msUntil = s.startTime.getTime() - now;
        const key = `${s.id}-2min`;
        if (msUntil > 0 && msUntil <= 2 * 60 * 1000 && !notifiedRef.current.has(key)) {
          notifiedRef.current.add(key);
          const id = ++counterRef.current;
          setToasts((prev) => [...prev, { id, message: `⚡ "${s.title}" starts in 2 min!` }]);
          setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
        }
      });
    }, 10_000);
    return () => clearInterval(interval);
  }, [sessions]);

  if (toasts.length === 0) return null;

  return (
    <NotificationGroup style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map((t) => (
        <Notification
          key={t.id}
          type={{ style: 'info', icon: true }}
          closable
          onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
        >
          <span style={{ fontSize: 13, fontWeight: 600 }}>{t.message}</span>
        </Notification>
      ))}
    </NotificationGroup>
  );
};
