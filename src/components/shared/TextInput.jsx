export function TextInput({ label, value, onChange, placeholder, multiline = false, rows = 3 }) {
  const base = 'w-full rounded-2xl border border-border bg-surface-warm px-4 py-3 text-warm-dark placeholder-warm-pale font-sans text-sm focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all resize-none';
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-warm-light">{label}</label>}
      {multiline ? (
        <textarea
          className={base}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          className={base}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
