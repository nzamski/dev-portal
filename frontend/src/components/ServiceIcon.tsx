import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import type { SimpleIcon } from 'simple-icons';
import { lookupIcon, isReactIconsName, getReactIconsPackage } from '../data/icons';

interface Props {
  serviceId: string;
  serviceName?: string;
  iconName?: string;
  size?: number;
  color?: string;
  className?: string;
}

type ReactIconComponent = ComponentType<{ size?: number; color?: string; className?: string }>;

function useReactIcon(iconName: string | undefined): ReactIconComponent | null {
  const [Icon, setIcon] = useState<ReactIconComponent | null>(null);

  useEffect(() => {
    if (!isReactIconsName(iconName)) {
      setIcon(null);
      return;
    }
    const pkg = getReactIconsPackage(iconName!);
    if (!pkg) {
      setIcon(null);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore — dynamic sub-package import; Vite bundles each package as a separate chunk
    import(/* @vite-ignore */ `react-icons/${pkg}`).then((mod: Record<string, ReactIconComponent>) => {
      const Comp = mod[iconName!];
      setIcon(Comp ? () => Comp : null);
    }).catch(() => setIcon(null));
  }, [iconName]);

  return Icon;
}

export function ServiceIcon({ serviceId, serviceName, iconName, size = 22, color, className = '' }: Props) {
  const ReactIcon = useReactIcon(iconName);

  const simpleIcon: SimpleIcon | null = iconName && !isReactIconsName(iconName)
    ? lookupIcon(iconName)
    : (!iconName ? lookupIcon(serviceId) ?? (serviceName ? lookupIcon(serviceName) : null) : null);

  const resolvedColor = color ?? (simpleIcon
    ? parseInt(simpleIcon.hex, 16) < 0x333333 ? '#e0e0e0' : `#${simpleIcon.hex}`
    : 'rgba(255,255,255,0.4)');

  if (ReactIcon) {
    return <ReactIcon size={size} color={color ?? 'rgba(255,255,255,0.6)'} className={className} />;
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

  const label = serviceName ?? serviceId;
  return (
    <span
      className={className}
      style={{
        fontSize: size * 0.45,
        color: color ?? 'rgba(255,255,255,0.4)',
        fontWeight: 700,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
      }}
    >
      {label.replace(/-/g, '').slice(0, 2).toUpperCase()}
    </span>
  );
}
