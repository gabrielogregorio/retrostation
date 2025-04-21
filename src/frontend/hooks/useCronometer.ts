import { useState, useRef, useCallback } from 'react';

const ONE_SECONDS_IN_MS = 1000;

export const useStopwatch = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, ONE_SECONDS_IN_MS);
    }
  }, [isRunning]);

  const pause = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    pause();
    setElapsedTime(0);
  }, [pause]);

  return {
    elapsedSeconds: elapsedTime,
    isRunning,
    start,
    pause,
    reset,
  };
};
