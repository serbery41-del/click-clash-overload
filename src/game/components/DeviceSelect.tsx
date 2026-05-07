import { useGameStore } from '../store';

export default function DeviceSelect() {
  const setDeviceMode = useGameStore(s => s.setDeviceMode);

  return (
    <div className="min-h-screen flex items-center justify-center bg-main p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-black">
            <span className="text-[#00ffff]">Clicker</span>
            <span className="text-[#ff0080]">Clash</span>
          </h1>
          <p className="text-white/40 text-sm mt-2">Select your device</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setDeviceMode('phone')}
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-[#00ffff]/30 bg-[#00ffff]/5 hover:border-[#00ffff] hover:bg-[#00ffff]/15 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-200"
          >
            <div className="w-16 h-16 rounded-xl bg-[#00ffff]/20 group-hover:bg-[#00ffff]/30 flex items-center justify-center transition-colors">
              <svg className="w-8 h-8 text-[#00ffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="5" y="2" width="14" height="20" rx="3" />
                <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-white text-lg">Phone</div>
              <div className="text-[#00ffff]/60 text-xs mt-1">Tap controls</div>
            </div>
          </button>

          <button
            onClick={() => setDeviceMode('pc')}
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-[#ff0080]/30 bg-[#ff0080]/5 hover:border-[#ff0080] hover:bg-[#ff0080]/15 hover:shadow-[0_0_30px_rgba(255,0,128,0.3)] transition-all duration-200"
          >
            <div className="w-16 h-16 rounded-xl bg-[#ff0080]/20 group-hover:bg-[#ff0080]/30 flex items-center justify-center transition-colors">
              <svg className="w-8 h-8 text-[#ff0080]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-white text-lg">Desktop</div>
              <div className="text-[#ff0080]/60 text-xs mt-1">Keyboard + Mouse</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
