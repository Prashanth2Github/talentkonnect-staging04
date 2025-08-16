// api/spotlight/winner.js
const fs = require('fs');
const path = require('path');

// local FNV1a implementation (same algorithm as client)
function fnv1a32(str) {
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function dateISTString(d = new Date()) {
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const ist = new Date(utc + 5.5 * 60 * 60000);
  return ist.toISOString().slice(0, 10);
}

module.exports = function (req, res) {
  try {
    const DATA_DIR = path.join(process.cwd(), 'data');
    const ENTRIES_FILE = path.join(DATA_DIR, 'spotlight_entries.json');
    let entries = [];
    try { entries = JSON.parse(fs.readFileSync(ENTRIES_FILE, 'utf8') || '[]'); } catch (e) { entries = []; }

    const today = dateISTString(new Date());
    const todays = entries.filter(e => {
      try {
        const created = new Date(e.createdAt);
        const utc = created.getTime() + (created.getTimezoneOffset() * 60000);
        const ist = new Date(utc + 5.5 * 60 * 60000);
        return ist.toISOString().slice(0, 10) === today;
      } catch (err) {
        return false;
      }
    });

    if (!todays.length) return res.status(200).json({ date: today, winner: null });

    // deterministic pick: smallest fnv hash
    let best = todays[0];
    let bestHash = Number.POSITIVE_INFINITY;
    for (const u of todays) {
      const h = fnv1a32(`${today}:${u.id}`);
      if (h < bestHash) { bestHash = h; best = u; }
    }

    // If winners file already contains today's winner, return it instead (idempotent)
    const WINNERS_FILE = path.join(DATA_DIR, 'spotlight_winners.json');
    let winners = [];
    try { winners = JSON.parse(fs.readFileSync(WINNERS_FILE, 'utf8') || '[]'); } catch (e) { winners = []; }
    const existing = winners.find(w => w.date === today);
    if (existing) {
      return res.status(200).json({ date: today, winner: existing.winner });
    } else {
      // Not persisted here (cron will persist). Return candidate
      return res.status(200).json({ date: today, winner: { id: best.id, name: best.name, email: best.email } });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ date: new Date().toISOString().slice(0, 10), winner: null });
  }
};
