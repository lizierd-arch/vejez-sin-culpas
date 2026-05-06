import { Button } from './shared/Button';

const STEPS = [
  {
    icon: '👁️',
    title: 'Observación',
    duration: '3 min',
    number: '3',
    accent: 'bg-terracotta-pale border-terracotta',
    badge: 'bg-terracotta text-white',
    what: 'Siéntate cerca de tu mascota. Sin hablarle, sin moverla. Solo observa.',
    how: [
      'Nota su respiración: ¿es tranquila o agitada?',
      'Observa su postura: ¿está cómoda, tensa, relajada?',
      'Mira sus ojos, orejas, cola o bigotes — ¿qué expresan?',
      'Anota cualquier cambio respecto a ayer.',
    ],
    tip: 'Si tu mente se distrae, vuelve a la respiración de tu mascota. Eso es el ancla.',
  },
  {
    icon: '🌿',
    title: 'Actividad',
    duration: '5 min',
    number: '5',
    accent: 'bg-sage-pale border-sage',
    badge: 'bg-sage text-white',
    what: 'Comparte un momento activo y adaptado a lo que tu mascota puede hacer hoy.',
    how: [
      '🧠 Mental — juego de olfato, premios escondidos, explorar algo nuevo.',
      '🌿 Física — caminata corta, masajes suaves, estiramientos gentiles.',
      '❤️ Conexión — caricias, contacto visual, hablarle en voz baja.',
    ],
    tip: 'No importa qué tan pequeña sea la actividad. Lo que cuenta es la presencia compartida.',
  },
  {
    icon: '📓',
    title: 'Registro consciente',
    duration: '7 min',
    number: '7',
    accent: 'bg-peach border-terracotta-light',
    badge: 'bg-terracotta-light text-white',
    what: 'Escribe libremente sobre lo que vivieron juntos hoy. Sin correcciones, sin filtros.',
    how: [
      '¿Qué momento de hoy quieres recordar?',
      '¿Qué te enseñó tu mascota sobre vivir el presente?',
      '¿Cómo te sientes tú después de este tiempo juntos?',
    ],
    tip: 'Este es tu diario de amor. Con el tiempo se convierte en el registro más valioso de esta etapa.',
  },
];

export function ProtocolInfo({ onBack, onStartProtocol }) {
  return (
    <div className="animate-fade-in flex flex-col gap-6 pb-8">

      {/* Header */}
      <div className="pt-6">
        <button
          onClick={onBack}
          className="text-warm-light text-sm flex items-center gap-1 mb-5 active:opacity-60"
        >
          ‹ Volver
        </button>
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <span className="text-4xl">✨</span>
          </div>
          <h1 className="font-hand text-3xl text-warm-dark">El Protocolo 3-5-7</h1>
          <p className="text-sm text-warm-light mt-2 leading-relaxed max-w-xs mx-auto">
            15 minutos al día. Tres pasos. Un vínculo más profundo con tu mascota en su etapa mayor.
          </p>
        </div>
      </div>

      {/* Visual timeline */}
      <div className="flex items-center justify-center gap-2 py-1">
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-hand font-bold ${s.badge} shadow-warm`}>
              {s.number}
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-8 h-0.5 bg-border rounded-full" />
            )}
          </div>
        ))}
        <p className="ml-3 text-xs text-warm-light font-semibold">= 15 min</p>
      </div>

      {/* Step cards */}
      {STEPS.map((s, i) => (
        <div key={s.title} className={`rounded-2xl border-2 overflow-hidden ${s.accent}`}>
          {/* Step header */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <span className="text-3xl">{s.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-hand text-xl text-warm-dark">{s.title}</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${s.badge}`}>
                  {s.duration}
                </span>
              </div>
              <p className="text-xs text-warm-light mt-0.5">Paso {i + 1} de 3</p>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 h-px bg-black/5" />

          {/* Content */}
          <div className="px-4 py-3 flex flex-col gap-3">
            <p className="text-sm text-warm-dark font-semibold leading-snug">{s.what}</p>
            <ul className="flex flex-col gap-1.5">
              {s.how.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-warm-mid leading-relaxed">
                  <span className="text-warm-pale mt-0.5 shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-start gap-2 bg-white/60 rounded-xl p-3 mt-1">
              <span className="text-base shrink-0">💡</span>
              <p className="text-xs text-warm-light italic leading-relaxed">{s.tip}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Día difícil note */}
      <div className="flex items-start gap-3 p-4 bg-surface-warm rounded-2xl border border-border">
        <span className="text-2xl">🌧️</span>
        <div>
          <p className="text-sm font-semibold text-warm-dark mb-0.5">¿Tienes un día muy difícil?</p>
          <p className="text-sm text-warm-light leading-relaxed">
            Usa el modo <strong className="text-terracotta">Día Difícil</strong> desde la pantalla de inicio.
            Son solo dos preguntas breves, sin presión. También cuenta.
          </p>
        </div>
      </div>

      {/* CTA */}
      <Button onClick={onStartProtocol}>
        🌿 Hacer el protocolo ahora
      </Button>
    </div>
  );
}
