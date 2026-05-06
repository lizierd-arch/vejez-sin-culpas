import { useState } from 'react';
import { Button } from '../shared/Button';
import { requestPermission, scheduleLocalReminder } from '../../services/notifications';

export function Step3Reminder({ petName, onFinish }) {
  const [time, setTime] = useState('08:00');
  const [permState, setPermState] = useState('idle'); // idle | granted | denied | unsupported

  async function handleEnable() {
    const perm = await requestPermission();
    setPermState(perm);
    if (perm === 'granted') scheduleLocalReminder(time);
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6 h-full">
      <div className="text-center pt-4">
        <div className="text-5xl mb-3">🔔</div>
        <h1 className="font-serif text-2xl text-warm-dark mb-1">Recordatorio diario</h1>
        <p className="text-sm text-warm-light">
          ¿A qué hora quieres que te recordemos hacer el protocolo con <strong>{petName}</strong>?
        </p>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col items-center gap-3 p-6 bg-surface-warm rounded-2xl border border-border">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="text-4xl font-serif font-bold text-terracotta bg-transparent border-none outline-none text-center cursor-pointer"
          />
          <p className="text-xs text-warm-light">Toca para cambiar la hora</p>
        </div>

        {permState === 'idle' && (
          <Button variant="secondary" onClick={handleEnable}>
            🔔 Activar recordatorio
          </Button>
        )}
        {permState === 'granted' && (
          <div className="flex items-center gap-2 p-3 bg-sage-pale rounded-xl border border-sage text-sm text-sage-dark font-semibold">
            <span>✓</span> Recordatorio activado para las {time}
          </div>
        )}
        {permState === 'denied' && (
          <div className="p-3 bg-cream-dark rounded-xl border border-border text-sm text-warm-light">
            Las notificaciones están bloqueadas. Puedes activarlas desde la configuración del navegador.
          </div>
        )}
        {permState === 'unsupported' && (
          <div className="p-3 bg-cream-dark rounded-xl border border-border text-sm text-warm-light">
            Tu dispositivo no soporta notificaciones. ¡De todas formas puedes usar la app!
          </div>
        )}

        <p className="text-xs text-warm-pale text-center">Puedes cambiar esto más adelante en la configuración</p>
      </div>

      <Button onClick={() => onFinish(time, permState === 'granted')}>
        ¡Empezar el protocolo!
      </Button>
    </div>
  );
}
