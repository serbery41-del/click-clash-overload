import { ShopItem, SabotageAbility, LobbySettings } from './types';

// Helper to create items quickly
function ci(id: string, name: string, desc: string, cat: ShopItem['category'], base: number, growth: number, effect: ShopItem['effect'], val: number, tier: number): ShopItem {
  return { id, name, description: desc, category: cat, baseCost: base, costGrowth: growth, effect, effectValue: val, tier };
}

// HEAVILY NERFED - expensive, slow progression
export const SHOP_ITEMS: ShopItem[] = [
  // ── CLICK POWER ──
  ci('c01', 'Firm Grip', '+1 per click', 'click', 100, 1.22, 'clickPower', 1, 1),
  ci('c02', 'Callused Hands', '+1 per click', 'click', 350, 1.23, 'clickPower', 1, 1),
  ci('c03', 'Steel Fingers', '+2 per click', 'click', 900, 1.24, 'clickPower', 2, 1),
  ci('c04', 'Precision Tap', '+3 per click', 'click', 2500, 1.24, 'clickPower', 3, 2),
  ci('c05', 'Heavy Hitter', '+5 per click', 'click', 7000, 1.25, 'clickPower', 5, 2),
  ci('c06', 'Reinforced Joints', '+8 per click', 'click', 18000, 1.25, 'clickPower', 8, 2),
  ci('c07', 'Carbon Knuckles', '+12 per click', 'click', 50000, 1.26, 'clickPower', 12, 3),
  ci('c08', 'Pneumatic Press', '+18 per click', 'click', 140000, 1.26, 'clickPower', 18, 3),
  ci('c09', 'Hydraulic Driver', '+30 per click', 'click', 400000, 1.27, 'clickPower', 30, 4),
  ci('c10', 'Seismic Punch', '+50 per click', 'click', 1200000, 1.27, 'clickPower', 50, 4),
  ci('c11', 'Titanium Fist', '+80 per click', 'click', 3500000, 1.28, 'clickPower', 80, 5),
  ci('c12', 'Mag-Lev Striker', '+130 per click', 'click', 10000000, 1.28, 'clickPower', 130, 5),
  ci('c13', 'Piston Array', '+200 per click', 'click', 30000000, 1.29, 'clickPower', 200, 6),
  ci('c14', 'Force Amplifier', '+350 per click', 'click', 90000000, 1.29, 'clickPower', 350, 6),
  ci('c15', 'Kinetic Core', '+600 per click', 'click', 300000000, 1.30, 'clickPower', 600, 7),
  ci('c16', 'Warp Hammer', '+1K per click', 'click', 1000000000, 1.30, 'clickPower', 1000, 7),
  ci('c17', 'Nova Strike', '+1.5K per click', 'click', 3500000000, 1.31, 'clickPower', 1500, 8),
  ci('c18', 'Quasar Tap', '+2.5K per click', 'click', 12000000000, 1.31, 'clickPower', 2500, 8),
  ci('c19', 'Singularity Press', '+4K per click', 'click', 40000000000, 1.32, 'clickPower', 4000, 9),
  ci('c20', 'Big Bang Blow', '+7K per click', 'click', 150000000000, 1.32, 'clickPower', 7000, 10),

  // ── AUTO CLICKERS ──
  ci('a01', 'Desk Fan', '+0.3/s', 'auto', 150, 1.22, 'cps', 0.3, 1),
  ci('a02', 'Metronome', '+0.5/s', 'auto', 400, 1.23, 'cps', 0.5, 1),
  ci('a03', 'Sewing Machine', '+1/s', 'auto', 1000, 1.23, 'cps', 1, 1),
  ci('a04', 'Typewriter', '+2/s', 'auto', 3000, 1.24, 'cps', 2, 2),
  ci('a05', 'Assembly Arm', '+3/s', 'auto', 8000, 1.24, 'cps', 3, 2),
  ci('a06', 'Conveyor Belt', '+5/s', 'auto', 22000, 1.25, 'cps', 5, 2),
  ci('a07', 'Drill Press', '+8/s', 'auto', 60000, 1.25, 'cps', 8, 3),
  ci('a08', 'CNC Machine', '+14/s', 'auto', 170000, 1.26, 'cps', 14, 3),
  ci('a09', 'Turbine Engine', '+25/s', 'auto', 500000, 1.26, 'cps', 25, 4),
  ci('a10', 'Factory Floor', '+40/s', 'auto', 1500000, 1.27, 'cps', 40, 4),
  ci('a11', 'Power Plant', '+70/s', 'auto', 4500000, 1.27, 'cps', 70, 5),
  ci('a12', 'Reactor Core', '+120/s', 'auto', 14000000, 1.28, 'cps', 120, 5),
  ci('a13', 'Fusion Cell', '+200/s', 'auto', 45000000, 1.28, 'cps', 200, 6),
  ci('a14', 'Antimatter Tap', '+350/s', 'auto', 140000000, 1.29, 'cps', 350, 6),
  ci('a15', 'Dark Energy Siphon', '+600/s', 'auto', 450000000, 1.29, 'cps', 600, 7),
  ci('a16', 'Stellar Harvester', '+1K/s', 'auto', 1500000000, 1.30, 'cps', 1000, 7),
  ci('a17', 'Galactic Forge', '+1.5K/s', 'auto', 5000000000, 1.30, 'cps', 1500, 8),
  ci('a18', 'Cosmic Mill', '+2.5K/s', 'auto', 16000000000, 1.31, 'cps', 2500, 8),
  ci('a19', 'Dimensional Rift', '+4K/s', 'auto', 55000000000, 1.31, 'cps', 4000, 9),
  ci('a20', 'Infinity Engine', '+7K/s', 'auto', 200000000000, 1.32, 'cps', 7000, 10),

  // ── INVESTMENTS ── lower rates, much more expensive
  ci('i01', 'Savings Account', '+0.05%/s', 'invest', 5000, 1.60, 'investRate', 0.0005, 1),
  ci('i02', 'Certificate', '+0.08%/s', 'invest', 20000, 1.65, 'investRate', 0.0008, 2),
  ci('i03', 'Bond Portfolio', '+0.1%/s', 'invest', 80000, 1.70, 'investRate', 0.001, 2),
  ci('i04', 'Index Fund', '+0.12%/s', 'invest', 300000, 1.75, 'investRate', 0.0012, 3),
  ci('i05', 'Hedge Fund', '+0.15%/s', 'invest', 1200000, 1.80, 'investRate', 0.0015, 3),
  ci('i06', 'Venture Capital', '+0.18%/s', 'invest', 5000000, 1.85, 'investRate', 0.0018, 4),
  ci('i07', 'Private Equity', '+0.2%/s', 'invest', 20000000, 1.90, 'investRate', 0.002, 4),
  ci('i08', 'Crypto Mining', '+0.25%/s', 'invest', 80000000, 1.95, 'investRate', 0.0025, 5),
  ci('i09', 'Real Estate Empire', '+0.3%/s', 'invest', 350000000, 2.00, 'investRate', 0.003, 6),
  ci('i10', 'Global Conglomerate', '+0.4%/s', 'invest', 1500000000, 2.05, 'investRate', 0.004, 7),
  ci('i11', 'Space Mining Corp', '+0.5%/s', 'invest', 7000000000, 2.10, 'investRate', 0.005, 8),
  ci('i12', 'Multiverse Holdings', '+0.7%/s', 'invest', 35000000000, 2.20, 'investRate', 0.007, 9),

  // ── SPECIAL / HYBRID (category: 'special') ── Mixed effects, expensive
  ci('s01', 'Lucky Penny', '+1 click', 'special', 250, 1.24, 'clickPower', 1, 1),
  ci('s02', 'Wind-Up Toy', '+0.5/s', 'special', 350, 1.24, 'cps', 0.5, 1),
  ci('s03', 'Copper Wire', '+1/s', 'special', 800, 1.24, 'cps', 1, 1),
  ci('s04', 'Magnet Board', '+3 click', 'special', 2200, 1.25, 'clickPower', 3, 2),
  ci('s05', 'Gear Train', '+3/s', 'special', 5500, 1.25, 'cps', 3, 2),
  ci('s06', 'Spring Loader', '+5 click', 'special', 14000, 1.26, 'clickPower', 5, 2),
  ci('s07', 'Voltage Regulator', '+6/s', 'special', 38000, 1.26, 'cps', 6, 3),
  ci('s08', 'Circuit Board', '+10 click', 'special', 100000, 1.27, 'clickPower', 10, 3),
  ci('s09', 'Motor Block', '+15/s', 'special', 280000, 1.27, 'cps', 15, 3),
  ci('s10', 'Crankshaft', '+20 click', 'special', 800000, 1.28, 'clickPower', 20, 4),
  ci('s11', 'Transformer', '+30/s', 'special', 2200000, 1.28, 'cps', 30, 4),
  ci('s12', 'Heat Sink', '+50/s', 'special', 6500000, 1.29, 'cps', 50, 5),
  ci('s13', 'Supercharger', '+60 click', 'special', 18000000, 1.29, 'clickPower', 60, 5),
  ci('s14', 'Turbo Manifold', '+80/s', 'special', 55000000, 1.30, 'cps', 80, 5),
  ci('s15', 'Nitro Injection', '+120 click', 'special', 160000000, 1.30, 'clickPower', 120, 6),
  ci('s16', 'Plasma Coil', '+150/s', 'special', 500000000, 1.31, 'cps', 150, 6),
  ci('s17', 'Ion Thruster', '+250 click', 'special', 1500000000, 1.31, 'clickPower', 250, 7),
  ci('s18', 'Wormhole Tap', '+350/s', 'special', 5000000000, 1.32, 'cps', 350, 7),
  ci('s19', 'Nebula Core', '+500 click', 'special', 18000000000, 1.32, 'clickPower', 500, 8),
  ci('s20', 'Pulsar Beacon', '+800/s', 'special', 60000000000, 1.33, 'cps', 800, 9),
];

export const SABOTAGE_ABILITIES: SabotageAbility[] = [
  { id: 'smokeBomb', name: 'Smoke Screen', description: 'Obscure their button', baseCost: 1500, duration: 5, cooldown: 15 },
  { id: 'taxman', name: 'Tax Collector', description: 'Steal % of their bank', baseCost: 15000, duration: 0, cooldown: 30 },
  { id: 'frozenGear', name: 'System Freeze', description: 'Stop their auto-income', baseCost: 6000, duration: 5, cooldown: 20 },
  { id: 'inflationSpike', name: 'Price Surge', description: 'Double their costs', baseCost: 10000, duration: 8, cooldown: 25 },
  { id: 'stunLock', name: 'Input Lock', description: 'Disable their clicking', baseCost: 25000, duration: 3, cooldown: 45 },
  { id: 'foxy', name: 'FOXY JUMPSCARE', description: 'TERRIFYING JUMPSCARE', baseCost: 500000, duration: 3, cooldown: 120 },
];

export const DIFFICULTY_PRESETS: Record<string, Partial<LobbySettings>> = {
  sprint: { targetValue: 1_000_000, timeLimit: 180 },
  marathon: { targetValue: 1_000_000_000, timeLimit: 600 },
  endurance: { targetValue: 1_000_000_000_000_000, timeLimit: 2700 },
};

export const PLAYER_COLORS = [
  '#00ffff', '#ff0080', '#00ff88', '#ffaa00', '#ff4444', '#aa66ff',
  '#00aaff', '#ff6600', '#44ffaa', '#ff2266', '#8855ff', '#00ddff',
];

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
  
  // Create a harsh, scary sound
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
  
  // Add a loud initial hit
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
