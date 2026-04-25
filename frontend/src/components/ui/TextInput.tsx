import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const base =
  'w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-white/15 transition-colors';

export function TextInput({ className = '', ...props }: Props) {
  return <input className={`${base} ${className}`} {...props} />;
}
