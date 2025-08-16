// api/qualification/submit.js
const fs = require('fs');
const path = require('path');

module.exports = function (req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const contentType = req.headers['content-type'] || '';
  const dataPromise = new Promise((resolve, reject) => {
    if (req.body) return resolve(req.body);
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      if (contentType.includes('application/json')) {
        try { resolve(JSON.parse(raw)); } catch (e) { reject(e); }
      } else {
        reject(new Error('Unsupported content-type'));
      }
    });
    req.on('error', reject);
  });

  dataPromise.then((body) => {
    const { fullName, email, phone, education } = body || {};
    if (!fullName || !email) return res.status(400).json({ error: 'Missing fields' });

    const DATA_DIR = path.join(process.cwd(), 'data');
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

    const file = path.join(DATA_DIR, 'qualification_submissions.json');
    let arr = [];
    try { arr = JSON.parse(fs.readFileSync(file, 'utf8') || '[]'); } catch (e) { arr = []; }
    const id = `${email}_${Date.now()}`;
    arr.unshift({ id, fullName, email, phone, education, createdAt: new Date().toISOString() });
    fs.writeFileSync(file, JSON.stringify(arr, null, 2));
    res.status(200).json({ ok: true, id });
  }).catch((err) => {
    console.error(err);
    res.status(400).json({ error: 'Invalid request body' });
  });
};
