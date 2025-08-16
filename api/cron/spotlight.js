// api/cron/spotlight.js
// Cron handler to pick winner deterministically, allocate credits (demo), and send email via Resend API (if RESEND_API_KEY set).

const fs = require('fs');
const path = require('path');

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''; // set in Vercel

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

async function sendResendEmail(apiKey, to, subject, html) {
  if (!apiKey) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'TalentKonnect <noreply@talentkonnect.test>',
        to: [to],
        subject,
        html
      })
    });
    return res.ok;
  } catch (err) {
    console.error('email send error', err);
    return false;
  }
}

module.exports = async function (req, res) {
  try {
    const DATA_DIR = path.join(process.cwd(), 'data');
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

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
      } catch {
        return false;
      }
    });

    if (!todays.length) {
      return res.status(200).json({ ok: false, message: 'No entries today' });
    }

    // pick deterministic winner
    let best = todays[0];
    let bestHash = Number.POSITIVE_INFINITY;
    for (const u of todays) {
      const h = fnv1a32(`${today}:${u.id}`);
      if (h < bestHash) { bestHash = h; best = u; }
    }

    // persist winner (idempotent)
    const WINNERS_FILE = path.join(DATA_DIR, 'spotlight_winners.json');
    let winners = [];
    try { winners = JSON.parse(fs.readFileSync(WINNERS_FILE, 'utf8') || '[]'); } catch (e) { winners = []; }
    const existing = winners.find(w => w.date === today);
    if (!existing) {
      winners.unshift({ date: today, winner: { id: best.id, name: best.name, email: best.email }, createdAt: new Date().toISOString() });
      fs.writeFileSync(WINNERS_FILE, JSON.stringify(winners, null, 2));

      // allocate credits (demo)
      const creditsFile = path.join(DATA_DIR, 'credits.json');
      let credits = {};
      try { credits = JSON.parse(fs.readFileSync(creditsFile, 'utf8') || '{}'); } catch (e) { credits = {}; }
      credits[best.id] = (credits[best.id] || 0) + 10; // award 10 credits
      fs.writeFileSync(creditsFile, JSON.stringify(credits, null, 2));

      // send email if configured
      if (RESEND_API_KEY) {
        await sendResendEmail(RESEND_API_KEY, best.email, `You won Daily Spotlight (${today})`, `<h1>Congrats ${best.name}!</h1><p>You were awarded <b>10 credits</b>.</p>`);
      } else {
        console.log('RESEND_API_KEY not set: skipping email send.');
      }
    } else {
      console.log('Winner already selected for today', today);
    }

    return res.status(200).json({ ok: true, date: today, winner: best });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};
