import { useState } from 'react';
import { Button } from './shared/Button';
import { TextInput } from './shared/TextInput';
import { MoodPicker } from './shared/MoodPicker';

export function DiaDificil({ profile, onBack }) {
  const [howWasPet, setHowWasPet] = useState('');
  const [feeling, setFeeling] = useState('');
  const [mood, setMood] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const entry = {
      obs1: howWasPet,
      obs2: feeling,
      mood,
      activityType: '',
      activityReaction: '',
      reg1: '', reg2: '', reg3: '',
      question: '',
      questionAnswer: '',
      mode: 'día-difícil',
    };
    const historyKey = `vsc_history_${profile.id}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    history.unshift({ ...entry, date: new Date().toISOString() });
    localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 90)));
    setSaving(false);
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center gap-6 min-h-[60vh] text-center">
        <div className="text-5xl">🌧️</div>
        <div>
          <h2 className="font-serif text-xl text-warm-dark mb-2">Registrado con cariño</h2>
          <p className="text-warm-light text-sm leading-relaxed max-w-xs mx-auto">
            Los días difíciles también cuentan. Estar ahí para <strong>{profile.name}</strong>,
            incluso cuando es duro, es un acto de amor enorme.
          </p>
        </div>
        <Button onClick={onBack}>Volver al inicio</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6 pb-8">
      <div className="text-center pt-4">
        <div className="text-4xl mb-3">🌧️</div>
        <h1 className="font-serif text-2xl text-warm-dark mb-1">Día Difícil</h1>
        <p className="text-sm text-warm-light leading-relaxed max-w-xs mx-auto">
          No siempre podemos dar lo mejor. Dos preguntas simples, sin presión.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <TextInput
          label={`¿Cómo estuvo ${profile.name} hoy?`}
          value={howWasPet}
          onChange={setHowWasPet}
          placeholder="Unas palabras son suficientes..."
          multiline
          rows={3}
        />
        <TextInput
          label="¿Qué sientes en este momento?"
          value={feeling}
          onChange={setFeeling}
          placeholder="Sin filtros. Esto es solo tuyo."
          multiline
          rows={3}
        />
        <MoodPicker value={mood} onChange={setMood} />
      </div>

      <div className="p-4 bg-terracotta-pale rounded-2xl border border-terracotta/20 text-sm text-warm-mid leading-relaxed">
        💛 Cuidar a una mascota mayor tiene momentos muy exigentes. El solo hecho de que estés aquí
        muestra cuánto amor le tienes.
      </div>

      <Button onClick={handleSave} disabled={!howWasPet.trim() || saving} variant="secondary">
        {saving ? 'Guardando...' : 'Guardar y descansar'}
      </Button>
      <button onClick={onBack} className="text-sm text-warm-light text-center py-2 active:opacity-70">
        Volver sin guardar
      </button>
    </div>
  );
}
