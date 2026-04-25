import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import type { SimpleIcon } from 'simple-icons';
import { lookupIcon, isMdIcon, resolveIconColor } from '@/lib/icons';

const SHADED_COLOR = 'rgba(255,255,255,0.35)';

interface Props {
  serviceName?: string;
  iconName?: string;
  size?: number;
  shaded?: boolean;
  className?: string;
}

type MdIconComponent = ComponentType<{ size?: number; color?: string; className?: string }>;

function useMdIcon(iconName: string | undefined): MdIconComponent | null {
  const [Icon, setIcon] = useState<MdIconComponent | null>(null);

  useEffect(() => {
    if (!isMdIcon(iconName)) {
      setIcon(null);
      return;
    }
    // @ts-expect-error dynamic import exposes a module namespace with string keys
    import('react-icons/md').then((mod: Record<string, MdIconComponent>) => {
      const Comp = mod[iconName!];
      setIcon(Comp ? () => Comp : null);
    }).catch(() => setIcon(null));
  }, [iconName]);

  return Icon;
}

export function ServiceIcon({ serviceName, iconName, size = 22, shaded = false, className = '' }: Props) {
  const MdIcon = useMdIcon(iconName);

  const simpleIcon: SimpleIcon | null = !isMdIcon(iconName) && iconName
    ? lookupIcon(iconName)
    : null;

  const resolvedColor = shaded ? SHADED_COLOR : resolveIconColor(iconName);

  if (MdIcon) {
    return <MdIcon size={size} color={resolvedColor} className={className} />;
  }

  if (simpleIcon) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={resolvedColor}
        className={className}
        aria-label={simpleIcon.title}
      >
        <path d={simpleIcon.path} />
      </svg>
    );
  }

  const label = serviceName ?? '';
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        fontSize: size * 0.45,
        color: resolvedColor,
        fontWeight: 700,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        width: size,
        height: size,
      }}
    >
      {label.replace(/-/g, '').slice(0, 2).toUpperCase()}
    </span>
  );
}
