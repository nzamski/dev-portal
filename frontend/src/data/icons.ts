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
  // perceived luminance; threshold ~30 catches true blacks/near-blacks without flagging vivid dark blues
  return 0.299 * r + 0.587 * g + 0.114 * b < 30;
}

// Maps the 2-3 char PascalCase prefix of react-icons component names to their sub-package
const REACT_ICONS_PREFIXES: Record<string, string> = {
  Fa6: 'fa6', Hi2: 'hi2', Io5: 'io5',
  Md: 'md', Fa: 'fa', Si: 'si', Bs: 'bs', Bi: 'bi',
  Hi: 'hi', Io: 'io', Ri: 'ri', Ti: 'ti', Tb: 'tb',
  Vsc: 'vsc', Gi: 'gi', Cg: 'cg', Im: 'im', Fi: 'fi',
  Ai: 'ai', Di: 'di', Ci: 'ci', Pi: 'pi', Lu: 'lu',
  Rx: 'rx', Sl: 'sl', Wi: 'wi', Go: 'go', Tfi: 'tfi',
};

// Returns true when the iconName looks like a react-icons component (PascalCase with known prefix)
export function isReactIconsName(name: string | undefined): boolean {
  if (!name) return false;
  return getReactIconsPackage(name) !== null;
}

// Returns the react-icons sub-package name for a component like "MdOutlineSupport" → "md"
export function getReactIconsPackage(name: string): string | null {
  // Sort longer prefixes first so Fa6/Hi2/Io5 are checked before Fa/Hi/Io
  for (const prefix of Object.keys(REACT_ICONS_PREFIXES).sort((a, b) => b.length - a.length)) {
    if (name.startsWith(prefix) && name.length > prefix.length) {
      return REACT_ICONS_PREFIXES[prefix];
    }
  }
  return null;
}

export function resolveIconColor(serviceId: string, serviceName?: string, iconName?: string): string {
  // react-icons have no brand color
  if (isReactIconsName(iconName)) return 'rgba(255,255,255,0.6)';
  // prefer explicit iconName as a simple-icons slug, then fall back to id/name
  const icon = (iconName ? lookupIcon(iconName) : null)
    ?? lookupIcon(serviceId)
    ?? (serviceName ? lookupIcon(serviceName) : null);
  if (!icon) return 'rgba(255,255,255,0.4)';
  return isTooDark(icon.hex) ? '#e0e0e0' : `#${icon.hex}`;
}
