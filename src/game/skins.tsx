import { Skin, SkinId } from './types';

// Exact Tux Linux Penguin SVG
const TUX_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 100 100">
  <!-- Body -->
  <ellipse cx="50" cy="65" rx="30" ry="32" fill="#000000"/>
  <!-- White belly -->
  <ellipse cx="50" cy="70" rx="22" ry="26" fill="#ffffff"/>
  <!-- Head -->
  <ellipse cx="50" cy="28" rx="22" ry="20" fill="#000000"/>
  <!-- White face patch -->
  <ellipse cx="50" cy="32" rx="16" ry="14" fill="#ffffff"/>
  <!-- Left eye white -->
  <ellipse cx="42" cy="26" rx="7" ry="9" fill="#ffffff"/>
  <!-- Right eye white -->
  <ellipse cx="58" cy="26" rx="7" ry="9" fill="#ffffff"/>
  <!-- Left pupil -->
  <ellipse cx="43" cy="27" rx="3" ry="5" fill="#000000"/>
  <!-- Right pupil -->
  <ellipse cx="57" cy="27" rx="3" ry="5" fill="#000000"/>
  <!-- Left eye shine -->
  <circle cx="44" cy="25" r="1.5" fill="#ffffff"/>
  <!-- Right eye shine -->
  <circle cx="58" cy="25" r="1.5" fill="#ffffff"/>
  <!-- Beak top -->
  <path d="M42 36 Q50 32 58 36 Q50 42 42 36" fill="#E8A317"/>
  <!-- Beak bottom -->
  <path d="M44 38 Q50 44 56 38 Q50 40 44 38" fill="#CC8400"/>
  <!-- Left foot -->
  <ellipse cx="38" cy="97" rx="10" ry="4" fill="#E8A317"/>
  <!-- Right foot -->
  <ellipse cx="62" cy="97" rx="10" ry="4" fill="#E8A317"/>
  <!-- Left wing -->
  <path d="M20 55 Q15 70 22 85 Q28 75 25 60 Z" fill="#000000"/>
  <!-- Right wing -->
  <path d="M80 55 Q85 70 78 85 Q72 75 75 60 Z" fill="#000000"/>
</svg>`;

const CURSOR_SVGS: Record<SkinId, string> = {
  classic: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M4 2L4 20L8.5 15.5L12 22L15 20.5L11.5 14L18 14L4 2Z" fill="white" stroke="black" stroke-width="1.5"/></svg>`,
  mint: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M4 2L4 20L8.5 15.5L12 22L15 20.5L11.5 14L18 14L4 2Z" fill="#87cf3e" stroke="#1a472a" stroke-width="1.5"/></svg>`,
  retro: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"><rect x="1" y="1" width="2" height="12" fill="#ffcc00"/><rect x="3" y="3" width="2" height="8" fill="#cc6600"/><rect x="5" y="5" width="4" height="4" fill="#ffcc00"/><rect x="7" y="7" width="4" height="4" fill="#cc6600"/></svg>`,
  neon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><defs><filter id="g"><feGaussianBlur stdDeviation="1"/></filter></defs><path d="M4 2L4 20L8.5 15.5L12 22L15 20.5L11.5 14L18 14L4 2Z" fill="none" stroke="#ff00ff" stroke-width="2" filter="url(#g)"/><path d="M6 6L6 14L9 11" stroke="#00ffff" stroke-width="1.5"/></svg>`,
  tux: TUX_SVG,
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
    colors: { primary: '#ff00ff', secondary: '#00ffff' },
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

// Exact Tux SVG Component
function TuxIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Body */}
      <ellipse cx="50" cy="65" rx="30" ry="32" fill="#000000"/>
      {/* White belly */}
      <ellipse cx="50" cy="70" rx="22" ry="26" fill="#ffffff"/>
      {/* Head */}
      <ellipse cx="50" cy="28" rx="22" ry="20" fill="#000000"/>
      {/* White face patch */}
      <ellipse cx="50" cy="32" rx="16" ry="14" fill="#ffffff"/>
      {/* Left eye white */}
      <ellipse cx="42" cy="26" rx="7" ry="9" fill="#ffffff"/>
      {/* Right eye white */}
      <ellipse cx="58" cy="26" rx="7" ry="9" fill="#ffffff"/>
      {/* Left pupil */}
      <ellipse cx="43" cy="27" rx="3" ry="5" fill="#000000"/>
      {/* Right pupil */}
      <ellipse cx="57" cy="27" rx="3" ry="5" fill="#000000"/>
      {/* Left eye shine */}
      <circle cx="44" cy="25" r="1.5" fill="#ffffff"/>
      {/* Right eye shine */}
      <circle cx="58" cy="25" r="1.5" fill="#ffffff"/>
      {/* Beak top */}
      <path d="M42 36 Q50 32 58 36 Q50 42 42 36" fill="#E8A317"/>
      {/* Beak bottom */}
      <path d="M44 38 Q50 44 56 38 Q50 40 44 38" fill="#CC8400"/>
      {/* Left foot */}
      <ellipse cx="38" cy="97" rx="10" ry="4" fill="#E8A317"/>
      {/* Right foot */}
      <ellipse cx="62" cy="97" rx="10" ry="4" fill="#E8A317"/>
      {/* Left wing */}
      <path d="M20 55 Q15 70 22 85 Q28 75 25 60 Z" fill="#000000"/>
      {/* Right wing */}
      <path d="M80 55 Q85 70 78 85 Q72 75 75 60 Z" fill="#000000"/>
    </svg>
  );
}

export function CursorIcon({ skinId, size = 32, className = '' }: { skinId: SkinId; size?: number; className?: string }) {
  const skin = getSkin(skinId);
  
  if (skinId === 'tux') {
    return <TuxIcon size={size} />;
  }
  
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
