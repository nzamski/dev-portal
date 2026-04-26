import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const base =
  'w-full bg-ink-5 border border-ink-8 rounded-xl px-3 py-2 text-sm text-[var(--text)] placeholder-ink-20 outline-none focus:border-ink-15 transition-colors';

export function TextInput({ className = '', ...props }: Props) {
  return <input className={`${base} ${className}`} {...props} />;
}
