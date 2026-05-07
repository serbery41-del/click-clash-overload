export type GoalType = 'firstToValue' | 'timedSprint';
export type StakeMode = 'friendly' | 'chaos';
export type TeamId = 'purple' | 'pink' | 'green' | 'orange' | 'none';
export type Difficulty = 'sprint' | 'marathon' | 'endurance' | 'custom';
export type DeviceMode = 'phone' | 'pc';
export type GamePhase = 'deviceSelect' | 'menu' | 'skins' | 'joinRoom' | 'lobby' | 'waiting' | 'playing' | 'finished';

export type SkinId = 'classic' | 'mint' | 'retro' | 'neon' | 'tux' | 'win11' | 'macos';

export interface Skin {
  id: SkinId;
  name: string;
  description: string;
  secret?: boolean;
  colors: { primary: string; secondary: string };
  cursorData?: string; // base64 cursor data
}

export interface LobbySettings {
  goalType: GoalType;
  targetValue: number;
  timeLimit: number;
  stakeMode: StakeMode;
  difficulty: Difficulty;
  seedBonus: boolean;
  seedBonusAmount: number;
  catchUpMechanic: boolean;
  catchUpPercent: number;
  roomCode: string;
  maxPlayers: number;
  sabotagesEnabled: boolean;
  smokeDuration: number;
  freezeDuration: number;
  stunDuration: number;
  taxPercent: number;
  inflationDuration: number;
  costGrowthRate: number;
  startingClickPower: number;
  showLeaderboard: boolean;
  showFeed: boolean;
  teamsEnabled: boolean;
  chaosEventsEnabled: boolean;
  chaosInterval: number;
  antiCheatEnabled: boolean;
  antiCheatCpsThreshold: number;
  antiCheatFreezeSeconds: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'click' | 'auto' | 'invest' | 'special';
  baseCost: number;
  costGrowth: number;
  effect: 'clickPower' | 'cps' | 'investRate' | 'multiplier';
  effectValue: number;
  tier: number;
}

export interface SabotageAbility {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  duration: number;
  cooldown: number;
}

export interface PlayerState {
  id: string;
  name: string;
  visId: string;
  total: number;
  clickPower: number;
  cps: number;
  investRate: number; // percentage return per second
  multiplier: number;
  itemsOwned: Record<string, number>;
  isLocal: boolean;
  isHost: boolean;
  sabotagesDealt: number;
  totalClicks: number;
  lastClickTime: number;
  activeSabotages: ActiveSabotage[];
  color: string;
  skinId: SkinId;
  ready: boolean;
  team: TeamId;
  cheatLockedUntil?: number;
}

export interface ActiveSabotage {
  id: string;
  type: string;
  fromPlayer: string;
  endsAt: number;
}

export interface FeedEntry {
  id: string;
  message: string;
  timestamp: number;
  type: 'purchase' | 'sabotage' | 'milestone' | 'system';
}
