exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { reference } = JSON.parse(event.body);
    if (!reference) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing reference' }) };
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server misconfigured' }) };
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.status) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: data.message || 'Verification failed' }) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        verified: data.data.status === 'success',
        reference: data.data.reference,
        amount: data.data.amount / 100,
        currency: data.data.currency,
        email: data.data.customer.email,
        paid_at: data.data.paid_at,
        channel: data.data.channel,
      }),
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
