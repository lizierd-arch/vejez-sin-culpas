import { Button } from '../shared/Button';

const STEPS = [
  {
    icon: '👁️',
    title: 'Observación',
    duration: '3 min',
    color: 'bg-terracotta-pale border-terracotta',
    desc: 'Observa a tu mascota con presencia plena. Anota lo que ves, sin juicio.',
  },
  {
    icon: '🌿',
    title: 'Actividad',
    duration: '5 min',
    color: 'bg-sage-pale border-sage',
    desc: 'Comparte un momento de actividad adaptada: mental, física o de conexión.',
  },
  {
    icon: '📓',
    title: 'Registro consciente',
    duration: '7 min',
    color: 'bg-peach border-terracotta-light',
    desc: 'Reflexiona y escribe sobre la experiencia de hoy. Es tu diario de amor.',
  },
];

export function Step2Protocol({ petName, onNext }) {
  return (
    <div className="animate-fade-in flex flex-col gap-6 h-full">
      <div className="text-center pt-4">
        <div className="text-5xl mb-3">✨</div>
        <h1 className="font-serif text-2xl text-warm-dark mb-1">El Protocolo Diario</h1>
        <p className="text-sm text-warm-light">
          15 minutos al día para estar presente con <strong>{petName}</strong>
        </p>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {STEPS.map((s, i) => (
          <div key={s.title} className={`flex gap-4 items-start p-4 rounded-2xl border-2 ${s.color}`}>
            <div className="flex flex-col items-center min-w-[44px]">
              <span className="text-3xl">{s.icon}</span>
              <span className="text-xs font-bold text-warm-light mt-1">{i + 1}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif font-bold text-warm-dark">{s.title}</span>
                <span className="text-xs bg-white/70 text-warm-mid px-2 py-0.5 rounded-full font-semibold">{s.duration}</span>
              </div>
              <p className="text-sm text-warm-light leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}

        <div className="mt-2 p-4 bg-surface-warm rounded-2xl border border-border text-sm text-warm-light leading-relaxed">
          En los días más difíciles, tienes el modo <strong className="text-terracotta">Día Difícil</strong> —
          dos preguntas simples, sin presión.
        </div>
      </div>

      <Button onClick={onNext}>¡Empezar el protocolo!</Button>
    </div>
  );
}
