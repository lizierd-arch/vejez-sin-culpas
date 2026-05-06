import { useState } from 'react';
import { CountdownTimer } from '../shared/CountdownTimer';
import { TextInput } from '../shared/TextInput';
import { Button } from '../shared/Button';

const ACTIVITY_TYPES = [
  {
    id: 'Mental',
    icon: '🧠',
    title: 'Mental',
    desc: 'Juego de olfato, esconder premios, explorar olores nuevos',
    color: 'border-terracotta bg-terracotta-pale',
  },
  {
    id: 'Física',
    icon: '🌿',
    title: 'Física',
    desc: 'Caminata suave, estiramientos, masajes, baño de sol',
    color: 'border-sage bg-sage-pale',
  },
  {
    id: 'Conexión',
    icon: '❤️',
    title: 'Conexión',
    desc: 'Caricias, contacto visual, hablarle, estar juntos en silencio',
    color: 'border-peach bg-surface-warm',
  },
];

export function Step2Activity({ petName, onNext }) {
  const [activityType, setActivityType] = useState('');
  const [activityReaction, setActivityReaction] = useState('');

  return (
    <div className="animate-fade-in flex flex-col gap-5">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-sage-pale text-sage-dark text-sm font-hand font-semibold px-3 py-1 rounded-full mb-3">
          <span>Paso 2 de 3</span>
        </div>
        <h2 className="font-serif text-xl text-warm-dark">🌿 Actividad</h2>
        <p className="text-sm text-warm-light mt-1">
          Elige una actividad adaptada para <strong>{petName}</strong>
        </p>
      </div>

      <div className="flex justify-center">
        <CountdownTimer seconds={300} />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-warm-light">Tipo de actividad</p>
        {ACTIVITY_TYPES.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setActivityType(a.id)}
            className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all active:scale-95 ${
              activityType === a.id ? a.color + ' shadow-warm' : 'border-border bg-surface-warm hover:border-terracotta-light'
            }`}
          >
            <span className="text-2xl mt-0.5">{a.icon}</span>
            <div>
              <p className="font-semibold text-warm-dark text-sm">{a.title}</p>
              <p className="text-xs text-warm-light leading-relaxed mt-0.5">{a.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <TextInput
        label={`¿Cómo reaccionó ${petName}?`}
        value={activityReaction}
        onChange={setActivityReaction}
        placeholder="Describe su respuesta, entusiasmo, comodidad..."
        multiline
        rows={2}
      />

      <Button
        onClick={() => onNext({ activityType, activityReaction })}
        disabled={!activityType || !activityReaction.trim()}
      >
        Continuar a Registro →
      </Button>
    </div>
  );
}
