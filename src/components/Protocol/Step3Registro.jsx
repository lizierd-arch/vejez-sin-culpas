import { useState } from 'react';
import { CountdownTimer } from '../shared/CountdownTimer';
import { TextInput } from '../shared/TextInput';
import { Button } from '../shared/Button';

const QUESTIONS = [
  '¿Qué momento de hoy con {nombre} quiero recordar?',
  '¿Qué me enseñó {nombre} hoy sobre el presente?',
  '¿Cómo me siento después de este protocolo?',
];

export function Step3Registro({ petName, onComplete }) {
  const [reg1, setReg1] = useState('');
  const [reg2, setReg2] = useState('');
  const [reg3, setReg3] = useState('');

  const setters = [setReg1, setReg2, setReg3];
  const values = [reg1, reg2, reg3];
  const valid = reg1.trim().length > 0;

  return (
    <div className="animate-fade-in flex flex-col gap-5">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-peach text-warm-mid text-sm font-hand font-semibold px-3 py-1 rounded-full mb-3">
          <span>Paso 3 de 3</span>
        </div>
        <h2 className="font-serif text-xl text-warm-dark">📓 Registro consciente</h2>
        <p className="text-sm text-warm-light mt-1">Tu diario de amor con {petName}</p>
      </div>

      <div className="flex justify-center">
        <CountdownTimer seconds={420} />
      </div>

      <div className="flex flex-col gap-4">
        {QUESTIONS.map((q, i) => (
          <TextInput
            key={i}
            label={q.replace(/\{nombre\}/g, petName)}
            value={values[i]}
            onChange={setters[i]}
            placeholder="Escribe libremente..."
            multiline
            rows={2}
          />
        ))}
      </div>

      <Button onClick={() => onComplete({ reg1, reg2, reg3 })} disabled={!valid}>
        ✓ Completar protocolo del día
      </Button>
    </div>
  );
}
