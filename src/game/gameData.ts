import { ShopItem, SabotageAbility, LobbySettings } from './types';

// Helper to create items quickly
function ci(id: string, name: string, desc: string, cat: ShopItem['category'], base: number, growth: number, effect: ShopItem['effect'], val: number, tier: number): ShopItem {
  return { id, name, description: desc, category: cat, baseCost: base, costGrowth: growth, effect, effectValue: val, tier };
}

// HEAVILY NERFED v2 - 3x more expensive, faster cost growth, ~half effect values
export const SHOP_ITEMS: ShopItem[] = [
  // ── CLICK POWER ──
  ci('c01', 'Firm Grip', '+1 per click', 'click', 300, 1.30, 'clickPower', 1, 1),
  ci('c02', 'Callused Hands', '+1 per click', 'click', 1100, 1.31, 'clickPower', 1, 1),
  ci('c03', 'Steel Fingers', '+1 per click', 'click', 2800, 1.32, 'clickPower', 1, 1),
  ci('c04', 'Precision Tap', '+2 per click', 'click', 8000, 1.32, 'clickPower', 2, 2),
  ci('c05', 'Heavy Hitter', '+3 per click', 'click', 22000, 1.33, 'clickPower', 3, 2),
  ci('c06', 'Reinforced Joints', '+4 per click', 'click', 60000, 1.33, 'clickPower', 4, 2),
  ci('c07', 'Carbon Knuckles', '+6 per click', 'click', 160000, 1.34, 'clickPower', 6, 3),
  ci('c08', 'Pneumatic Press', '+10 per click', 'click', 450000, 1.34, 'clickPower', 10, 3),
  ci('c09', 'Hydraulic Driver', '+15 per click', 'click', 1300000, 1.35, 'clickPower', 15, 4),
  ci('c10', 'Seismic Punch', '+25 per click', 'click', 4000000, 1.35, 'clickPower', 25, 4),
  ci('c11', 'Titanium Fist', '+40 per click', 'click', 12000000, 1.36, 'clickPower', 40, 5),
  ci('c12', 'Mag-Lev Striker', '+65 per click', 'click', 35000000, 1.36, 'clickPower', 65, 5),
  ci('c13', 'Piston Array', '+100 per click', 'click', 100000000, 1.37, 'clickPower', 100, 6),
  ci('c14', 'Force Amplifier', '+170 per click', 'click', 300000000, 1.37, 'clickPower', 170, 6),
  ci('c15', 'Kinetic Core', '+300 per click', 'click', 1000000000, 1.38, 'clickPower', 300, 7),
  ci('c16', 'Warp Hammer', '+500 per click', 'click', 3500000000, 1.38, 'clickPower', 500, 7),
  ci('c17', 'Nova Strike', '+750 per click', 'click', 12000000000, 1.39, 'clickPower', 750, 8),
  ci('c18', 'Quasar Tap', '+1.2K per click', 'click', 40000000000, 1.39, 'clickPower', 1200, 8),
  ci('c19', 'Singularity Press', '+2K per click', 'click', 140000000000, 1.40, 'clickPower', 2000, 9),
  ci('c20', 'Big Bang Blow', '+3.5K per click', 'click', 500000000000, 1.40, 'clickPower', 3500, 10),

  // ── AUTO CLICKERS ──
  ci('a01', 'Desk Fan', '+0.2/s', 'auto', 450, 1.30, 'cps', 0.2, 1),
  ci('a02', 'Metronome', '+0.3/s', 'auto', 1300, 1.31, 'cps', 0.3, 1),
  ci('a03', 'Sewing Machine', '+0.5/s', 'auto', 3200, 1.31, 'cps', 0.5, 1),
  ci('a04', 'Typewriter', '+1/s', 'auto', 9500, 1.32, 'cps', 1, 2),
  ci('a05', 'Assembly Arm', '+1.5/s', 'auto', 25000, 1.32, 'cps', 1.5, 2),
  ci('a06', 'Conveyor Belt', '+2.5/s', 'auto', 70000, 1.33, 'cps', 2.5, 2),
  ci('a07', 'Drill Press', '+4/s', 'auto', 190000, 1.33, 'cps', 4, 3),
  ci('a08', 'CNC Machine', '+7/s', 'auto', 540000, 1.34, 'cps', 7, 3),
  ci('a09', 'Turbine Engine', '+12/s', 'auto', 1600000, 1.34, 'cps', 12, 4),
  ci('a10', 'Factory Floor', '+20/s', 'auto', 4800000, 1.35, 'cps', 20, 4),
  ci('a11', 'Power Plant', '+35/s', 'auto', 14000000, 1.35, 'cps', 35, 5),
  ci('a12', 'Reactor Core', '+60/s', 'auto', 45000000, 1.36, 'cps', 60, 5),
  ci('a13', 'Fusion Cell', '+100/s', 'auto', 140000000, 1.36, 'cps', 100, 6),
  ci('a14', 'Antimatter Tap', '+180/s', 'auto', 450000000, 1.37, 'cps', 180, 6),
  ci('a15', 'Dark Energy Siphon', '+300/s', 'auto', 1400000000, 1.37, 'cps', 300, 7),
  ci('a16', 'Stellar Harvester', '+500/s', 'auto', 4500000000, 1.38, 'cps', 500, 7),
  ci('a17', 'Galactic Forge', '+750/s', 'auto', 15000000000, 1.38, 'cps', 750, 8),
  ci('a18', 'Cosmic Mill', '+1.2K/s', 'auto', 50000000000, 1.39, 'cps', 1200, 8),
  ci('a19', 'Dimensional Rift', '+2K/s', 'auto', 170000000000, 1.39, 'cps', 2000, 9),
  ci('a20', 'Infinity Engine', '+3.5K/s', 'auto', 600000000000, 1.40, 'cps', 3500, 10),

  // ── INVESTMENTS ── lower rates, much more expensive
  ci('i01', 'Savings Account', '+0.02%/s', 'invest', 15000, 1.70, 'investRate', 0.0002, 1),
  ci('i02', 'Certificate', '+0.04%/s', 'invest', 60000, 1.75, 'investRate', 0.0004, 2),
  ci('i03', 'Bond Portfolio', '+0.05%/s', 'invest', 240000, 1.80, 'investRate', 0.0005, 2),
  ci('i04', 'Index Fund', '+0.06%/s', 'invest', 900000, 1.85, 'investRate', 0.0006, 3),
  ci('i05', 'Hedge Fund', '+0.08%/s', 'invest', 3600000, 1.90, 'investRate', 0.0008, 3),
  ci('i06', 'Venture Capital', '+0.1%/s', 'invest', 15000000, 1.95, 'investRate', 0.001, 4),
  ci('i07', 'Private Equity', '+0.12%/s', 'invest', 60000000, 2.00, 'investRate', 0.0012, 4),
  ci('i08', 'Crypto Mining', '+0.15%/s', 'invest', 240000000, 2.05, 'investRate', 0.0015, 5),
  ci('i09', 'Real Estate Empire', '+0.18%/s', 'invest', 1100000000, 2.10, 'investRate', 0.0018, 6),
  ci('i10', 'Global Conglomerate', '+0.22%/s', 'invest', 4500000000, 2.15, 'investRate', 0.0022, 7),
  ci('i11', 'Space Mining Corp', '+0.28%/s', 'invest', 21000000000, 2.20, 'investRate', 0.0028, 8),
  ci('i12', 'Multiverse Holdings', '+0.4%/s', 'invest', 100000000000, 2.30, 'investRate', 0.004, 9),

  // ── SPECIAL / HYBRID ──
  ci('s01', 'Lucky Penny', '+1 click', 'special', 750, 1.32, 'clickPower', 1, 1),
  ci('s02', 'Wind-Up Toy', '+0.3/s', 'special', 1100, 1.32, 'cps', 0.3, 1),
  ci('s03', 'Copper Wire', '+0.5/s', 'special', 2400, 1.32, 'cps', 0.5, 1),
  ci('s04', 'Magnet Board', '+2 click', 'special', 7000, 1.33, 'clickPower', 2, 2),
  ci('s05', 'Gear Train', '+1.5/s', 'special', 17000, 1.33, 'cps', 1.5, 2),
  ci('s06', 'Spring Loader', '+3 click', 'special', 45000, 1.34, 'clickPower', 3, 2),
  ci('s07', 'Voltage Regulator', '+3/s', 'special', 120000, 1.34, 'cps', 3, 3),
  ci('s08', 'Circuit Board', '+5 click', 'special', 320000, 1.35, 'clickPower', 5, 3),
  ci('s09', 'Motor Block', '+8/s', 'special', 900000, 1.35, 'cps', 8, 3),
  ci('s10', 'Crankshaft', '+10 click', 'special', 2500000, 1.36, 'clickPower', 10, 4),
  ci('s11', 'Transformer', '+15/s', 'special', 7000000, 1.36, 'cps', 15, 4),
  ci('s12', 'Heat Sink', '+25/s', 'special', 20000000, 1.37, 'cps', 25, 5),
  ci('s13', 'Supercharger', '+30 click', 'special', 55000000, 1.37, 'clickPower', 30, 5),
  ci('s14', 'Turbo Manifold', '+40/s', 'special', 170000000, 1.38, 'cps', 40, 5),
  ci('s15', 'Nitro Injection', '+60 click', 'special', 500000000, 1.38, 'clickPower', 60, 6),
  ci('s16', 'Plasma Coil', '+75/s', 'special', 1600000000, 1.39, 'cps', 75, 6),
  ci('s17', 'Ion Thruster', '+125 click', 'special', 5000000000, 1.39, 'clickPower', 125, 7),
  ci('s18', 'Wormhole Tap', '+180/s', 'special', 16000000000, 1.40, 'cps', 180, 7),
  ci('s19', 'Nebula Core', '+250 click', 'special', 55000000000, 1.40, 'clickPower', 250, 8),
  ci('s20', 'Pulsar Beacon', '+400/s', 'special', 180000000000, 1.41, 'cps', 400, 9),
];

export const SABOTAGE_ABILITIES: SabotageAbility[] = [
  { id: 'smokeBomb', name: 'Smoke Screen', description: 'Obscure their button', baseCost: 4500, duration: 5, cooldown: 15 },
  { id: 'taxman', name: 'Tax Collector', description: 'Steal % of their bank', baseCost: 800000, duration: 0, cooldown: 30 },
  { id: 'frozenGear', name: 'System Freeze', description: 'Stop their auto-income', baseCost: 18000, duration: 5, cooldown: 20 },
  { id: 'inflationSpike', name: 'Price Surge', description: 'Double their costs', baseCost: 30000, duration: 8, cooldown: 25 },
  { id: 'stunLock', name: 'Input Lock', description: 'Disable their clicking', baseCost: 75000, duration: 3, cooldown: 45 },
  { id: 'foxy', name: 'FOXY JUMPSCARE', description: 'TERRIFYING JUMPSCARE', baseCost: 1500000, duration: 3, cooldown: 120 },
  { id: 'goldenFreddy', name: 'GOLDEN FREDDY', description: 'Mysterious jumpscare on their screen', baseCost: 5000000, duration: 4, cooldown: 180 },
];

export const DIFFICULTY_PRESETS: Record<string, Partial<LobbySettings>> = {
  sprint: { targetValue: 1_000_000, timeLimit: 180 },
  marathon: { targetValue: 1_000_000_000, timeLimit: 600 },
  endurance: { targetValue: 1_000_000_000_000_000, timeLimit: 2700 },
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
  | 'taxStorm';

export interface ChaosEvent {
  id: ChaosEventId;
  name: string;
  message: string;
  duration: number; // seconds (visual)
}

export const CHAOS_EVENTS: ChaosEvent[] = [
  { id: 'goldenFreddy', name: 'GOLDEN FREDDY', message: 'IT\'S ME.', duration: 4 },
  { id: 'doubleClick', name: 'Double Tap', message: 'Click power x2 for 10s!', duration: 10 },
  { id: 'priceCrash', name: 'Price Crash', message: 'Shop costs -30% for 15s!', duration: 15 },
  { id: 'autoBoost', name: 'Overdrive', message: 'Auto-income x2 for 10s!', duration: 10 },
  { id: 'frenzy', name: 'Click Frenzy', message: 'Everyone gets +50% click for 8s!', duration: 8 },
  { id: 'blackout', name: 'Blackout', message: 'Lights out for 5 seconds!', duration: 5 },
  { id: 'taxStorm', name: 'Tax Storm', message: 'Leader loses 5% of bank!', duration: 3 },
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
