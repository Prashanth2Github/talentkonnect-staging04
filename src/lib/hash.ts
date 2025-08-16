// src/lib/hash.ts
// FNV-1a 32-bit hash + deterministic pickWinner for client-side usage.

export function fnv1a32(str: string): number {
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export type UserEntry = { id: string; name?: string; email?: string };

export function pickWinner(dateIST: string, users: UserEntry[]): UserEntry | null {
  if (!users || users.length === 0) return null;
  let best = users[0];
  let bestHash = Number.POSITIVE_INFINITY;
  for (const u of users) {
    const h = fnv1a32(`${dateIST}:${u.id}`);
    if (h < bestHash) {
      bestHash = h;
      best = u;
    }
  }
  return best;
}
