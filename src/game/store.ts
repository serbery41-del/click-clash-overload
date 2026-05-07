import { create } from 'zustand';
import { GamePhase, DeviceMode, LobbySettings, PlayerState, FeedEntry, SkinId } from './types';
import { SHOP_ITEMS, SABOTAGE_ABILITIES, getItemCost, DIFFICULTY_PRESETS, generateRoomCode, getSabotageCost, getSabotageDuration, playFoxyScream, CHAOS_EVENTS, ChaosEventId } from './gameData';
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
    totalClicks: p.totalClicks, sabotagesDealt: p.sabotagesDealt, color: p.color, itemsOwned: p.itemsOwned };
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

// ── Store ──
interface GameStore {
  phase: GamePhase; deviceMode: DeviceMode; settings: LobbySettings;
  players: PlayerState[]; myId: string; feed: FeedEntry[];
  timeRemaining: number; timeElapsed: number; winnerId: string | null;
  playerName: string; selectedSkin: SkinId;
  sabotageCooldowns: Record<string, number>;
  secretUnlocked: boolean; isHost: boolean; cursorEnabled: boolean; foxyActive: boolean;
  debugMsgCount: number;
  setPhase: (p: GamePhase) => void; setDeviceMode: (m: DeviceMode) => void;
  updateSettings: (p: Partial<LobbySettings>) => void;
  setPlayerName: (n: string) => void; setSkin: (s: SkinId) => void;
  unlockSecret: () => void; setCursorEnabled: (e: boolean) => void;
  createRoom: () => void; joinRoom: (code: string) => void; startGame: () => void;
  handleClick: () => void; buyItem: (id: string) => void;
  useSabotage: (sabId: string, targetId: string) => void;
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
};

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'deviceSelect', deviceMode: 'pc',
  settings: { ...defaultSettings, roomCode: generateRoomCode() },
  players: [], myId: mp.myId(), feed: [],
  timeRemaining: 0, timeElapsed: 0, winnerId: null,
  playerName: '', selectedSkin: 'classic' as SkinId,
  sabotageCooldowns: {}, secretUnlocked: false,
  isHost: false, cursorEnabled: false, foxyActive: false,
  debugMsgCount: 0,

  setPhase: (p) => set({ phase: p }),
  setDeviceMode: (m) => set({ deviceMode: m, phase: 'menu' }),
  setPlayerName: (n) => set({ playerName: n }),
  setSkin: (s) => set({ selectedSkin: s }),
  unlockSecret: () => set({ secretUnlocked: true }),
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
    const np = st.players.map(p => ({ ...p, total: cp, clickPower: ck }));
    set({
      phase: 'playing', players: np,
      feed: [{ id: '0', message: 'Race started!', timestamp: Date.now(), type: 'system' as const }],
      timeRemaining: st.settings.goalType === 'timedSprint' ? st.settings.timeLimit : 0,
      timeElapsed: 0, winnerId: null, sabotageCooldowns: {}, foxyActive: false,
    });
    mp.send('room', { settings: st.settings, phase: 'playing', players: np.map(toSync) });
  },

  handleClick: () => {
    const st = get();
    if (st.phase !== 'playing' || st.winnerId) return;
    const idx = st.players.findIndex(p => p.id === st.myId);
    if (idx < 0) return;
    const p = st.players[idx];
    if (p.activeSabotages.some(s => s.type === 'stunLock' && s.endsAt > Date.now())) return;
    const v = p.clickPower * p.multiplier;
    const np = [...st.players];
    np[idx] = { ...p, total: p.total + v, totalClicks: p.totalClicks + 1, lastClickTime: Date.now() };
    set({ players: np });
    if (st.settings.goalType === 'firstToValue' && np[idx].total >= st.settings.targetValue) {
      set({ winnerId: st.myId, phase: 'finished' });
      get().addFeed(np[idx].name + ' reached the goal!', 'system');
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
    if (p.total < cost) return;
    const np = { ...p, total: p.total - cost, itemsOwned: { ...p.itemsOwned, [itemId]: owned + 1 } };
    if (item.effect === 'clickPower') np.clickPower += item.effectValue;
    else if (item.effect === 'cps') np.cps += item.effectValue;
    else if (item.effect === 'investRate') np.investRate += item.effectValue;
    else if (item.effect === 'multiplier') np.multiplier += item.effectValue;
    const list = [...st.players]; list[idx] = np;
    set({ players: list });
    get().addFeed(p.name + ' bought ' + item.name, 'purchase');
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
    const cost = getSabotageCost(sab, st.settings);
    if (me.total < cost) return;
    const list = [...st.players];
    list[idx] = { ...me, total: me.total - cost, sabotagesDealt: me.sabotagesDealt + 1 };
    set({ players: list, sabotageCooldowns: { ...st.sabotageCooldowns, [sabId]: Date.now() + sab.cooldown * 1000 } });
    get().addFeed(me.name + ' used ' + sab.name + '!', 'sabotage');
    mp.send('sab', { sabId, targetId, fromName: me.name });
  },

  triggerFoxy: () => {
    set({ foxyActive: true });
    try { playFoxyScream(); } catch (_) {}
    setTimeout(() => set({ foxyActive: false }), 3000);
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

    const list = st.players.map(p => {
      if (p.id !== st.myId) return p;
      const u = { ...p };
      u.activeSabotages = u.activeSabotages.filter(s => s.endsAt > Date.now());
      const frozen = u.activeSabotages.some(s => s.type === 'frozenGear');
      if (u.cps > 0 && !frozen) u.total += u.cps * u.multiplier * delta;
      if (u.investRate > 0 && !frozen) u.total += u.total * u.investRate * delta;
      return u;
    });

    const elapsed = st.timeElapsed + delta;
    const remain = st.settings.goalType === 'timedSprint' ? Math.max(0, st.settings.timeLimit - elapsed) : 0;
    set({ players: list, timeElapsed: elapsed, timeRemaining: remain });

    if (st.settings.goalType === 'timedSprint' && remain <= 0) {
      const sorted = [...list].sort((a, b) => b.total - a.total);
      set({ winnerId: sorted[0].id, phase: 'finished' });
      get().addFeed(sorted[0].name + ' wins!', 'system');
      return;
    }
    if (st.settings.goalType === 'firstToValue') {
      const w = list.find(p => p.total >= st.settings.targetValue);
      if (w) { set({ winnerId: w.id, phase: 'finished' }); get().addFeed(w.name + ' reached the goal!', 'system'); }
    }
  },

  addFeed: (message, type) => {
    set(st => ({
      feed: [{ id: String(Date.now()) + Math.random(), message, timestamp: Date.now(), type }, ...st.feed.slice(0, 49)],
    }));
  },

  resetGame: () => {
    stopSync();
    mp.close();
    set({
      phase: 'menu', players: [], feed: [], winnerId: null,
      timeElapsed: 0, timeRemaining: 0, sabotageCooldowns: {},
      isHost: false, foxyActive: false, debugMsgCount: 0,
      settings: { ...defaultSettings, roomCode: generateRoomCode() },
    });
  },
}));
