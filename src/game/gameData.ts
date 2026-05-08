import { ShopItem, SabotageAbility, LobbySettings } from './types';

// Helper to create items quickly
function ci(id: string, name: string, desc: string, cat: ShopItem['category'], base: number, growth: number, effect: ShopItem['effect'], val: number, tier: number): ShopItem {
  return { id, name, description: desc, category: cat, baseCost: base, costGrowth: growth, effect, effectValue: val, tier };
}

// Rebalanced v3 - friendlier costs, gentler growth, stronger effects
export const SHOP_ITEMS: ShopItem[] = [
  // ── CLICK POWER ──
  ci('c01', 'Firm Grip', '+1 per click', 'click', 50, 1.18, 'clickPower', 1, 1),
  ci('c02', 'Callused Hands', '+2 per click', 'click', 200, 1.18, 'clickPower', 2, 1),
  ci('c03', 'Steel Fingers', '+3 per click', 'click', 700, 1.19, 'clickPower', 3, 1),
  ci('c04', 'Precision Tap', '+5 per click', 'click', 2200, 1.19, 'clickPower', 5, 2),
  ci('c05', 'Heavy Hitter', '+8 per click', 'click', 6500, 1.20, 'clickPower', 8, 2),
  ci('c06', 'Reinforced Joints', '+12 per click', 'click', 18000, 1.20, 'clickPower', 12, 2),
  ci('c07', 'Carbon Knuckles', '+20 per click', 'click', 50000, 1.21, 'clickPower', 20, 3),
  ci('c08', 'Pneumatic Press', '+35 per click', 'click', 140000, 1.21, 'clickPower', 35, 3),
  ci('c09', 'Hydraulic Driver', '+60 per click', 'click', 400000, 1.22, 'clickPower', 60, 4),
  ci('c10', 'Seismic Punch', '+100 per click', 'click', 1100000, 1.22, 'clickPower', 100, 4),
  ci('c11', 'Titanium Fist', '+170 per click', 'click', 3200000, 1.23, 'clickPower', 170, 5),
  ci('c12', 'Mag-Lev Striker', '+280 per click', 'click', 9000000, 1.23, 'clickPower', 280, 5),
  ci('c13', 'Piston Array', '+450 per click', 'click', 26000000, 1.24, 'clickPower', 450, 6),
  ci('c14', 'Force Amplifier', '+750 per click', 'click', 75000000, 1.24, 'clickPower', 750, 6),
  ci('c15', 'Kinetic Core', '+1.2K per click', 'click', 220000000, 1.25, 'clickPower', 1200, 7),
  ci('c16', 'Warp Hammer', '+2K per click', 'click', 650000000, 1.25, 'clickPower', 2000, 7),
  ci('c17', 'Nova Strike', '+3.5K per click', 'click', 2000000000, 1.26, 'clickPower', 3500, 8),
  ci('c18', 'Quasar Tap', '+6K per click', 'click', 6000000000, 1.26, 'clickPower', 6000, 8),
  ci('c19', 'Singularity Press', '+10K per click', 'click', 18000000000, 1.27, 'clickPower', 10000, 9),
  ci('c20', 'Big Bang Blow', '+18K per click', 'click', 55000000000, 1.27, 'clickPower', 18000, 10),

  // ── AUTO CLICKERS ──
  ci('a01', 'Desk Fan', '+0.5/s', 'auto', 75, 1.18, 'cps', 0.5, 1),
  ci('a02', 'Metronome', '+1/s', 'auto', 250, 1.18, 'cps', 1, 1),
  ci('a03', 'Sewing Machine', '+2/s', 'auto', 800, 1.19, 'cps', 2, 1),
  ci('a04', 'Typewriter', '+4/s', 'auto', 2500, 1.19, 'cps', 4, 2),
  ci('a05', 'Assembly Arm', '+7/s', 'auto', 7500, 1.20, 'cps', 7, 2),
  ci('a06', 'Conveyor Belt', '+12/s', 'auto', 21000, 1.20, 'cps', 12, 2),
  ci('a07', 'Drill Press', '+20/s', 'auto', 60000, 1.21, 'cps', 20, 3),
  ci('a08', 'CNC Machine', '+35/s', 'auto', 170000, 1.21, 'cps', 35, 3),
  ci('a09', 'Turbine Engine', '+60/s', 'auto', 480000, 1.22, 'cps', 60, 4),
  ci('a10', 'Factory Floor', '+100/s', 'auto', 1400000, 1.22, 'cps', 100, 4),
  ci('a11', 'Power Plant', '+170/s', 'auto', 4000000, 1.23, 'cps', 170, 5),
  ci('a12', 'Reactor Core', '+280/s', 'auto', 12000000, 1.23, 'cps', 280, 5),
  ci('a13', 'Fusion Cell', '+450/s', 'auto', 35000000, 1.24, 'cps', 450, 6),
  ci('a14', 'Antimatter Tap', '+750/s', 'auto', 100000000, 1.24, 'cps', 750, 6),
  ci('a15', 'Dark Energy Siphon', '+1.2K/s', 'auto', 300000000, 1.25, 'cps', 1200, 7),
  ci('a16', 'Stellar Harvester', '+2K/s', 'auto', 900000000, 1.25, 'cps', 2000, 7),
  ci('a17', 'Galactic Forge', '+3.5K/s', 'auto', 2700000000, 1.26, 'cps', 3500, 8),
  ci('a18', 'Cosmic Mill', '+6K/s', 'auto', 8000000000, 1.26, 'cps', 6000, 8),
  ci('a19', 'Dimensional Rift', '+10K/s', 'auto', 24000000000, 1.27, 'cps', 10000, 9),
  ci('a20', 'Infinity Engine', '+18K/s', 'auto', 75000000000, 1.27, 'cps', 18000, 10),

  // ── INVESTMENTS ── modest passive % growth
  ci('i01', 'Savings Account', '+0.05%/s', 'invest', 5000, 1.55, 'investRate', 0.0005, 1),
  ci('i02', 'Certificate', '+0.08%/s', 'invest', 20000, 1.60, 'investRate', 0.0008, 2),
  ci('i03', 'Bond Portfolio', '+0.1%/s', 'invest', 80000, 1.65, 'investRate', 0.001, 2),
  ci('i04', 'Index Fund', '+0.13%/s', 'invest', 300000, 1.70, 'investRate', 0.0013, 3),
  ci('i05', 'Hedge Fund', '+0.17%/s', 'invest', 1100000, 1.75, 'investRate', 0.0017, 3),
  ci('i06', 'Venture Capital', '+0.22%/s', 'invest', 4500000, 1.80, 'investRate', 0.0022, 4),
  ci('i07', 'Private Equity', '+0.28%/s', 'invest', 18000000, 1.85, 'investRate', 0.0028, 4),
  ci('i08', 'Crypto Mining', '+0.35%/s', 'invest', 70000000, 1.90, 'investRate', 0.0035, 5),
  ci('i09', 'Real Estate Empire', '+0.45%/s', 'invest', 300000000, 1.95, 'investRate', 0.0045, 6),
  ci('i10', 'Global Conglomerate', '+0.6%/s', 'invest', 1200000000, 2.00, 'investRate', 0.006, 7),
  ci('i11', 'Space Mining Corp', '+0.8%/s', 'invest', 5000000000, 2.05, 'investRate', 0.008, 8),
  ci('i12', 'Multiverse Holdings', '+1.1%/s', 'invest', 22000000000, 2.10, 'investRate', 0.011, 9),

  // ── SPECIAL / HYBRID ──
  ci('s01', 'Lucky Penny', '+2 click', 'special', 150, 1.20, 'clickPower', 2, 1),
  ci('s02', 'Wind-Up Toy', '+1/s', 'special', 250, 1.20, 'cps', 1, 1),
  ci('s03', 'Copper Wire', '+2/s', 'special', 700, 1.20, 'cps', 2, 1),
  ci('s04', 'Magnet Board', '+5 click', 'special', 2000, 1.21, 'clickPower', 5, 2),
  ci('s05', 'Gear Train', '+5/s', 'special', 5500, 1.21, 'cps', 5, 2),
  ci('s06', 'Spring Loader', '+10 click', 'special', 14000, 1.22, 'clickPower', 10, 2),
  ci('s07', 'Voltage Regulator', '+10/s', 'special', 38000, 1.22, 'cps', 10, 3),
  ci('s08', 'Circuit Board', '+20 click', 'special', 100000, 1.23, 'clickPower', 20, 3),
  ci('s09', 'Motor Block', '+25/s', 'special', 280000, 1.23, 'cps', 25, 3),
  ci('s10', 'Crankshaft', '+40 click', 'special', 800000, 1.24, 'clickPower', 40, 4),
  ci('s11', 'Transformer', '+50/s', 'special', 2200000, 1.24, 'cps', 50, 4),
  ci('s12', 'Heat Sink', '+85/s', 'special', 6000000, 1.25, 'cps', 85, 5),
  ci('s13', 'Supercharger', '+120 click', 'special', 17000000, 1.25, 'clickPower', 120, 5),
  ci('s14', 'Turbo Manifold', '+140/s', 'special', 50000000, 1.26, 'cps', 140, 5),
  ci('s15', 'Nitro Injection', '+220 click', 'special', 150000000, 1.26, 'clickPower', 220, 6),
  ci('s16', 'Plasma Coil', '+260/s', 'special', 450000000, 1.27, 'cps', 260, 6),
  ci('s17', 'Ion Thruster', '+450 click', 'special', 1300000000, 1.27, 'clickPower', 450, 7),
  ci('s18', 'Wormhole Tap', '+600/s', 'special', 4000000000, 1.28, 'cps', 600, 7),
  ci('s19', 'Nebula Core', '+900 click', 'special', 13000000000, 1.28, 'clickPower', 900, 8),
  ci('s20', 'Pulsar Beacon', '+1.4K/s', 'special', 45000000000, 1.29, 'cps', 1400, 9),
];

// Sabotages — sorted lowest → highest cost
export const SABOTAGE_ABILITIES: SabotageAbility[] = [
  { id: 'smokeBomb', name: 'Smoke Screen', description: 'Obscure their button', baseCost: 4500, duration: 5, cooldown: 15 },
  { id: 'frozenGear', name: 'System Freeze', description: 'Stop their auto-income', baseCost: 18000, duration: 5, cooldown: 20 },
  { id: 'inflationSpike', name: 'Price Surge', description: 'Double their costs', baseCost: 30000, duration: 8, cooldown: 25 },
  { id: 'stunLock', name: 'Input Lock', description: 'Disable their clicking', baseCost: 75000, duration: 3, cooldown: 45 },
  { id: 'taxman', name: 'Tax Collector', description: 'Steal % of their bank', baseCost: 800000, duration: 0, cooldown: 30 },
  { id: 'foxy', name: 'FOXY JUMPSCARE', description: 'TERRIFYING JUMPSCARE', baseCost: 1500000, duration: 3, cooldown: 120 },
  { id: 'goldenFreddy', name: 'GOLDEN FREDDY', description: 'Mysterious jumpscare on their screen', baseCost: 5000000, duration: 4, cooldown: 180 },
].sort((a, b) => a.baseCost - b.baseCost);

export const DIFFICULTY_PRESETS: Record<string, Partial<LobbySettings>> = {
  sprint: { targetValue: 250_000, timeLimit: 180 },
  marathon: { targetValue: 250_000_000, timeLimit: 600 },
  endurance: { targetValue: 250_000_000_000_000, timeLimit: 2700 },
};

export const PLAYER_COLORS = [
  '#a855f7', '#ff0080', '#00ff88', '#ffaa00', '#ff4444', '#aa66ff',
  '#7c3aed', '#ff6600', '#44ffaa', '#ff2266', '#8855ff', '#c084fc',
];

export const TEAM_COLORS = {
  purple: '#a855f7',
  pink: '#ff0080',
  green: '#00ff88',
  orange: '#ffaa00',
};

export type TeamId = 'purple' | 'pink' | 'green' | 'orange' | 'none';

export function getItemCost(item: ShopItem, owned: number, growthMod: number = 1): number {
  const growth = 1 + (item.costGrowth - 1) * growthMod;
  return Math.floor(item.baseCost * Math.pow(growth, owned));
}

export function formatNumber(n: number): string {
  if (n < 0) return '-' + formatNumber(-n);
  if (n < 1000) return Math.floor(n).toString();
  const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];
  const tier = Math.min(Math.floor(Math.log10(Math.abs(n)) / 3), units.length - 1);
  const scaled = n / Math.pow(10, tier * 3);
  return scaled.toFixed(scaled < 10 ? 2 : scaled < 100 ? 1 : 0) + units[tier];
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function getSabotageCost(sab: SabotageAbility, _settings: LobbySettings): number {
  return sab.baseCost;
}

export function getSabotageDuration(sab: SabotageAbility, settings: LobbySettings): number {
  switch (sab.id) {
    case 'smokeBomb': return settings.smokeDuration;
    case 'frozenGear': return settings.freezeDuration;
    case 'stunLock': return settings.stunDuration;
    case 'inflationSpike': return settings.inflationDuration;
    case 'foxy': return 3;
    default: return sab.duration;
  }
}

// Foxy jumpscare audio - 8-bit scream sound
export function playFoxyScream() {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const duration = 0.8;
  for (let i = 0; i < 5; i++) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200 + Math.random() * 400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 600, audioCtx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + duration);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + i * 0.05);
    osc.stop(audioCtx.currentTime + duration);
  }
  const noise = audioCtx.createOscillator();
  const noiseGain = audioCtx.createGain();
  noise.type = 'square';
  noise.frequency.setValueAtTime(150, audioCtx.currentTime);
  noiseGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
  noise.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noise.start();
  noise.stop(audioCtx.currentTime + 0.3);
}

// CHAOS EVENTS — fired every ~30s when chaos mode is on
export type ChaosEventId =
  | 'goldenFreddy'
  | 'doubleClick'
  | 'priceCrash'
  | 'autoBoost'
  | 'frenzy'
  | 'blackout'
  | 'taxStorm'
  | 'meteor'
  | 'goldRush'
  | 'powerSurge'
  | 'marketDip'
  | 'bonusRain';

export interface ChaosEvent {
  id: ChaosEventId;
  name: string;
  message: string;
  duration: number;
}

export const CHAOS_EVENTS: ChaosEvent[] = [
  { id: 'goldenFreddy', name: 'GOLDEN FREDDY', message: 'IT\'S ME.', duration: 4 },
  { id: 'doubleClick', name: 'Double Tap', message: 'Click power x2 for 10s!', duration: 10 },
  { id: 'priceCrash', name: 'Price Crash', message: 'Shop costs -30% for 15s!', duration: 15 },
  { id: 'autoBoost', name: 'Overdrive', message: 'Auto-income x2 for 10s!', duration: 10 },
  { id: 'frenzy', name: 'Click Frenzy', message: 'Everyone gets +50% click for 8s!', duration: 8 },
  { id: 'blackout', name: 'Blackout', message: 'Lights out for 5 seconds!', duration: 5 },
  { id: 'taxStorm', name: 'Tax Storm', message: 'Leader loses 5% of bank!', duration: 3 },
  { id: 'meteor', name: 'Meteor Strike', message: 'Everyone loses 10% of bank!', duration: 3 },
  { id: 'goldRush', name: 'Gold Rush', message: 'Auto-income x3 for 8s!', duration: 8 },
  { id: 'powerSurge', name: 'Power Surge', message: 'Click power x3 for 5s!', duration: 5 },
  { id: 'marketDip', name: 'Market Dip', message: 'Auto-income halved for 10s!', duration: 10 },
  { id: 'bonusRain', name: 'Bonus Rain', message: 'Everyone +15% bank!', duration: 3 },
];

// ── SOUND EFFECTS LIBRARY ──
let _audioCtx: AudioContext | null = null;
function ctx(): AudioContext {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return _audioCtx;
}

export function playClickSfx() {
  try {
    const a = ctx();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(880, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, a.currentTime + 0.05);
    g.gain.setValueAtTime(0.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.08);
    o.connect(g); g.connect(a.destination);
    o.start(); o.stop(a.currentTime + 0.08);
  } catch (_) {}
}

export function playPurchaseSfx() {
  try {
    const a = ctx();
    [523, 659, 784].forEach((f, i) => {
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.001, a.currentTime + i * 0.06);
      g.gain.exponentialRampToValueAtTime(0.12, a.currentTime + i * 0.06 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + i * 0.06 + 0.18);
      o.connect(g); g.connect(a.destination);
      o.start(a.currentTime + i * 0.06);
      o.stop(a.currentTime + i * 0.06 + 0.2);
    });
  } catch (_) {}
}

export function playSabotageSfx() {
  try {
    const a = ctx();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(220, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(55, a.currentTime + 0.4);
    g.gain.setValueAtTime(0.15, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.4);
    o.connect(g); g.connect(a.destination);
    o.start(); o.stop(a.currentTime + 0.4);
  } catch (_) {}
}

export function playChaosSfx() {
  try {
    const a = ctx();
    [200, 300, 500, 800].forEach((f, i) => {
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(f, a.currentTime + i * 0.04);
      g.gain.setValueAtTime(0.08, a.currentTime + i * 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + i * 0.04 + 0.12);
      o.connect(g); g.connect(a.destination);
      o.start(a.currentTime + i * 0.04);
      o.stop(a.currentTime + i * 0.04 + 0.13);
    });
  } catch (_) {}
}

export function playWinSfx() {
  try {
    const a = ctx();
    [523, 659, 784, 1047].forEach((f, i) => {
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.001, a.currentTime + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.18, a.currentTime + i * 0.12 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + i * 0.12 + 0.4);
      o.connect(g); g.connect(a.destination);
      o.start(a.currentTime + i * 0.12);
      o.stop(a.currentTime + i * 0.12 + 0.42);
    });
  } catch (_) {}
}

// Mysterious Golden Freddy — low rumble + dissonant drone + whispered "it's me"
export function playGoldenFreddySfx() {
  try {
    const a = ctx();
    // Deep sub rumble
    const sub = a.createOscillator();
    const subG = a.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(45, a.currentTime);
    sub.frequency.linearRampToValueAtTime(30, a.currentTime + 4);
    subG.gain.setValueAtTime(0.001, a.currentTime);
    subG.gain.linearRampToValueAtTime(0.35, a.currentTime + 1.5);
    subG.gain.linearRampToValueAtTime(0.0, a.currentTime + 4);
    sub.connect(subG); subG.connect(a.destination);
    sub.start(); sub.stop(a.currentTime + 4);

    // Dissonant detuned drones
    [110, 116.5, 174].forEach((f, i) => {
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(f, a.currentTime);
      o.frequency.linearRampToValueAtTime(f * 0.5, a.currentTime + 4);
      g.gain.setValueAtTime(0.001, a.currentTime + i * 0.2);
      g.gain.linearRampToValueAtTime(0.05, a.currentTime + 1 + i * 0.2);
      g.gain.linearRampToValueAtTime(0.0, a.currentTime + 4);
      // gentle filter via biquad
      const bq = a.createBiquadFilter();
      bq.type = 'lowpass';
      bq.frequency.value = 600;
      o.connect(bq); bq.connect(g); g.connect(a.destination);
      o.start(); o.stop(a.currentTime + 4);
    });

    // Whisper noise
    const buf = a.createBuffer(1, a.sampleRate * 3.5, a.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const env = Math.sin((i / data.length) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.3;
    }
    const noise = a.createBufferSource();
    noise.buffer = buf;
    const nFilt = a.createBiquadFilter();
    nFilt.type = 'bandpass';
    nFilt.frequency.value = 1500;
    nFilt.Q.value = 0.7;
    const nGain = a.createGain();
    nGain.gain.value = 0.18;
    noise.connect(nFilt); nFilt.connect(nGain); nGain.connect(a.destination);
    noise.start(a.currentTime + 0.5);

    // Single creepy bell hit at end
    setTimeout(() => {
      try {
        const a2 = ctx();
        const o = a2.createOscillator();
        const g = a2.createGain();
        o.type = 'sine';
        o.frequency.value = 196;
        g.gain.setValueAtTime(0.4, a2.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, a2.currentTime + 1.5);
        o.connect(g); g.connect(a2.destination);
        o.start(); o.stop(a2.currentTime + 1.5);
      } catch (_) {}
    }, 2800);
  } catch (_) {}
}
