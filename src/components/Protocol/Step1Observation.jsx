import { useState } from 'react';
import { CountdownTimer } from '../shared/CountdownTimer';
import { MoodPicker } from '../shared/MoodPicker';
import { TextInput } from '../shared/TextInput';
import { Button } from '../shared/Button';

export function Step1Observation({ petName, onNext }) {
  const [obs1, setObs1] = useState('');
  const [obs2, setObs2] = useState('');
  const [mood, setMood] = useState('');
  const [timerDone, setTimerDone] = useState(false);

  return (
    <div className="animate-fade-in flex flex-col gap-5">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-terracotta-pale text-terracotta text-sm font-hand font-semibold px-3 py-1 rounded-full mb-3">
          <span>Paso 1 de 3</span>
        </div>
        <h2 className="font-serif text-xl text-warm-dark">👁️ Observación</h2>
        <p className="text-sm text-warm-light mt-1">
          Observa a <strong>{petName}</strong> con presencia plena, sin distracciones.
        </p>
      </div>

      <div className="flex justify-center">
        <CountdownTimer seconds={180} onComplete={() => setTimerDone(true)} />
      </div>

      <div className="flex flex-col gap-4">
        <TextInput
          label={`¿Qué observas en ${petName} ahora mismo?`}
          value={obs1}
          onChange={setObs1}
          placeholder="Describe su postura, respiración, expresión..."
          multiline
          rows={2}
        />
        <TextInput
          label="¿Qué cambios notas respecto a ayer?"
          value={obs2}
          onChange={setObs2}
          placeholder="Movimiento, apetito, sociabilidad..."
          multiline
          rows={2}
        />
        <MoodPicker value={mood} onChange={setMood} />
      </div>

      <Button
        onClick={() => onNext({ obs1, obs2, mood })}
        disabled={!obs1.trim() || !mood}
      >
        Continuar a Actividad →
      </Button>
    </div>
  );
}
