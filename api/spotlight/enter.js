// api/spotlight/enter.js  (Netlify function style)
exports.handler = async function (event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }
    let payload;
    try { payload = JSON.parse(event.body || '{}'); } catch { payload = {}; }

    const { userId } = payload;
    if (!userId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'userId required' }) };
    }

    // Example eligibility check placeholder:
    const eligible = true; // replace with real check e.g., check DB for recent activity

    if (!eligible) {
      return { statusCode: 403, body: JSON.stringify({ ok:false, error: 'not_eligible' }) };
    }

    // TODO: persist entry event to DB or queue
    // await db.addSpotlightEntry({ userId, timestamp: Date.now() });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message: `User ${userId} entered the spotlight` })
    };
  } catch (err) {
    console.error('Spotlight enter error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'internal_error' }) };
  }
};
