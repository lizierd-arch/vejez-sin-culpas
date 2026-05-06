import { useState, useEffect } from 'react';
import { fetchEntries, isSignedIn, redirectToSignIn, getSheetUrl, syncLocalEntries } from '../services/sheets';
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

// ── Entry cards ───────────────────────────────────────────────────────────────
function EntryCard({ entry }) {
  const [fecha, , obs1, , mood, tipo, , reg1, , , pregunta, respuesta, modo] = entry;
  return (
    <div className="bg-surface-warm rounded-2xl p-4 border border-border shadow-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-warm-light">{fecha}</span>
        <div className="flex items-center gap-2">
          {mood && <span className="text-lg">{MOOD_EMOJI[mood] || '🐾'}</span>}
          {modo && modo !== 'normal' && (
            <span className="text-xs bg-cream-dark text-warm-light px-2 py-0.5 rounded-full">
              {MODE_LABELS[modo] || modo}
            </span>
          )}
        </div>
      </div>
      {obs1 && (
        <div>
          <p className="text-xs font-semibold text-warm-pale mb-1">OBSERVACIÓN</p>
          <p className="text-sm text-warm-dark leading-relaxed line-clamp-2">{obs1}</p>
        </div>
      )}
      {tipo && (
        <span className="text-xs bg-sage-pale text-sage-dark font-semibold px-2 py-0.5 rounded-full self-start">
          {tipo === 'Mental' ? '🧠' : tipo === 'Física' ? '🌿' : '❤️'} {tipo}
        </span>
      )}
      {reg1 && (
        <div>
          <p className="text-xs font-semibold text-warm-pale mb-1">REGISTRO</p>
          <p className="text-sm text-warm-dark leading-relaxed line-clamp-2 italic">"{reg1}"</p>
        </div>
      )}
      {pregunta && respuesta && (
        <div className="p-3 bg-terracotta-pale rounded-xl">
          <p className="text-xs text-terracotta-dark leading-relaxed">{pregunta}</p>
          <p className="text-sm text-warm-dark mt-1 italic">"{respuesta}"</p>
        </div>
      )}
    </div>
  );
}

function LocalEntry({ entry }) {
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
      {entry.obs1 && <p className="text-sm text-warm-dark leading-relaxed line-clamp-2">{entry.obs1}</p>}
      {entry.reg1 && <p className="text-sm text-warm-dark italic line-clamp-2">"{entry.reg1}"</p>}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function MiProceso({ profile, onBack }) {
  const [localEntries, setLocalEntries] = useState([]);
  const [sheetEntries, setSheetEntries] = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const streak = getStreak(profile.id);

  useEffect(() => {
    const raw = localStorage.getItem(`vsc_history_${profile.id}`);
    const entries = raw ? JSON.parse(raw) : [];
    setLocalEntries(entries);
    if (isSignedIn()) loadSheetEntries(entries);
  }, [profile.id]);

  async function loadSheetEntries(localForSync) {
    setLoading(true);
    setError('');
    try {
      // Sync any local entries that aren't in Sheets yet
      const local = localForSync ?? localEntries;
      if (local.length) await syncLocalEntries(profile, local);
      const rows = await fetchEntries(profile);
      setSheetEntries(rows.reverse());
    } catch (e) {
      if (e?.message?.includes('Not signed in') || e?.message?.includes('401')) {
        // Token expired — show reconnect prompt without error message
        setSheetEntries([]);
      } else {
        setError('Error al cargar registros. Intenta de nuevo.');
      }
    }
    setLoading(false);
  }

  const signed       = isSignedIn();
  const hasSheetData = sheetEntries.length > 0;
  const hasLocalData = localEntries.length > 0;
  const showSheetView = signed && hasSheetData;
  const showLocalView = !showSheetView && hasLocalData;
  const totalCount    = showSheetView ? sheetEntries.length : localEntries.length;

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

      {/* Streak */}
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

      {/* Google Sheets panel */}
      <div className={`rounded-2xl p-4 border flex flex-col gap-3 ${
        signed && hasSheetData ? 'bg-sage-pale border-sage' : 'bg-surface-warm border-border'
      }`}>
        {!signed ? (
          <>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="text-sm font-semibold text-warm-dark">Conecta con Google Sheets</p>
                <p className="text-xs text-warm-light mt-0.5 leading-relaxed">
                  Cada registro se guarda en una hoja organizada por mascota — lista para compartir con tu veterinario.
                </p>
              </div>
            </div>
            <Button onClick={redirectToSignIn} variant="secondary">
              🔗 Conectar con Google Sheets
            </Button>
            <p className="text-xs text-warm-pale text-center">
              Te redirigirá a Google y volverá automáticamente
            </p>
          </>
        ) : loading ? (
          <div className="flex items-center gap-2 text-sm text-sage-dark">
            <span className="animate-pulse-soft">⏳</span> Sincronizando registros...
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{hasSheetData ? '✅' : '🔗'}</span>
                <div>
                  <p className="text-sm font-semibold text-sage-dark">
                    {hasSheetData ? 'Sincronizado con Google Sheets' : 'Conectado — sin registros aún'}
                  </p>
                  {hasSheetData && (
                    <p className="text-xs text-sage">
                      {sheetEntries.length} {sheetEntries.length === 1 ? 'registro' : 'registros'} · pestaña "{profile.name}"
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getSheetUrl() && (
                  <a
                    href={getSheetUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-sage-dark bg-white/60 px-3 py-1.5 rounded-xl active:scale-95 transition-all"
                  >
                    Abrir ↗
                  </a>
                )}
                <button
                  onClick={() => loadSheetEntries()}
                  className="text-xs text-warm-pale px-2 py-1.5 rounded-xl active:scale-95"
                >
                  ↻
                </button>
              </div>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </>
        )}
      </div>

      {/* Registros desde Sheets */}
      {showSheetView && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-warm-pale uppercase tracking-wide">
            Registros en Google Sheets · {profile.name}
          </p>
          {sheetEntries.map((e, i) => <EntryCard key={i} entry={e} />)}
        </div>
      )}

      {/* Registros locales */}
      {showLocalView && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-warm-pale uppercase tracking-wide">
            {signed ? 'Guardado en este dispositivo (pendiente de sync)' : 'Tus registros'}
          </p>
          {localEntries.map((e, i) => <LocalEntry key={i} entry={e} />)}
        </div>
      )}

      {/* Estado vacío */}
      {!showSheetView && !showLocalView && (
        <div className="text-center py-12 flex flex-col items-center gap-3 text-warm-pale">
          <span className="text-4xl">📔</span>
          <p className="text-sm">Todavía no hay registros.<br />¡Haz tu primer protocolo!</p>
        </div>
      )}

    </div>
  );
}
