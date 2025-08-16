// api/spotlight/eligible.js
const fs = require('fs');
const path = require('path');

module.exports = function (req, res) {
  try {
    const DATA_DIR = path.join(process.cwd(), 'data');
    const file = path.join(DATA_DIR, 'qualification_submissions.json');
    let arr = [];
    try { arr = JSON.parse(fs.readFileSync(file, 'utf8') || '[]'); } catch (e) { arr = []; }
    const users = arr.slice(0, 500).map(x => ({ id: x.id || x.email, name: x.fullName || x.name || 'Unknown', email: x.email }));
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};
