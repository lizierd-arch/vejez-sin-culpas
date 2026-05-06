import { useState, useEffect } from 'react';
import { exportToCSV } from '../services/export';
import { Button } from './shared/Button';

const MOOD_EMOJI = {
  'Tranquilo/a': '😌', 'Bien': '😊', 'Regular': '😐', 'Incómodo/a': '😟', 'Difícil': '😔',
};
const MODE_LABELS = {
  'normal': '', 'día-difícil': '🌧️ Día difícil', 'pregunta-sola': '💬 Pregunta',
};

function getStreak(profileId) {
  try { return JSON.parse(localStorage.getItem(`vsc_streak_${profileId}`) || '{}'); } catch { return {}; }
}

// ── Entry card ────────────────────────────────────────────────────────────────
function EntryCard({ entry }) {
  const date = new Date(entry.date).toLocaleDateString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  return (
    <div className="bg-surface-warm rounded-2xl p-4 border border-border shadow-card flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-warm-light">{date}</span>
        <div className="flex items-center gap-2">
          {entry.mood && <span className="text-lg">{MOOD_EMOJI[entry.mood] || '🐾'}</span>}
          {entry.mode && entry.mode !== 'normal' && (
            <span className="text-xs bg-cream-dark text-warm-light px-2 py-0.5 rounded-full">
              {MODE_LABELS[entry.mode] || entry.mode}
            </span>
          )}
        </div>
      </div>
      {entry.obs1 && (
        <p className="text-sm text-warm-dark leading-relaxed line-clamp-2">{entry.obs1}</p>
      )}
      {entry.activityType && (
        <span className="text-xs bg-sage-pale text-sage-dark font-semibold px-2 py-0.5 rounded-full self-start">
          {entry.activityType === 'Mental' ? '🧠' : entry.activityType === 'Física' ? '🌿' : '❤️'} {entry.activityType}
        </span>
      )}
      {entry.reg1 && (
        <p className="text-sm text-warm-dark italic line-clamp-2">"{entry.reg1}"</p>
      )}
      {entry.question && entry.questionAnswer && (
        <div className="p-3 bg-terracotta-pale rounded-xl">
          <p className="text-xs text-terracotta-dark leading-relaxed">{entry.question}</p>
          <p className="text-sm text-warm-dark mt-1 italic">"{entry.questionAnswer}"</p>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function MiProceso({ profile, onBack }) {
  const [entries, setEntries]     = useState([]);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported]   = useState(false);
  const streak = getStreak(profile.id);

  useEffect(() => {
    const raw = localStorage.getItem(`vsc_history_${profile.id}`);
    setEntries(raw ? JSON.parse(raw) : []);
    setExported(false);
  }, [profile.id]);

  async function handleExport() {
    setExporting(true);
    try {
      await exportToCSV(profile, entries);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch {
      // user cancelled share sheet — not an error
    }
    setExporting(false);
  }

  const totalCount = entries.length;

  return (
    <div className="animate-fade-in flex flex-col gap-5 pb-8">

      {/* Header */}
      <div className="flex items-center gap-3 pt-4">
        <button onClick={onBack} className="text-warm-light text-xl leading-none active:opacity-60">‹</button>
        <div>
          <h1 className="font-hand text-2xl text-warm-dark leading-tight">Mi Proceso</h1>
          <p className="text-xs text-warm-light">{profile.avatar || '🐾'} {profile.name}</p>
        </div>
      </div>

      {/* Streak / totales */}
      {(streak.count > 0 || totalCount > 0) && (
        <div className="flex items-center gap-3 bg-terracotta-pale rounded-2xl p-4 border border-terracotta/20">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="font-semibold text-terracotta-dark">
              {streak.count > 0
                ? `${streak.count} ${streak.count === 1 ? 'día' : 'días'} seguidos`
                : 'Historial de registros'}
            </p>
            <p className="text-xs text-warm-light">acompañando a {profile.name}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-hand font-bold text-terracotta">{totalCount}</p>
            <p className="text-xs text-warm-light">registros</p>
          </div>
        </div>
      )}

      {/* Exportar CSV */}
      {totalCount > 0 && (
        <div className="bg-surface-warm rounded-2xl p-4 border border-border flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <p className="text-sm font-semibold text-warm-dark">Exportar registros</p>
              <p className="text-xs text-warm-light mt-0.5 leading-relaxed">
                Descarga un archivo CSV con todos los registros de {profile.name} — puedes abrirlo en Excel o compartirlo con tu veterinario.
              </p>
            </div>
          </div>
          <Button
            onClick={handleExport}
            disabled={exporting}
            variant="secondary"
          >
            {exported ? '✓ Archivo listo' : exporting ? 'Preparando...' : '⬇ Exportar a CSV'}
          </Button>
        </div>
      )}

      {/* Lista de registros */}
      {totalCount > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-warm-pale uppercase tracking-wide">
            Registros · {profile.name}
          </p>
          {entries.map((e, i) => <EntryCard key={i} entry={e} />)}
        </div>
      ) : (
        <div className="text-center py-12 flex flex-col items-center gap-3 text-warm-pale">
          <span className="text-4xl">📔</span>
          <p className="text-sm">Todavía no hay registros.<br />¡Haz tu primer protocolo!</p>
        </div>
      )}

    </div>
  );
}
