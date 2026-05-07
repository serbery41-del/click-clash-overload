import { Skin, SkinId } from './types';

// Sitting Tux Linux Penguin SVG - chubby, content, seated pose
const TUX_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 100 100">
  <ellipse cx="50" cy="92" rx="38" ry="6" fill="#000" opacity="0.25"/>
  <ellipse cx="28" cy="88" rx="14" ry="6" fill="#E8A317"/>
  <ellipse cx="72" cy="88" rx="14" ry="6" fill="#E8A317"/>
  <path d="M22 86 Q22 80 28 80 Q34 80 34 86 Z" fill="#CC8400"/>
  <path d="M66 86 Q66 80 72 80 Q78 80 78 86 Z" fill="#CC8400"/>
  <ellipse cx="50" cy="68" rx="32" ry="26" fill="#000"/>
  <path d="M22 70 Q50 95 78 70 Q78 88 50 90 Q22 88 22 70 Z" fill="#1a1a1a"/>
  <ellipse cx="50" cy="72" rx="22" ry="20" fill="#fff"/>
  <ellipse cx="50" cy="34" rx="24" ry="22" fill="#000"/>
  <path d="M30 30 Q50 18 70 30 Q66 14 50 14 Q34 14 30 30 Z" fill="#1a1a1a"/>
  <ellipse cx="50" cy="40" rx="18" ry="14" fill="#fff"/>
  <ellipse cx="42" cy="32" rx="6" ry="8" fill="#fff" stroke="#000" stroke-width="0.5"/>
  <ellipse cx="58" cy="32" rx="6" ry="8" fill="#fff" stroke="#000" stroke-width="0.5"/>
  <ellipse cx="43" cy="34" rx="2.5" ry="4" fill="#000"/>
  <ellipse cx="57" cy="34" rx="2.5" ry="4" fill="#000"/>
  <circle cx="44" cy="32" r="1.2" fill="#fff"/>
  <circle cx="58" cy="32" r="1.2" fill="#fff"/>
  <path d="M44 42 Q50 38 56 42 Q53 48 50 48 Q47 48 44 42 Z" fill="#E8A317" stroke="#9c6500" stroke-width="0.5"/>
  <path d="M46 44 Q50 47 54 44 Q50 49 46 44 Z" fill="#CC8400"/>
  <ellipse cx="50" cy="42.5" rx="0.6" ry="1" fill="#000" opacity="0.3"/>
  <path d="M20 56 Q12 70 18 80 Q26 78 28 70 Q26 60 20 56 Z" fill="#000"/>
  <path d="M80 56 Q88 70 82 80 Q74 78 72 70 Q74 60 80 56 Z" fill="#000"/>
  <ellipse cx="50" cy="58" rx="3" ry="2" fill="#ffb6c1" opacity="0.5"/>
  <ellipse cx="40" cy="64" rx="2.5" ry="1.8" fill="#ffb6c1" opacity="0.4"/>
  <ellipse cx="60" cy="64" rx="2.5" ry="1.8" fill="#ffb6c1" opacity="0.4"/>
</svg>`;

// Windows 11 logo - 4 squares with rounded corners + slight perspective tilt
const WIN11_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="w11g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#50e6ff"/>
      <stop offset="100%" stop-color="#0078d4"/>
    </linearGradient>
  </defs>
  <rect x="3" y="4" width="11" height="11" rx="1" fill="url(#w11g)"/>
  <rect x="17" y="3" width="12" height="12" rx="1" fill="url(#w11g)"/>
  <rect x="3" y="17" width="11" height="11" rx="1" fill="url(#w11g)"/>
  <rect x="17" y="17" width="12" height="12" rx="1" fill="url(#w11g)"/>
</svg>`;

const CURSOR_SVGS: Record<SkinId, string> = {
  classic: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M4 2L4 20L8.5 15.5L12 22L15 20.5L11.5 14L18 14L4 2Z" fill="white" stroke="black" stroke-width="1.5"/></svg>`,
  mint: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M4 2L4 20L8.5 15.5L12 22L15 20.5L11.5 14L18 14L4 2Z" fill="#87cf3e" stroke="#1a472a" stroke-width="1.5"/></svg>`,
  retro: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"><rect x="1" y="1" width="2" height="12" fill="#ffcc00"/><rect x="3" y="3" width="2" height="8" fill="#cc6600"/><rect x="5" y="5" width="4" height="4" fill="#ffcc00"/><rect x="7" y="7" width="4" height="4" fill="#cc6600"/></svg>`,
  neon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><defs><filter id="g"><feGaussianBlur stdDeviation="1"/></filter></defs><path d="M4 2L4 20L8.5 15.5L12 22L15 20.5L11.5 14L18 14L4 2Z" fill="none" stroke="#ff00ff" stroke-width="2" filter="url(#g)"/><path d="M6 6L6 14L9 11" stroke="#a855f7" stroke-width="1.5"/></svg>`,
  tux: TUX_SVG,
  win11: WIN11_SVG,
};

export const SKINS: Skin[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'The original pointer',
    colors: { primary: '#ffffff', secondary: '#000000' },
    cursorData: `data:image/svg+xml,${encodeURIComponent(CURSOR_SVGS.classic)}`,
  },
  {
    id: 'mint',
    name: 'Mint',
    description: 'Fresh Linux Mint style',
    colors: { primary: '#87cf3e', secondary: '#1a472a' },
    cursorData: `data:image/svg+xml,${encodeURIComponent(CURSOR_SVGS.mint)}`,
  },
  {
    id: 'retro',
    name: 'Retro',
    description: 'Pixel-perfect 8-bit',
    colors: { primary: '#ffcc00', secondary: '#cc6600' },
    cursorData: `data:image/svg+xml,${encodeURIComponent(CURSOR_SVGS.retro)}`,
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Cyberpunk glow',
    colors: { primary: '#ff00ff', secondary: '#a855f7' },
    cursorData: `data:image/svg+xml,${encodeURIComponent(CURSOR_SVGS.neon)}`,
  },
  {
    id: 'tux',
    name: 'Tux',
    description: 'The Official Linux Penguin',
    secret: true,
    colors: { primary: '#E8A317', secondary: '#000000' },
    cursorData: `data:image/svg+xml,${encodeURIComponent(TUX_SVG)}`,
  },
  {
    id: 'win11',
    name: 'Windows 11',
    description: 'Fluent design',
    secret: true,
    colors: { primary: '#0078d4', secondary: '#50e6ff' },
    cursorData: `data:image/svg+xml,${encodeURIComponent(WIN11_SVG)}`,
  },
];

export function getSkin(id: SkinId): Skin {
  return SKINS.find(s => s.id === id) || SKINS[0];
}

export function applyCursor(skinId: SkinId) {
  const skin = getSkin(skinId);
  if (skin.cursorData) {
    document.body.style.cursor = `url("${skin.cursorData}") 4 4, auto`;
  }
}

export function resetCursor() {
  document.body.style.cursor = 'auto';
}

function TuxIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 100 100" dangerouslySetInnerHTML={{ __html: TUX_SVG.replace(/<svg[^>]*>|<\/svg>/g, '') }} />;
}

function Win11Icon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" dangerouslySetInnerHTML={{ __html: WIN11_SVG.replace(/<svg[^>]*>|<\/svg>/g, '') }} />;
}

export function CursorIcon({ skinId, size = 32, className = '' }: { skinId: SkinId; size?: number; className?: string }) {
  const skin = getSkin(skinId);

  if (skinId === 'tux') return <TuxIcon size={size} />;
  if (skinId === 'win11') return <Win11Icon size={size} />;

  switch (skinId) {
    case 'classic':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
          <path d="M4 2L4 20L8.5 15.5L12 22L15 20.5L11.5 14L18 14L4 2Z" fill={skin.colors.primary} stroke={skin.colors.secondary} strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      );
    case 'mint':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
          <path d="M4 2L4 20L8.5 15.5L12 22L15 20.5L11.5 14L18 14L4 2Z" fill={skin.colors.primary} stroke={skin.colors.secondary} strokeWidth="1.5" strokeLinejoin="round"/>
          <circle cx="7" cy="8" r="2" fill={skin.colors.secondary} opacity="0.5"/>
        </svg>
      );
    case 'retro':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" className={className} style={{ imageRendering: 'pixelated' }}>
          <rect x="1" y="1" width="2" height="2" fill={skin.colors.primary}/>
          <rect x="1" y="3" width="2" height="2" fill={skin.colors.primary}/>
          <rect x="1" y="5" width="2" height="2" fill={skin.colors.primary}/>
          <rect x="1" y="7" width="2" height="2" fill={skin.colors.primary}/>
          <rect x="1" y="9" width="2" height="2" fill={skin.colors.primary}/>
          <rect x="3" y="3" width="2" height="2" fill={skin.colors.primary}/>
          <rect x="3" y="5" width="2" height="2" fill={skin.colors.secondary}/>
          <rect x="3" y="7" width="2" height="2" fill={skin.colors.primary}/>
          <rect x="5" y="5" width="2" height="2" fill={skin.colors.primary}/>
          <rect x="5" y="7" width="2" height="2" fill={skin.colors.secondary}/>
          <rect x="5" y="9" width="2" height="2" fill={skin.colors.primary}/>
          <rect x="7" y="7" width="2" height="2" fill={skin.colors.primary}/>
          <rect x="7" y="9" width="2" height="2" fill={skin.colors.primary}/>
          <rect x="9" y="9" width="2" height="2" fill={skin.colors.primary}/>
          <rect x="1" y="11" width="2" height="2" fill={skin.colors.primary}/>
          <rect x="3" y="9" width="2" height="2" fill={skin.colors.primary}/>
        </svg>
      );
    case 'neon':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
          <defs>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path d="M4 2L4 20L8.5 15.5L12 22L15 20.5L11.5 14L18 14L4 2Z" fill="transparent" stroke={skin.colors.primary} strokeWidth="2" strokeLinejoin="round" filter="url(#neonGlow)"/>
          <path d="M6 6L6 14L9 11L11 15" fill="none" stroke={skin.colors.secondary} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    default:
      return null;
  }
}

export function CursorMini({ skinId, size = 16 }: { skinId: SkinId; size?: number }) {
  return <CursorIcon skinId={skinId} size={size} />;
}
