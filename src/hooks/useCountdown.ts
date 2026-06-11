import { useState, useEffect } from 'react';

export const useCountdown = (targetTime: Date): string => {
  const getLabel = () => {
    const diffMs = targetTime.getTime() - Date.now();
    if (diffMs <= 0) return 'Starting now';
    const mins = Math.floor(diffMs / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const m = mins % 60;
      return `in ${hrs}h ${m}m`;
    }
    if (mins > 0) return `in ${mins}m ${secs}s`;
    return `in ${secs}s`;
  };

  const [label, setLabel] = useState(getLabel);

  useEffect(() => {
    const id = setInterval(() => setLabel(getLabel()), 1000);
    return () => clearInterval(id);
  }, [targetTime]);

  return label;
};
