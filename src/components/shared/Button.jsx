export function Button({ children, onClick, variant = 'primary', disabled, className = '', type = 'button' }) {
  const base = 'min-h-[48px] px-6 py-3 rounded-2xl font-sans font-semibold text-base transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none w-full';
  const variants = {
    primary: 'bg-terracotta text-white shadow-warm hover:bg-terracotta-dark focus:ring-terracotta',
    secondary: 'bg-surface-warm border border-border text-warm-dark hover:bg-cream-dark focus:ring-terracotta',
    ghost: 'bg-transparent text-terracotta hover:bg-terracotta-pale focus:ring-terracotta',
    sage: 'bg-sage text-white shadow-warm hover:bg-sage-dark focus:ring-sage',
    danger: 'bg-red-400 text-white hover:bg-red-500 focus:ring-red-400',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
