// BroadcastChannel multiplayer
// IMPORTANT: Both tabs must be on the SAME URL (same origin) for this to work.
// e.g. both on http://localhost:5173 or both on the same deployed URL

const MY_ID = 'p' + Math.random().toString(36).slice(2, 8);
let ch: BroadcastChannel | null = null;
let roomCode: string | null = null;
let msgCount = 0;

export const myId = () => MY_ID;
export const getRoom = () => roomCode;
export const getMsgCount = () => msgCount;

export function open(code: string) {
  close();
  roomCode = code;
  msgCount = 0;
  ch = new BroadcastChannel('cc' + code);
}

export function onMessage(handler: (msg: any) => void) {
  if (!ch) return;
  ch.onmessage = (ev) => {
    try {
      const d = ev.data;
      if (d && typeof d === 'object' && d._f !== MY_ID) {
        msgCount++;
        handler(d);
      }
    } catch (_) {}
  };
}

export function send(kind: string, data: any = {}) {
  if (!ch) return;
  try {
    ch.postMessage({ k: kind, _f: MY_ID, d: data });
  } catch (_) {}
}

export function close() {
  try { ch?.close(); } catch (_) {}
  ch = null;
  roomCode = null;
  msgCount = 0;
}

export function playerColor(id: string): string {
  const c = ['#a855f7','#ff0080','#00ff88','#ffaa00','#ff4444','#aa66ff','#7c3aed','#ff6600','#44ffaa','#ff2266','#8855ff','#c084fc'];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return c[Math.abs(h) % c.length];
}
