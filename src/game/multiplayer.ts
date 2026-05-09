// Cross-device multiplayer using Supabase Realtime broadcast channels.
// Players on any network sharing the same room code will sync.
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

const MY_ID = 'p' + Math.random().toString(36).slice(2, 8);
let ch: RealtimeChannel | null = null;
let roomCode: string | null = null;
let msgCount = 0;
let handler: ((msg: any) => void) | null = null;

export const myId = () => MY_ID;
export const getRoom = () => roomCode;
export const getMsgCount = () => msgCount;

export function open(code: string) {
  close();
  roomCode = code;
  msgCount = 0;
  ch = supabase.channel('cc' + code, {
    config: { broadcast: { self: false, ack: false } },
  });
  ch.on('broadcast', { event: 'msg' }, (payload: any) => {
    try {
      const d = payload?.payload;
      if (d && typeof d === 'object' && d._f !== MY_ID) {
        msgCount++;
        handler?.(d);
      }
    } catch (_) {}
  });
  ch.subscribe();
}

export function onMessage(fn: (msg: any) => void) {
  handler = fn;
}

export function send(kind: string, data: any = {}) {
  if (!ch) return;
  try {
    ch.send({ type: 'broadcast', event: 'msg', payload: { k: kind, _f: MY_ID, d: data } });
  } catch (_) {}
}

export function close() {
  try { if (ch) supabase.removeChannel(ch); } catch (_) {}
  ch = null;
  roomCode = null;
  msgCount = 0;
  handler = null;
}

export function playerColor(id: string): string {
  const c = ['#a855f7','#ff0080','#00ff88','#ffaa00','#ff4444','#aa66ff','#7c3aed','#ff6600','#44ffaa','#ff2266','#8855ff','#c084fc'];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return c[Math.abs(h) % c.length];
}
