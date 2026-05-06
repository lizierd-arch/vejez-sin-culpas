import { useState } from 'react';
import { Step1Observation } from './Step1Observation';
import { Step2Activity } from './Step2Activity';
import { Step3Registro } from './Step3Registro';
import { getTodayQuestion } from '../../data/questions';
import { appendEntry, isSignedIn } from '../../services/sheets';

function updateStreak(profileId) {
  const key = `vsc_streak_${profileId}`;
  const today = new Date().toDateString();
  const streak = JSON.parse(localStorage.getItem(key) || '{"count":0,"lastDate":null}');
  if (streak.lastDate === today) return streak;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const newCount = streak.lastDate === yesterday ? streak.count + 1 : 1;
  const updated = { count: newCount, lastDate: today };
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
}

export function Protocol({ profile, onComplete }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  function handleStep1(d) { setData((p) => ({ ...p, ...d })); setStep(2); }
  function handleStep2(d) { setData((p) => ({ ...p, ...d })); setStep(3); }

  async function handleStep3(d) {
    const full = { ...data, ...d, question: getTodayQuestion(profile.name), mode: 'normal' };
    setSaving(true);
    try {
      if (isSignedIn()) await appendEntry(profile, full);
    } catch (e) {
      console.error(e);
    }
    // Save locally per profile
    const historyKey = `vsc_history_${profile.id}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    history.unshift({ ...full, date: new Date().toISOString() });
    localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 90)));
    updateStreak(profile.id);
    setSaving(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center gap-6 min-h-[60vh] text-center">
        <div className="text-6xl animate-pulse-soft">🐾</div>
        <div>
          <h2 className="font-serif text-2xl text-warm-dark mb-2">¡Protocolo completado!</h2>
          <p className="text-warm-light text-sm leading-relaxed max-w-xs mx-auto">
            Gracias por estar presente con <strong>{profile.name}</strong> hoy.
            Cada día que haces esto, construyes un vínculo más profundo.
          </p>
        </div>
        <button
          onClick={onComplete}
          className="min-h-[48px] px-8 py-3 rounded-2xl bg-terracotta text-white font-semibold shadow-warm transition-all active:scale-95"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  if (saving) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[60vh]">
        <div className="text-4xl animate-pulse-soft">💾</div>
        <p className="text-warm-light text-sm">Guardando tu registro...</p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up flex flex-col gap-4 pb-8">
      {step === 1 && <Step1Observation petName={profile.name} onNext={handleStep1} />}
      {step === 2 && <Step2Activity petName={profile.name} onNext={handleStep2} />}
      {step === 3 && <Step3Registro petName={profile.name} onComplete={handleStep3} />}
    </div>
  );
}
