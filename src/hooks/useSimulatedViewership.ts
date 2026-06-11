import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useSimulatedViewership = () => {
  const tick = useAppStore((s) => s.tickViewership);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 3000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [tick]);
};
