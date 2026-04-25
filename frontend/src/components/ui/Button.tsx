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
  ghost: 'bg-white/[0.07] text-white/50 hover:bg-white/[0.1] hover:text-white/70 border border-white/[0.07]',
  solid: 'bg-white text-[#0c0c0c] hover:bg-white/90',
  outline: 'bg-transparent text-white/70 border border-white/[0.15] hover:bg-white/[0.07]',
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
