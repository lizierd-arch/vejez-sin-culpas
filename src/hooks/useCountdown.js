import { useState, useEffect, useRef, useCallback } from 'react';

export function useCountdown(seconds) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    setRunning(true);
    setDone(false);
  }, []);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    setRunning(false);
    setDone(false);
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setDone(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const progress = 1 - remaining / seconds;

  return { remaining, display, progress, running, done, start, pause, reset };
}
