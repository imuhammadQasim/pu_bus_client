import { useState, useEffect, useCallback } from 'react';
import { OPERATING_HOURS } from '@/data/routeData';

export interface OperatingStatus {
  isOperating: boolean;
  currentBatch: string | null;
  nextBatch: {
    key: string;
    batch: { start: number; end: number; label: string };
    tomorrow?: boolean;
  } | null;
}

export function useOperatingStatus() {
  const [status, setStatus] = useState<OperatingStatus>({
    isOperating: false,
    currentBatch: null,
    nextBatch: null,
  });

  const getCurrentBatch = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();

    for (const [key, batch] of Object.entries(OPERATING_HOURS)) {
      if (hour >= batch.start && hour < batch.end) {
        return key;
      }
    }
    return null;
  }, []);

  const getNextBatch = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();

    const batches = Object.entries(OPERATING_HOURS).sort(
      (a, b) => a[1].start - b[1].start
    );

    for (const [key, batch] of batches) {
      if (hour < batch.start) {
        return { key, batch };
      }
    }

    return {
      key: batches[0][0],
      batch: batches[0][1],
      tomorrow: true,
    };
  }, []);

  const updateStatus = useCallback(() => {
    const currentBatch = getCurrentBatch();
    const isOperating = currentBatch !== null;
    const nextBatch = !isOperating ? getNextBatch() : null;

    setStatus({
      isOperating,
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
