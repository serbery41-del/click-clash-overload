import { create } from 'zustand';
import { GamePhase, DeviceMode, LobbySettings, PlayerState, FeedEntry, SkinId } from './types';
import { SHOP_ITEMS, SABOTAGE_ABILITIES, getItemCost, DIFFICULTY_PRESETS, generateRoomCode, getSabotageCost, getSabotageDuration, playFoxyScream, CHAOS_EVENTS, ChaosEventId, playClickSfx, playPurchaseSfx, playSabotageSfx, playChaosSfx, playGoldenFreddySfx, playWinSfx } from './gameData';
import * as mp from './multiplayer';

let syncTimer: any = null;
let chaosTimer: any = null;

function mkPlayer(id: string, name: string, local: boolean, host: boolean, skin: SkinId): PlayerState {
  return {
    id, name, visId: skin, total: 0, clickPower: 1, cps: 0, investRate: 0, multiplier: 1,
    itemsOwned: {}, isLocal: local, isHost: host,
    sabotagesDealt: 0, totalClicks: 0, lastClickTime: 0,
    activeSabotages: [], color: mp.playerColor(id), skinId: skin, ready: local, team: 'none',
  };
}

function toSync(p: PlayerState) {
  return { id: p.id, name: p.name, skinId: p.skinId, isHost: p.isHost, total: p.total,
    clickPower: p.clickPower, cps: p.cps, investRate: p.investRate, multiplier: p.multiplier,
    totalClicks: p.totalClicks, sabotagesDealt: p.sabotagesDealt, color: p.color, itemsOwned: p.itemsOwned, team: p.team };
}

// ── Message handler ──
function onMsg(msg: any) {
  try {
    const s = useGameStore.getState();
    const kind = msg.k;
    const d = msg.d || {};

    // JOIN: someone wants in (host processes this)
    if (kind === 'join' && s.isHost) {
      if (!d.id) return;
      if (s.players.some(p => p.id === d.id)) {
        // already here — re-send room state
        mp.send('room', { settings: s.settings, phase: s.phase, players: s.players.map(toSync) });
        return;
      }
      const newP = mkPlayer(d.id, d.name || '?', false, false, d.skin || 'classic');
      const list = [...s.players, newP];
      useGameStore.setState({ players: list });
      s.addFeed((d.name || 'Someone') + ' joined', 'system');
      mp.send('room', { settings: s.settings, phase: s.phase, players: list.map(toSync) });
    }

    // ROOM: full room state from host (joiners process this)
    if (kind === 'room' && !s.isHost) {
      const me = s.players.find(p => p.id === s.myId);
      if (!me) return;
      const others = (d.players || [])
        .filter((rp: any) => rp && rp.id !== s.myId)
        .map((rp: any) => ({ ...mkPlayer(rp.id, rp.name || '?', false, !!rp.isHost, rp.skinId || 'classic'), ...rp, isLocal: false }));
      const update: any = { players: [me, ...others] };
      if (d.settings) update.settings = { ...s.settings, ...d.settings };
      // detect game start
      if (d.phase === 'playing' && s.phase !== 'playing' && s.phase !== 'finished') {
        const st = d.settings || s.settings;
        update.phase = 'playing';
        update.timeElapsed = 0;
        update.winnerId = null;
        update.timeRemaining = st.goalType === 'timedSprint' ? st.timeLimit : 0;
        update.feed = [{ id: 'go', message: 'Race started!', timestamp: Date.now(), type: 'system' }];
        const cp = st.seedBonus ? (st.seedBonusAmount || 0) : 0;
        const ck = st.startingClickPower || 1;
        update.players = update.players.map((p: PlayerState) => ({ ...p, total: cp, clickPower: ck }));
      }
      useGameStore.setState(update);
    }

    // SYNC: player stats update during game
    if (kind === 'sync' && d.id) {
      useGameStore.setState({
        players: s.players.map(p => p.id !== d.id ? p : {
          ...p, total: d.total ?? p.total, clickPower: d.clickPower ?? p.clickPower,
          cps: d.cps ?? p.cps, investRate: d.investRate ?? p.investRate,
          multiplier: d.multiplier ?? p.multiplier, totalClicks: d.totalClicks ?? p.totalClicks,
          sabotagesDealt: d.sabotagesDealt ?? p.sabotagesDealt, itemsOwned: d.itemsOwned ?? p.itemsOwned,
        }),
      });
    }

    // SAB: sabotage targeted at us
    if (kind === 'sab' && d.targetId === s.myId) {
      const sab = SABOTAGE_ABILITIES.find(a => a.id === d.sabId);
      if (!sab) return;
      const dur = getSabotageDuration(sab, s.settings);
      if (d.sabId === 'foxy') s.triggerFoxy();
      if (d.sabId === 'goldenFreddy') {
        useGameStore.setState({ goldenFreddyActive: true });
        try { playGoldenFreddySfx(); } catch (_) {}
        setTimeout(() => useGameStore.setState({ goldenFreddyActive: false }), dur * 1000);
      }
      if (d.sabId === 'taxman') {
        const me = s.players.find(p => p.id === s.myId);
        if (me) {
          const stolen = Math.floor(me.total * (s.settings.taxPercent / 100));
          useGameStore.setState({ players: s.players.map(p => p.id === s.myId ? { ...p, total: p.total - stolen } : p) });
        }
      } else {
        useGameStore.setState({
          players: s.players.map(p => p.id === s.myId ? {
            ...p, activeSabotages: [...p.activeSabotages, { id: d.sabId + Date.now(), type: d.sabId, fromPlayer: msg._f, endsAt: Date.now() + dur * 1000 }],
          } : p),
        });
      }
      s.addFeed((d.fromName || '?') + ' used ' + sab.name + ' on you!', 'sabotage');
    }

    // CHAOS: host broadcasts a chaos event
    if (kind === 'chaos' && d.id && !s.isHost) {
      s.triggerChaos(d.id);
    }

    // FEED: chat from others
    if (kind === 'feed' && d.msg) {
      s.addFeed(d.msg, d.type || 'system');
    }
  } catch (_) {}
}

// ── Sync timer — keeps retrying join / broadcasting state ──
function startSync() {
  stopSync();
  syncTimer = setInterval(() => {
    try {
      const s = useGameStore.getState();
      if (!mp.getRoom()) return;

      // Host in lobby: keep broadcasting room state
      if (s.isHost && s.phase === 'lobby') {
        mp.send('room', { settings: s.settings, phase: 'lobby', players: s.players.map(toSync) });
      }
      // Joiner waiting: keep sending join requests
      if (!s.isHost && s.phase === 'waiting') {
        mp.send('join', { id: s.myId, name: s.playerName || 'Player', skin: s.selectedSkin });
      }
      // In game: broadcast my stats
      if (s.phase === 'playing') {
        const me = s.players.find(p => p.id === s.myId);
        if (me) mp.send('sync', toSync(me));
      }
    } catch (_) {}
  }, 500);
}

function stopSync() {
  if (syncTimer) { clearInterval(syncTimer); syncTimer = null; }
}

function startChaosLoop() {
  stopChaosLoop();
  const s0 = useGameStore.getState();
  if (!s0.isHost || !s0.settings.chaosEventsEnabled || s0.settings.stakeMode !== 'chaos') return;
  const intervalMs = Math.max(5000, s0.settings.chaosInterval * 1000);
  chaosTimer = setInterval(() => {
    const s = useGameStore.getState();
    if (s.phase !== 'playing' || s.winnerId) return;
    s.triggerChaos();
  }, intervalMs);
}

function stopChaosLoop() {
  if (chaosTimer) { clearInterval(chaosTimer); chaosTimer = null; }
}

// ── Store ──
interface GameStore {
  phase: GamePhase; deviceMode: DeviceMode; settings: LobbySettings;
  players: PlayerState[]; myId: string; feed: FeedEntry[];
  timeRemaining: number; timeElapsed: number; winnerId: string | null;
  playerName: string; selectedSkin: SkinId;
  sabotageCooldowns: Record<string, number>;
  secretUnlocked: boolean; unlockedSkins: SkinId[]; isHost: boolean; cursorEnabled: boolean; foxyActive: boolean;
  debugMsgCount: number;
  // chaos
  activeChaos: ChaosEventId | null;
  chaosEndsAt: number;
  goldenFreddyActive: boolean;
  // anti-cheat
  cheatLockedUntil: number;
  recentClickTimes: number[];
  setPhase: (p: GamePhase) => void; setDeviceMode: (m: DeviceMode) => void;
  updateSettings: (p: Partial<LobbySettings>) => void;
  setPlayerName: (n: string) => void; setSkin: (s: SkinId) => void;
  setTeam: (t: any) => void;
  unlockSecret: (skin?: SkinId) => void; setCursorEnabled: (e: boolean) => void;
  createRoom: () => void; joinRoom: (code: string) => void; startGame: () => void;
  handleClick: () => void; buyItem: (id: string) => void;
  useSabotage: (sabId: string, targetId: string) => void;
  triggerChaos: (id?: ChaosEventId) => void;
  tick: (delta: number) => void;
  addFeed: (msg: string, t: FeedEntry['type']) => void;
  resetGame: () => void; triggerFoxy: () => void;
}

const defaultSettings: LobbySettings = {
  goalType: 'firstToValue', targetValue: 1_000_000, timeLimit: 180,
  stakeMode: 'chaos', difficulty: 'sprint',
  seedBonus: false, seedBonusAmount: 100,
  catchUpMechanic: true, catchUpPercent: 10,
  roomCode: '', maxPlayers: 8, sabotagesEnabled: true,
  smokeDuration: 5, freezeDuration: 5, stunDuration: 3, taxPercent: 10, inflationDuration: 8,
  costGrowthRate: 100, startingClickPower: 1,
  showLeaderboard: true, showFeed: true,
  teamsEnabled: false, chaosEventsEnabled: false, chaosInterval: 30,
  antiCheatEnabled: true, antiCheatCpsThreshold: 76, antiCheatFreezeSeconds: 35,
};

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'deviceSelect', deviceMode: 'pc',
  settings: { ...defaultSettings, roomCode: generateRoomCode() },
  players: [], myId: mp.myId(), feed: [],
  timeRemaining: 0, timeElapsed: 0, winnerId: null,
  playerName: '', selectedSkin: 'classic' as SkinId,
  sabotageCooldowns: {}, secretUnlocked: false, unlockedSkins: [],
  isHost: false, cursorEnabled: false, foxyActive: false,
  debugMsgCount: 0,
  activeChaos: null, chaosEndsAt: 0, goldenFreddyActive: false,
  cheatLockedUntil: 0, recentClickTimes: [],

  setPhase: (p) => set({ phase: p }),
  setDeviceMode: (m) => set({ deviceMode: m, phase: 'menu' }),
  setPlayerName: (n) => set({ playerName: n }),
  setSkin: (s) => set({ selectedSkin: s }),
  setTeam: (t) => set(st => ({ players: st.players.map(p => p.id === st.myId ? { ...p, team: t } : p) })),
  unlockSecret: (skin) => set(st => ({
    secretUnlocked: true,
    unlockedSkins: skin && !st.unlockedSkins.includes(skin) ? [...st.unlockedSkins, skin] : st.unlockedSkins,
  })),
  setCursorEnabled: (e) => set({ cursorEnabled: e }),

  updateSettings: (partial) => set(st => {
    const ns = { ...st.settings, ...partial };
    if (partial.difficulty && partial.difficulty !== 'custom') {
      const pr = DIFFICULTY_PRESETS[partial.difficulty];
      if (pr) Object.assign(ns, pr);
    }
    return { settings: ns };
  }),

  createRoom: () => {
    const st = get();
    const code = generateRoomCode();
    const me = mkPlayer(st.myId, st.playerName || 'Host', true, true, st.selectedSkin);
    mp.open(code);
    mp.onMessage(onMsg);
    set({ phase: 'lobby', players: [me], isHost: true, settings: { ...st.settings, roomCode: code }, feed: [] });
    startSync();
  },

  joinRoom: (code) => {
    const st = get();
    const c = code.toUpperCase();
    const me = mkPlayer(st.myId, st.playerName || 'Player', true, false, st.selectedSkin);
    mp.open(c);
    mp.onMessage(onMsg);
    set({ phase: 'waiting', players: [me], isHost: false, settings: { ...st.settings, roomCode: c }, feed: [] });
    // immediately ping host
    mp.send('join', { id: st.myId, name: st.playerName || 'Player', skin: st.selectedSkin });
    startSync();
  },

  startGame: () => {
    const st = get();
    if (!st.isHost) return;
    const cp = st.settings.seedBonus ? st.settings.seedBonusAmount : 0;
    const ck = st.settings.startingClickPower;
    const teams: Array<'purple' | 'pink' | 'green' | 'orange'> = ['purple', 'pink', 'green', 'orange'];
    const np = st.players.map((p, i) => ({
      ...p,
      total: cp,
      clickPower: ck,
      team: st.settings.teamsEnabled ? teams[i % teams.length] : 'none' as const,
    }));
    set({
      phase: 'playing', players: np,
      feed: [{ id: '0', message: 'Race started!', timestamp: Date.now(), type: 'system' as const }],
      timeRemaining: st.settings.goalType === 'timedSprint' ? st.settings.timeLimit : 0,
      timeElapsed: 0, winnerId: null, sabotageCooldowns: {}, foxyActive: false,
      activeChaos: null, chaosEndsAt: 0, goldenFreddyActive: false,
      cheatLockedUntil: 0, recentClickTimes: [],
    });
    mp.send('room', { settings: st.settings, phase: 'playing', players: np.map(toSync) });
    startChaosLoop();
  },

  handleClick: () => {
    const st = get();
    if (st.phase !== 'playing' || st.winnerId) return;
    const now = Date.now();
    // anti-cheat: check sustained CPS over last second
    if (st.settings.antiCheatEnabled) {
      if (st.cheatLockedUntil > now) return;
      const recent = [...st.recentClickTimes, now].filter(t => now - t < 1000);
      if (recent.length >= st.settings.antiCheatCpsThreshold) {
        const lockMs = st.settings.antiCheatFreezeSeconds * 1000;
        set({ cheatLockedUntil: now + lockMs, recentClickTimes: [] });
        get().addFeed('ANTI-CHEAT: You clicked too fast! Frozen ' + st.settings.antiCheatFreezeSeconds + 's', 'system');
        return;
      }
      set({ recentClickTimes: recent });
    }
    const idx = st.players.findIndex(p => p.id === st.myId);
    if (idx < 0) return;
    const p = st.players[idx];
    if (p.activeSabotages.some(s => s.type === 'stunLock' && s.endsAt > Date.now())) return;
    let v = p.clickPower * p.multiplier;
    // chaos modifiers
    if (st.activeChaos && st.chaosEndsAt > now) {
      if (st.activeChaos === 'doubleClick') v *= 2;
      else if (st.activeChaos === 'frenzy') v *= 1.5;
      else if (st.activeChaos === 'powerSurge') v *= 3;
    }
    const np = [...st.players];
    np[idx] = { ...p, total: p.total + v, totalClicks: p.totalClicks + 1, lastClickTime: now };
    set({ players: np });
    if ((p.totalClicks % 3) === 0) playClickSfx();
    if (st.settings.goalType === 'firstToValue' && np[idx].total >= st.settings.targetValue) {
      set({ winnerId: st.myId, phase: 'finished' });
      get().addFeed(np[idx].name + ' reached the goal!', 'system');
      playWinSfx();
    }
  },

  buyItem: (itemId) => {
    const st = get();
    if (st.phase !== 'playing' || st.winnerId) return;
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;
    const idx = st.players.findIndex(p => p.id === st.myId);
    if (idx < 0) return;
    const p = st.players[idx];
    const owned = p.itemsOwned[itemId] || 0;
    let cost = getItemCost(item, owned, st.settings.costGrowthRate / 100);
    if (p.activeSabotages.some(s => s.type === 'inflationSpike' && s.endsAt > Date.now())) cost *= 2;
    if (st.activeChaos === 'priceCrash' && st.chaosEndsAt > Date.now()) cost = Math.floor(cost * 0.7);
    if (p.total < cost) return;
    const np = { ...p, total: p.total - cost, itemsOwned: { ...p.itemsOwned, [itemId]: owned + 1 } };
    if (item.effect === 'clickPower') np.clickPower += item.effectValue;
    else if (item.effect === 'cps') np.cps += item.effectValue;
    else if (item.effect === 'investRate') np.investRate += item.effectValue;
    else if (item.effect === 'multiplier') np.multiplier += item.effectValue;
    const list = [...st.players]; list[idx] = np;
    set({ players: list });
    get().addFeed(p.name + ' bought ' + item.name, 'purchase');
    playPurchaseSfx();
  },

  useSabotage: (sabId, targetId) => {
    const st = get();
    if (st.phase !== 'playing' || st.winnerId || !st.settings.sabotagesEnabled) return;
    const sab = SABOTAGE_ABILITIES.find(s => s.id === sabId);
    if (!sab) return;
    if ((st.sabotageCooldowns[sabId] || 0) > Date.now()) return;
    const idx = st.players.findIndex(p => p.id === st.myId);
    if (idx < 0) return;
    const me = st.players[idx];
    // teams: don't sabotage teammates
    const tgt = st.players.find(p => p.id === targetId);
    if (st.settings.teamsEnabled && tgt && me.team !== 'none' && me.team === tgt.team) return;
    const cost = getSabotageCost(sab, st.settings);
    if (me.total < cost) return;
    const list = [...st.players];
    list[idx] = { ...me, total: me.total - cost, sabotagesDealt: me.sabotagesDealt + 1 };
    set({ players: list, sabotageCooldowns: { ...st.sabotageCooldowns, [sabId]: Date.now() + sab.cooldown * 1000 } });
    get().addFeed(me.name + ' used ' + sab.name + '!', 'sabotage');
    playSabotageSfx();
    mp.send('sab', { sabId, targetId, fromName: me.name });
  },

  triggerFoxy: () => {
    set({ foxyActive: true });
    try { playFoxyScream(); } catch (_) {}
    setTimeout(() => set({ foxyActive: false }), 3000);
  },

  triggerChaos: (forceId) => {
    const st = get();
    if (st.phase !== 'playing' || st.winnerId) return;
    const ev = forceId
      ? CHAOS_EVENTS.find(e => e.id === forceId)!
      : CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)];
    const endsAt = Date.now() + ev.duration * 1000;
    set({ activeChaos: ev.id, chaosEndsAt: endsAt });
    get().addFeed('CHAOS: ' + ev.name + ' — ' + ev.message, 'system');
    if (ev.id === 'goldenFreddy') {
      set({ goldenFreddyActive: true });
      try { playGoldenFreddySfx(); } catch (_) {}
      setTimeout(() => set({ goldenFreddyActive: false }), ev.duration * 1000);
    } else {
      try { playChaosSfx(); } catch (_) {}
    }
    if (ev.id === 'taxStorm') {
      const sorted = [...st.players].sort((a, b) => b.total - a.total);
      const leader = sorted[0];
      if (leader && leader.id === st.myId) {
        set(s => ({ players: s.players.map(p => p.id === leader.id ? { ...p, total: p.total * 0.95 } : p) }));
      }
    }
    if (st.isHost) mp.send('chaos', { id: ev.id });
  },

  tick: (delta) => {
    const st = get();
    if (st.phase !== 'playing' || st.winnerId) return;

    // update debug msg count
    set({ debugMsgCount: mp.getMsgCount() });

    const myP = st.players.find(p => p.id === st.myId);
    if (myP && myP.activeSabotages.some(s => s.type === 'foxy' && s.endsAt > Date.now()) && !st.foxyActive) {
      get().triggerFoxy();
    }

    let autoMul = 1;
    if (st.activeChaos && st.chaosEndsAt > Date.now()) {
      if (st.activeChaos === 'autoBoost') autoMul = 2;
      else if (st.activeChaos === 'goldRush') autoMul = 3;
      else if (st.activeChaos === 'marketDip') autoMul = 0.5;
    }
    const autoBoost = autoMul;
    const list = st.players.map(p => {
      if (p.id !== st.myId) return p;
      const u = { ...p };
      u.activeSabotages = u.activeSabotages.filter(s => s.endsAt > Date.now());
      const frozen = u.activeSabotages.some(s => s.type === 'frozenGear');
      if (u.cps > 0 && !frozen) u.total += u.cps * u.multiplier * autoBoost * delta;
      if (u.investRate > 0 && !frozen) u.total += u.total * u.investRate * delta;
      return u;
    });
    // expire chaos
    if (st.activeChaos && st.chaosEndsAt < Date.now()) {
      set({ activeChaos: null });
    }

    const elapsed = st.timeElapsed + delta;
    const remain = st.settings.goalType === 'timedSprint' ? Math.max(0, st.settings.timeLimit - elapsed) : 0;
    set({ players: list, timeElapsed: elapsed, timeRemaining: remain });

    if (st.settings.goalType === 'timedSprint' && remain <= 0) {
      const sorted = [...list].sort((a, b) => b.total - a.total);
      set({ winnerId: sorted[0].id, phase: 'finished' });
      get().addFeed(sorted[0].name + ' wins!', 'system');
      playWinSfx();
      return;
    }
    if (st.settings.goalType === 'firstToValue') {
      const w = list.find(p => p.total >= st.settings.targetValue);
      if (w) { set({ winnerId: w.id, phase: 'finished' }); get().addFeed(w.name + ' reached the goal!', 'system'); playWinSfx(); }
    }
  },

  addFeed: (message, type) => {
    set(st => ({
      feed: [{ id: String(Date.now()) + Math.random(), message, timestamp: Date.now(), type }, ...st.feed.slice(0, 49)],
    }));
  },

  resetGame: () => {
    stopSync();
    stopChaosLoop();
    mp.close();
    set({
      phase: 'menu', players: [], feed: [], winnerId: null,
      timeElapsed: 0, timeRemaining: 0, sabotageCooldowns: {},
      isHost: false, foxyActive: false, debugMsgCount: 0,
      activeChaos: null, chaosEndsAt: 0, goldenFreddyActive: false,
      cheatLockedUntil: 0, recentClickTimes: [],
      settings: { ...defaultSettings, roomCode: generateRoomCode() },
    });
  },
}));
