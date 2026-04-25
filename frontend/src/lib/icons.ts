import type { SimpleIcon } from 'simple-icons';
import * as allIcons from 'simple-icons';

export type { SimpleIcon };

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function lookupIcon(query: string): SimpleIcon | null {
  if (!query) return null;
  const target = normalize(query);
  for (const value of Object.values(allIcons)) {
    const icon = value as SimpleIcon;
    if (!icon?.slug) continue;
    if (normalize(icon.slug) === target || normalize(icon.title) === target) {
      return icon;
    }
  }
  return null;
}

function isTooDark(hex: string): boolean {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return 0.299 * r + 0.587 * g + 0.114 * b < 50;
}

export function isMdIcon(name: string | undefined): boolean {
  return !!name && name.startsWith('Md') && name.length > 2;
}

export function resolveIconColor(iconName?: string): string {
  if (isMdIcon(iconName)) return 'rgba(255,255,255,0.6)';
  const icon = iconName ? lookupIcon(iconName) : null;
  if (!icon) return 'rgba(255,255,255,0.4)';
  return isTooDark(icon.hex) ? '#e0e0e0' : `#${icon.hex}`;
}
