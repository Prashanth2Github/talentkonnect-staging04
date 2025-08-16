// api/credits/allocate.js
exports.handler = async function (event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    let payload;
    try {
      payload = JSON.parse(event.body || '{}');
    } catch (e) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const { userId, amount } = payload;
    if (!userId || typeof userId !== 'string') {
      return { statusCode: 400, body: JSON.stringify({ error: 'userId required' }) };
    }
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'amount must be a positive number' }) };
    }

    // TODO: Integrate with your DB / payment / ledger. For demo we just return success.
    // e.g., await db.allocateCredits(userId, n);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message: `Allocated ${n} credits to ${userId}`, userId, amount: n })
    };
  } catch (err) {
    console.error('Allocate error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'internal_error', details: String(err) }) };
  }
};
