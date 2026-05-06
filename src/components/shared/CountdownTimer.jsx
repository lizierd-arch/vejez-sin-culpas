import { useEffect } from 'react';
import { useCountdown } from '../../hooks/useCountdown';

export function CountdownTimer({ seconds, onComplete, autoStart = false }) {
  const { display, progress, running, done, start, pause } = useCountdown(seconds);

  useEffect(() => {
    if (autoStart) start();
  }, [autoStart]);

  useEffect(() => {
    if (done && onComplete) onComplete();
  }, [done]);

  const circumference = 2 * Math.PI * 54;
  const dash = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#E8D5C4" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            stroke="#C4714A" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dash}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-hand text-4xl font-semibold text-warm-dark tracking-wide">{display}</span>
        </div>
      </div>
      <button
        onClick={running ? pause : start}
        className="min-h-[48px] px-6 py-2 rounded-full bg-terracotta-pale text-terracotta font-semibold text-sm transition-all active:scale-95"
      >
        {done ? '✓ Completado' : running ? 'Pausar' : progress === 0 ? 'Iniciar' : 'Continuar'}
      </button>
    </div>
  );
}
