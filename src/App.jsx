import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Home } from './components/Home';
import { Protocol } from './components/Protocol';
import { DiaDificil } from './components/DiaDificil';
import { MiProceso } from './components/MiProceso';
import { Profile } from './components/Profile';
import { ProtocolInfo } from './components/ProtocolInfo';
import { initSheets } from './services/sheets';
import { restoreReminder } from './services/notifications';

// ─── Migration from single-profile (v1) to multi-profile (v2) ────────────────
function migrateIfNeeded() {
  if (localStorage.getItem('vsc_profiles')) return; // already v2
  const old = localStorage.getItem('vsc_profile');
  if (!old) return;
  try {
    const profile = { ...JSON.parse(old), id: 0 };
    localStorage.setItem('vsc_profiles', JSON.stringify([profile]));
    localStorage.setItem('vsc_active', '0');
    // Migrate per-profile data to namespaced keys
    ['vsc_history', 'vsc_streak', 'vsc_sheet_id'].forEach((key) => {
      const val = localStorage.getItem(key);
      if (val) { localStorage.setItem(`${key}_0`, val); localStorage.removeItem(key); }
    });
    localStorage.removeItem('vsc_profile');
  } catch { /* ignore */ }
}

function loadProfiles() {
  migrateIfNeeded();
  try {
    const raw = localStorage.getItem('vsc_profiles');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function loadActiveIndex(profiles) {
  const idx = parseInt(localStorage.getItem('vsc_active') || '0', 10);
  return profiles && idx < profiles.length ? idx : 0;
}

function saveProfilesToStorage(profiles) {
  localStorage.setItem('vsc_profiles', JSON.stringify(profiles));
}

// ─── Views ────────────────────────────────────────────────────────────────────
const VIEWS = {
  ONBOARDING: 'onboarding',
  HOME: 'home',
  PROTOCOL: 'protocol',
  DIA_DIFICIL: 'dia-dificil',
  MI_PROCESO: 'mi-proceso',
  PERFIL: 'perfil',
  PROTOCOL_INFO: 'protocol-info',
};

// ─── Nav bar ─────────────────────────────────────────────────────────────────
function NavBar({ view, onHome, onProtocol, onMiProceso, onPerfil }) {
  if (view === VIEWS.ONBOARDING) return null;
  const items = [
    { id: VIEWS.HOME,       icon: '🏡', label: 'Inicio',     action: onHome },
    { id: VIEWS.PROTOCOL,   icon: '🌿', label: 'Protocolo',  action: onProtocol },
    { id: VIEWS.MI_PROCESO, icon: '📔', label: 'Mi Proceso', action: onMiProceso },
    { id: VIEWS.PERFIL,     icon: '🐾', label: 'Perfil',     action: onPerfil },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-bottom">
      <div className="max-w-sm mx-auto flex">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-all active:scale-95 ${
              view === item.id ? 'text-terracotta' : 'text-warm-pale hover:text-warm-light'
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [profiles, setProfiles] = useState(() => loadProfiles());
  const [activeIndex, setActiveIndex] = useState(() => {
    const profs = loadProfiles();
    return loadActiveIndex(profs);
  });
  const [view, setView] = useState(() => {
    const profs = loadProfiles();
    return profs?.[0]?.onboardingDone ? VIEWS.HOME : VIEWS.ONBOARDING;
  });
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    initSheets().catch(() => {});
    restoreReminder();
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
  }

  const profile = profiles?.[activeIndex] ?? null;

  // ── Profile management callbacks ──────────────────────────────────────────
  function handleOnboardingComplete(data) {
    const newProfile = { ...data, id: 0 };
    const newProfiles = [newProfile];
    saveProfilesToStorage(newProfiles);
    localStorage.setItem('vsc_active', '0');
    setProfiles(newProfiles);
    setActiveIndex(0);
    setView(VIEWS.HOME);
  }

  function handleSaveProfile(index, updated) {
    const newProfiles = [...profiles];
    newProfiles[index] = { ...updated, id: index };
    saveProfilesToStorage(newProfiles);
    setProfiles(newProfiles);
  }

  function handleSwitchProfile(index) {
    localStorage.setItem('vsc_active', String(index));
    setActiveIndex(index);
  }

  function handleAddProfile(data) {
    const newProfile = { ...data, id: 1, onboardingDone: true };
    const newProfiles = [...profiles, newProfile];
    saveProfilesToStorage(newProfiles);
    setProfiles(newProfiles);
    handleSwitchProfile(1);
  }

  const showNav = view !== VIEWS.ONBOARDING;

  return (
    <div className="min-h-screen bg-cream font-sans">
      {view === VIEWS.ONBOARDING && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {view !== VIEWS.ONBOARDING && profile && (
        <div className={`max-w-sm mx-auto px-5 ${showNav ? 'pb-20' : ''}`}>

          {view === VIEWS.HOME && (
            <Home
              profile={profile}
              profiles={profiles}
              activeIndex={activeIndex}
              onSwitchProfile={handleSwitchProfile}
              onStartProtocol={() => setView(VIEWS.PROTOCOL)}
              onDiaDificil={() => setView(VIEWS.DIA_DIFICIL)}
              onMiProceso={() => setView(VIEWS.MI_PROCESO)}
              onProtocolInfo={() => setView(VIEWS.PROTOCOL_INFO)}
              onInstall={installPrompt ? handleInstall : null}
            />
          )}

          {view === VIEWS.PROTOCOL && (
            <div className="pt-4">
              <button
                onClick={() => setView(VIEWS.HOME)}
                className="text-warm-light text-sm mb-4 flex items-center gap-1 active:opacity-60"
              >
                ‹ Inicio
              </button>
              <Protocol profile={profile} onComplete={() => setView(VIEWS.HOME)} />
            </div>
          )}

          {view === VIEWS.DIA_DIFICIL && (
            <DiaDificil profile={profile} onBack={() => setView(VIEWS.HOME)} />
          )}

          {view === VIEWS.MI_PROCESO && (
            <MiProceso profile={profile} onBack={() => setView(VIEWS.HOME)} />
          )}

          {view === VIEWS.PERFIL && (
            <Profile
              profiles={profiles}
              activeIndex={activeIndex}
              onSaveProfile={handleSaveProfile}
              onSwitchProfile={(i) => { handleSwitchProfile(i); }}
              onAddProfile={handleAddProfile}
            />
          )}

          {view === VIEWS.PROTOCOL_INFO && (
            <ProtocolInfo
              onBack={() => setView(VIEWS.HOME)}
              onStartProtocol={() => setView(VIEWS.PROTOCOL)}
            />
          )}
        </div>
      )}

      <NavBar
        view={view}
        onHome={() => setView(VIEWS.HOME)}
        onProtocol={() => setView(VIEWS.PROTOCOL)}
        onMiProceso={() => setView(VIEWS.MI_PROCESO)}
        onPerfil={() => setView(VIEWS.PERFIL)}
      />
    </div>
  );
}
