import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'ghost' | 'solid' | 'outline';
type ButtonSize = 'sm' | 'md';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const base =
  'rounded-lg font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed';

const variantMap: Record<ButtonVariant, string> = {
  ghost: 'bg-ink-7 text-ink-50 hover:bg-ink-10 hover:text-ink-70 border border-ink-7',
  solid: 'bg-[var(--text)] text-[var(--bg)] hover:opacity-90',
  outline: 'bg-transparent text-ink-70 border border-ink-15 hover:bg-ink-7',
};

const sizeMap: Record<ButtonSize, string> = {
  sm: 'h-7 px-3 text-xs',
  md: 'h-8 px-4 text-sm',
};

export function Button({
  children,
  variant = 'ghost',
  size = 'sm',
  className = '',
  type = 'button',
  ...props
}: Props) {
  return (
    <button type={type} className={`${base} ${variantMap[variant]} ${sizeMap[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
