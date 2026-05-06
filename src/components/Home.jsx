import { useState, useEffect } from 'react';
import { getTodayQuestion } from '../data/questions';
import { Button } from './shared/Button';
import { TextInput } from './shared/TextInput';
import { isSignedIn, appendEntry } from '../services/sheets';

function getStreak(profileId) {
  try { return JSON.parse(localStorage.getItem(`vsc_streak_${profileId}`) || '{}'); } catch { return {}; }
}

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

function PetSwitcher({ profiles, activeIndex, onSwitch }) {
  if (profiles.length < 2) return null;
  const other = profiles[activeIndex === 0 ? 1 : 0];
  return (
    <button
      onClick={() => onSwitch(activeIndex === 0 ? 1 : 0)}
      className="flex items-center gap-2 self-start bg-surface-warm border border-border rounded-full px-3 py-1.5 transition-all active:scale-95 hover:border-terracotta-light"
    >
      <span className="text-base">{other.avatar || '🐾'}</span>
      <span className="text-xs font-semibold text-warm-light">Cambiar a {other.name}</span>
      <span className="text-warm-pale text-xs">⇄</span>
    </button>
  );
}

export function Home({ profile, profiles, activeIndex, onSwitchProfile, onStartProtocol, onDiaDificil, onMiProceso, onProtocolInfo, onInstall }) {
  const question = getTodayQuestion(profile.name);
  const [answer, setAnswer] = useState('');
  const [saved, setSaved] = useState(false);
  const [streak, setStreak] = useState(() => getStreak(profile.id));

  // Reset when switching profiles
  useEffect(() => {
    setStreak(getStreak(profile.id));
    setAnswer('');
    setSaved(false);
  }, [profile.id]);

  const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  })();

  async function handleSaveAnswer() {
    if (!answer.trim()) return;
    const entry = {
      question,
      questionAnswer: answer,
      mode: 'pregunta-sola',
      obs1: '', obs2: '', mood: '', activityType: '', activityReaction: '',
      reg1: '', reg2: '', reg3: '',
    };
    try {
      if (isSignedIn()) await appendEntry(profile, entry);
    } catch (e) {
      console.error(e);
    }
    const updated = updateStreak(profile.id);
    setStreak(updated);
    setSaved(true);
  }

  return (
    <div className="animate-fade-in flex flex-col gap-5 pb-6">
      {/* Header */}
      <div className="pt-8 pb-2 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-warm-light capitalize">{today}</p>
            <h1 className="font-hand text-3xl text-warm-dark mt-0.5">
              {greeting} {profile.avatar || '🐾'}
            </h1>
            <p className="text-base text-warm-mid mt-1">
              ¿Cómo está <strong className="font-hand text-lg">{profile.name}</strong> hoy?
            </p>
          </div>
        </div>
        <PetSwitcher profiles={profiles} activeIndex={activeIndex} onSwitch={onSwitchProfile} />
      </div>

      {/* Streak */}
      {streak.count > 0 && (
        <div className="flex items-center gap-3 bg-terracotta-pale rounded-2xl p-4 border border-terracotta/20">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="font-semibold text-terracotta-dark text-sm">{streak.count} {streak.count === 1 ? 'día' : 'días'} consecutivos</p>
            <p className="text-xs text-warm-light">¡Sigues acompañando a {profile.name}!</p>
          </div>
        </div>
      )}

      {/* Daily question */}
      <div className="bg-surface-warm rounded-2xl p-5 border border-border shadow-card">
        <div className="flex items-start gap-2 mb-3">
          <span className="text-xl">💬</span>
          <p className="font-hand text-warm-dark leading-snug text-lg">{question}</p>
        </div>
        {!saved ? (
          <div className="flex flex-col gap-3">
            <TextInput
              value={answer}
              onChange={setAnswer}
              placeholder="Escribe tu reflexión aquí..."
              multiline
              rows={3}
            />
            <Button onClick={handleSaveAnswer} disabled={!answer.trim()} variant="ghost">
              Guardar reflexión
            </Button>
          </div>
        ) : (
          <div className="p-3 bg-sage-pale rounded-xl border border-sage text-sm text-sage-dark font-semibold">
            ✓ Reflexión guardada. ¡Gracias por estar presente!
          </div>
        )}
      </div>

      {/* Main CTA */}
      <Button onClick={onStartProtocol}>
        ▶ Hacer el protocolo del día
      </Button>

      {/* Secondary actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onDiaDificil}
          className="min-h-[72px] rounded-2xl border-2 border-border bg-surface-warm p-3 flex flex-col items-center gap-1 text-center transition-all active:scale-95 hover:border-terracotta-light"
        >
          <span className="text-2xl">🌧️</span>
          <span className="text-xs font-semibold text-warm-mid">Día difícil</span>
        </button>
        <button
          onClick={onProtocolInfo}
          className="min-h-[72px] rounded-2xl border-2 border-border bg-surface-warm p-3 flex flex-col items-center gap-1 text-center transition-all active:scale-95 hover:border-terracotta-light"
        >
          <span className="text-2xl">✨</span>
          <span className="text-xs font-semibold text-warm-mid">El protocolo</span>
        </button>
      </div>

      {/* Install banner — only shown when browser supports PWA install */}
      {onInstall && (
        <button
          onClick={onInstall}
          className="flex items-center gap-3 w-full bg-sage-pale border border-sage rounded-2xl p-4 text-left active:scale-95 transition-all"
        >
          <span className="text-2xl">📲</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-sage-dark">Instalar app</p>
            <p className="text-xs text-warm-light">Agregar a tu pantalla de inicio</p>
          </div>
          <span className="text-sage-dark text-lg">›</span>
        </button>
      )}
    </div>
  );
}
