import { SERVICE_ICONS } from '../data/icons';

interface Props {
  serviceId: string;
  size?: number;
  color?: string;
  className?: string;
}

export function ServiceIcon({ serviceId, size = 22, color, className = '' }: Props) {
  const iconData = SERVICE_ICONS[serviceId];

  if (!iconData || !iconData.Icon) {
    const label = iconData?.fallbackLabel ?? serviceId.replace(/-/g, '').slice(0, 2).toUpperCase();
    return (
      <span
        className={className}
        style={{
          fontSize: size * 0.45,
          color: color ?? (iconData ? `#${iconData.hex}` : 'rgba(255,255,255,0.4)'),
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
        {label}
      </span>
    );
  }

  const { Icon } = iconData;
  return <Icon size={size} color={color ?? `#${iconData.hex}`} className={className} />;
}
