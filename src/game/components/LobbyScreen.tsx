import { useGameStore } from '../store';
import { formatNumber } from '../gameData';
import { CursorIcon } from '../skins';
import * as mp from '../multiplayer';
import type { GoalType, StakeMode, Difficulty } from '../types';

export default function LobbyScreen() {
  const { settings, updateSettings, startGame, setPhase, playerName, selectedSkin, players, myId, setTeam } = useGameStore();
  const me = players.find(p => p.id === myId);
  const TEAM_OPTS: { id: any; label: string; color: string }[] = [
    { id: 'none', label: 'No Team', color: '#888' },
    { id: 'purple', label: 'Purple', color: '#a855f7' },
    { id: 'pink', label: 'Pink', color: '#ff0080' },
    { id: 'green', label: 'Green', color: '#00ff88' },
    { id: 'orange', label: 'Orange', color: '#ffaa00' },
  ];

  return (
    <div className="min-h-screen bg-main page-scroll">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 pb-28">
        {/* Room Code - Fixed Top Right */}
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-[#a855f7]/20 to-[#ff0080]/20 border-2 border-[#a855f7]/50 rounded-xl px-5 py-3 text-center backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.2)]">
          <div className="text-[10px] text-[#a855f7] uppercase font-bold tracking-wider">Room Code</div>
          <div className="text-2xl font-mono font-black text-white tracking-[0.2em]">{settings.roomCode}</div>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 pr-36">
          <button onClick={() => setPhase('menu')} className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Room Settings</h1>
            <p className="text-white/40 text-xs">You are the host - customize everything</p>
          </div>
        </div>

        {/* Your profile */}
        <Section title="Your Profile" color="cyan">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#a855f7]/30 to-[#ff0080]/30 flex items-center justify-center border border-white/20">
              <CursorIcon skinId={selectedSkin} size={40} />
            </div>
            <div>
              <div className="text-white font-bold text-lg">{playerName || 'Host'}</div>
              <button onClick={() => setPhase('skins')} className="text-[#a855f7] text-xs hover:text-[#a855f7]/70 transition">Change skin</button>
            </div>
            <div className="ml-auto text-[#a855f7] text-xs font-bold uppercase bg-[#a855f7]/10 px-2 py-1 rounded">Host</div>
          </div>
        </Section>

        {/* Players in room */}
        <Section title={`Players (${players.length}/${settings.maxPlayers})`} color="pink">
          <div className="flex flex-wrap gap-2">
            {players.map((p) => (
              <div key={p.id} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <CursorIcon skinId={p.skinId} size={20} />
                <span className="text-white text-sm font-medium">{p.name}</span>
                {p.isHost && <span className="text-[#a855f7] text-[10px] font-bold">HOST</span>}
              </div>
            ))}
            {players.length < settings.maxPlayers && (
              <div className="flex items-center gap-2 border-2 border-dashed border-white/20 rounded-lg px-3 py-2 text-white/30 text-sm">
                Waiting for players...
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-white/50 text-xs">Max Players</span>
            <input type="range" min={2} max={12} value={settings.maxPlayers} onChange={e => updateSettings({ maxPlayers: Number(e.target.value) })} className="flex-1 accent-[#ff0080]" />
            <span className="text-[#ff0080] font-mono font-bold w-6">{settings.maxPlayers}</span>
          </div>
        </Section>

        {/* Goal Type */}
        <Section title="Goal Type" color="cyan">
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: 'firstToValue' as GoalType, label: 'First to Value', desc: 'Race to the target number' },
              { value: 'timedSprint' as GoalType, label: 'Timed Sprint', desc: 'Highest score wins' },
            ]).map(g => (
              <Selector key={g.value} selected={settings.goalType === g.value} onClick={() => updateSettings({ goalType: g.value })} label={g.label} desc={g.desc} color="cyan" />
            ))}
          </div>
        </Section>

        {/* Difficulty / Target */}
        <Section title="Target" color="pink">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {([
              { value: 'sprint' as Difficulty, label: 'Sprint', sub: '1M' },
              { value: 'marathon' as Difficulty, label: 'Marathon', sub: '1B' },
              { value: 'endurance' as Difficulty, label: 'Endurance', sub: '1Qa' },
            ]).map(d => (
              <Selector key={d.value} selected={settings.difficulty === d.value} onClick={() => updateSettings({ difficulty: d.value })} label={d.label} desc={d.sub} color="pink" small />
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">Custom Target</span>
              <span className="text-[#ff0080] font-mono font-bold text-lg">{formatNumber(settings.targetValue)}</span>
            </div>
            <input type="range" min={5} max={24} step={0.5} value={Math.log10(settings.targetValue)} onChange={e => updateSettings({ targetValue: Math.pow(10, Number(e.target.value)), difficulty: 'custom' as Difficulty })} className="w-full accent-[#ff0080]" />
            <div className="text-[10px] text-white/40 text-right">Range: 100K → 1 septillion (1e24)</div>
          </div>
        </Section>

        {/* Time Limit */}
        {settings.goalType === 'timedSprint' && (
          <Section title="Time Limit" color="cyan">
            <div className="flex items-center gap-4">
              <input type="range" min={30} max={3600} step={30} value={settings.timeLimit} onChange={e => updateSettings({ timeLimit: Number(e.target.value) })} className="flex-1 accent-[#a855f7]" />
              <span className="text-[#a855f7] font-mono font-bold text-xl w-20 text-right">{Math.floor(settings.timeLimit / 60)}:{(settings.timeLimit % 60).toString().padStart(2, '0')}</span>
            </div>
          </Section>
        )}

        {/* Teams */}
        <Section title="Teams" color="cyan">
          <Toggle label="Enable Teams" desc="Teammates can't sabotage each other" checked={settings.teamsEnabled} onChange={v => updateSettings({ teamsEnabled: v })} color="cyan" />
          {settings.teamsEnabled && (
            <div className="mt-3">
              <div className="text-xs text-white/50 mb-2">Your Team</div>
              <div className="flex flex-wrap gap-2">
                {TEAM_OPTS.map(t => (
                  <button key={t.id} onClick={() => setTeam(t.id)} className={`px-3 py-2 rounded-lg border-2 text-xs font-bold transition ${me?.team === t.id ? 'border-white' : 'border-white/10'}`} style={{ background: me?.team === t.id ? t.color + '40' : 'transparent', color: t.color }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Chaos Events */}
        <Section title="Chaos Events" color="pink">
          <Toggle label="Random Events" desc="Triggers a chaos event every interval" checked={settings.chaosEventsEnabled} onChange={v => updateSettings({ chaosEventsEnabled: v })} color="pink" />
          {settings.chaosEventsEnabled && (
            <div className="mt-3">
              <SliderSetting label="Event Interval" value={settings.chaosInterval} min={10} max={120} unit="s" onChange={v => updateSettings({ chaosInterval: v })} />
              <div className="text-[10px] text-white/40 mt-2">Events: Golden Freddy jumpscare, Double Click, Price Crash, Auto Overdrive, Click Frenzy, Blackout, Tax Storm</div>
            </div>
          )}
        </Section>

        {/* Anti-Cheat */}
        <Section title="Anti-Cheat" color="cyan">
          <Toggle label="Enable Anti-Cheat" desc="Lock players exceeding CPS threshold" checked={settings.antiCheatEnabled} onChange={v => updateSettings({ antiCheatEnabled: v })} color="cyan" />
          {settings.antiCheatEnabled && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <SliderSetting label="CPS Threshold" value={settings.antiCheatCpsThreshold} min={20} max={150} unit="" onChange={v => updateSettings({ antiCheatCpsThreshold: v })} />
              <SliderSetting label="Freeze Duration" value={settings.antiCheatFreezeSeconds} min={5} max={60} unit="s" onChange={v => updateSettings({ antiCheatFreezeSeconds: v })} />
            </div>
          )}
        </Section>

        {/* Game Mode */}
        <Section title="Game Mode" color="pink">
          <div className="grid grid-cols-2 gap-3">
            <Selector selected={settings.stakeMode === 'friendly'} onClick={() => updateSettings({ stakeMode: 'friendly' as StakeMode, sabotagesEnabled: false })} label="Friendly" desc="Pure racing" color="cyan" />
            <Selector selected={settings.stakeMode === 'chaos'} onClick={() => updateSettings({ stakeMode: 'chaos' as StakeMode, sabotagesEnabled: true })} label="Chaos" desc="Sabotages ON" color="pink" />
          </div>
        </Section>

        {/* Sabotage Settings */}
        {settings.sabotagesEnabled && (
          <Section title="Sabotage Settings" color="pink">
            <div className="grid grid-cols-2 gap-3">
              <SliderSetting label="Smoke Duration" value={settings.smokeDuration} min={1} max={15} unit="s" onChange={v => updateSettings({ smokeDuration: v })} />
              <SliderSetting label="Freeze Duration" value={settings.freezeDuration} min={1} max={15} unit="s" onChange={v => updateSettings({ freezeDuration: v })} />
              <SliderSetting label="Stun Duration" value={settings.stunDuration} min={1} max={10} unit="s" onChange={v => updateSettings({ stunDuration: v })} />
              <SliderSetting label="Tax Steal %" value={settings.taxPercent} min={5} max={50} unit="%" onChange={v => updateSettings({ taxPercent: v })} />
              <SliderSetting label="Inflation Duration" value={settings.inflationDuration} min={3} max={20} unit="s" onChange={v => updateSettings({ inflationDuration: v })} />
            </div>
          </Section>
        )}

        {/* Economy Settings */}
        <Section title="Economy" color="cyan">
          <div className="grid grid-cols-2 gap-3">
            <SliderSetting label="Cost Growth %" value={settings.costGrowthRate} min={50} max={200} unit="%" onChange={v => updateSettings({ costGrowthRate: v })} />
            <SliderSetting label="Start Click Power" value={settings.startingClickPower} min={1} max={100} unit="" onChange={v => updateSettings({ startingClickPower: v })} />
          </div>
        </Section>

        {/* Starting Bonus */}
        <Section title="Starting Bonus" color="pink">
          <Toggle label="Enable Seed Bonus" desc="Players start with extra points" checked={settings.seedBonus} onChange={v => updateSettings({ seedBonus: v })} color="pink" />
          {settings.seedBonus && (
            <div className="mt-3">
              <SliderSetting label="Bonus Amount" value={settings.seedBonusAmount} min={10} max={10000} unit="" onChange={v => updateSettings({ seedBonusAmount: v })} />
            </div>
          )}
        </Section>

        {/* Catch-up */}
        <Section title="Catch-up Mechanic" color="cyan">
          <Toggle label="Enable Catch-up" desc="Trailing players get discounts" checked={settings.catchUpMechanic} onChange={v => updateSettings({ catchUpMechanic: v })} color="cyan" />
          {settings.catchUpMechanic && (
            <div className="mt-3">
              <SliderSetting label="Discount %" value={settings.catchUpPercent} min={5} max={50} unit="%" onChange={v => updateSettings({ catchUpPercent: v })} />
            </div>
          )}
        </Section>

        {/* Visual Options */}
        <Section title="Visual Options" color="pink">
          <div className="space-y-2">
            <Toggle label="Show Leaderboard" desc="Display live rankings" checked={settings.showLeaderboard} onChange={v => updateSettings({ showLeaderboard: v })} color="cyan" />
            <Toggle label="Show Activity Feed" desc="Display player actions" checked={settings.showFeed} onChange={v => updateSettings({ showFeed: v })} color="pink" />
          </div>
        </Section>

        {/* Debug */}
        <div className="text-[9px] text-white/20 font-mono space-y-0.5 bg-white/5 rounded-lg p-3">
          <div>Host ID: {myId}</div>
          <div>Channel: cc{settings.roomCode}</div>
          <div>Messages: {mp.getMsgCount()}</div>
          <div>Players: {players.map(p => p.name + '(' + p.id.slice(0,4) + ')').join(', ')}</div>
          <div>Share this page URL + room code with another tab to connect</div>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-4 pt-10">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-[#a855f7] via-[#c084fc] to-[#ff0080] text-black font-black text-lg rounded-xl hover:brightness-110 transition-all active:scale-[0.98] transform shadow-[0_0_40px_rgba(168,85,247,0.4)]"
          >
            START MATCH
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, color }: { title: string; children: React.ReactNode; color: 'cyan' | 'pink' }) {
  const borderColor = color === 'cyan' ? 'border-[#a855f7]/20' : 'border-[#ff0080]/20';
  const titleColor = color === 'cyan' ? 'text-[#a855f7]' : 'text-[#ff0080]';
  return (
    <div className="space-y-2">
      <h2 className={`text-xs font-bold ${titleColor} uppercase tracking-wider`}>{title}</h2>
      <div className={`bg-white/[0.03] border ${borderColor} rounded-xl p-4`}>{children}</div>
    </div>
  );
}

function Selector({ selected, onClick, label, desc, color, small }: { selected: boolean; onClick: () => void; label: string; desc: string; color: 'cyan' | 'pink'; small?: boolean }) {
  const activeClass = color === 'cyan' 
    ? 'border-[#a855f7]/60 bg-[#a855f7]/15 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
    : 'border-[#ff0080]/60 bg-[#ff0080]/15 shadow-[0_0_15px_rgba(255,0,128,0.2)]';
  const textColor = color === 'cyan' ? 'text-[#a855f7]' : 'text-[#ff0080]';
  return (
    <button onClick={onClick} className={`${small ? 'p-2.5' : 'p-4'} rounded-xl border-2 text-left transition-all ${selected ? activeClass : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
      <div className={`font-bold ${small ? 'text-xs' : 'text-sm'} ${selected ? textColor : 'text-white'}`}>{label}</div>
      <div className={`${small ? 'text-[10px]' : 'text-xs'} text-white/40 mt-0.5`}>{desc}</div>
    </button>
  );
}

function Toggle({ label, desc, checked, onChange, color }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; color: 'cyan' | 'pink' }) {
  const bgColor = color === 'cyan' ? 'bg-[#a855f7]' : 'bg-[#ff0080]';
  return (
    <button onClick={() => onChange(!checked)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition">
      <div className="text-left">
        <div className="text-sm text-white font-medium">{label}</div>
        <div className="text-white/40 text-xs">{desc}</div>
      </div>
      <div className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ml-3 ${checked ? bgColor : 'bg-white/20'}`}>
        <div className={`absolute top-0.5 w-6 h-6 rounded-full shadow transition-all ${checked ? 'translate-x-5 bg-black' : 'translate-x-0.5 bg-white/60'}`} />
      </div>
    </button>
  );
}

function SliderSetting({ label, value, min, max, unit, onChange }: { label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-white/50">{label}</span>
        <span className="text-white font-mono font-bold">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full accent-[#a855f7] h-1" />
    </div>
  );
}
