const MOODS = [
  { emoji: '😌', label: 'Tranquilo/a' },
  { emoji: '😊', label: 'Bien' },
  { emoji: '😐', label: 'Regular' },
  { emoji: '😟', label: 'Incómodo/a' },
  { emoji: '😔', label: 'Difícil' },
];

export function MoodPicker({ value, onChange }) {
  return (
    <div>
      <p className="text-sm font-semibold text-warm-light mb-3">Estado de ánimo</p>
      <div className="flex justify-between gap-1">
        {MOODS.map((m) => (
          <button
            key={m.emoji}
            type="button"
            onClick={() => onChange(m.label)}
            className={`flex flex-col items-center gap-1 flex-1 py-2 px-1 rounded-xl border-2 transition-all active:scale-95 ${
              value === m.label
                ? 'border-terracotta bg-terracotta-pale shadow-warm'
                : 'border-border bg-surface-warm hover:border-terracotta-light'
            }`}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-[10px] text-warm-light leading-tight text-center">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
