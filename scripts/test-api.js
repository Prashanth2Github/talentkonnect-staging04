// scripts/test-api.js
const fetch = (...args) => import('node-fetch').then(m => m.default(...args));
(async () => {
  const base = 'http://localhost:8888/api';
  const tests = [
    { url: `${base}/credits/allocate`, body: { userId:'auto', amount: 5 }, expect: 200 },
    { url: `${base}/credits/allocate`, body: { userId:'auto', amount: 0 }, expect: 400 },
    { url: `${base}/spotlight/enter`, body: { userId:'auto' }, expect: 200 },
  ];
  for (const t of tests) {
    const res = await fetch(t.url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(t.body) })
    console.log(t.url, '=>', res.status);
    const text = await res.text();
    console.log('Body:', text);
    if (res.status !== t.expect) process.exitCode = 2;
  }
  console.log('Done.');
})();
