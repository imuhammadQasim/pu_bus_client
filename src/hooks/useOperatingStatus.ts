import { useState, useEffect, useCallback } from 'react';
import { OPERATING_HOURS } from '@/data/routeData';

export interface OperatingStatus {
  isOperating: boolean;
  isWeekend: boolean;
  currentBatch: string | null;
  nextBatch: {
    key: string;
    batch: { start: number; end: number; label: string };
    tomorrow?: boolean;
    nextMonday?: boolean;
  } | null;
}

export function useOperatingStatus() {
  const [status, setStatus] = useState<OperatingStatus>({
    isOperating: false,
    isWeekend: false,
    currentBatch: null,
    nextBatch: null,
  });

  const getCurrentBatch = useCallback(() => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    // 0 is Sunday, 6 is Saturday
    if (day === 0 || day === 6) {
      return null;
    }

    for (const [key, batch] of Object.entries(OPERATING_HOURS)) {
      if (hour >= batch.start && hour < batch.end) {
        return key;
      }
    }
    return null;
  }, []);

  const getNextBatch = useCallback(() => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    const batches = Object.entries(OPERATING_HOURS).sort(
      (a, b) => a[1].start - b[1].start
    );

    // If it's Saturday or Sunday
    if (day === 6 || day === 0) {
      return {
        key: batches[0][0],
        batch: batches[0][1],
        nextMonday: true,
      };
    }

    for (const [key, batch] of batches) {
      if (hour < batch.start) {
        return { key, batch };
      }
    }

    // After last batch of the day
    return {
      key: batches[0][0],
      batch: batches[0][1],
      tomorrow: day === 5 ? false : true, // If Friday, tomorrow is Saturday (handled by nextMonday logic usually but let's be explicit)
      nextMonday: day === 5 ? true : false,
    };
  }, []);

  const updateStatus = useCallback(() => {
    const now = new Date();
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;
    
    const currentBatch = getCurrentBatch();
    const isOperating = !isWeekend && currentBatch !== null;
    const nextBatch = !isOperating ? getNextBatch() : null;

    setStatus({
      isOperating,
      isWeekend,
      currentBatch,
      nextBatch,
    });
  }, [getCurrentBatch, getNextBatch]);

  useEffect(() => {
    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, [updateStatus]);

  return status;
}
