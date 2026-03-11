import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const SHOP_ID = Deno.env.get('YK_SHOP_ID')!;
const SECRET  = Deno.env.get('YK_SECRET_KEY')!;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const { description, returnUrl, code } = await req.json();

    if (!description || !returnUrl || !code) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: CORS });
    }

    const resp = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': code + '-' + Date.now(),
        'Authorization': 'Basic ' + btoa(`${SHOP_ID}:${SECRET}`),
      },
      body: JSON.stringify({
        amount:       { value: '490.00', currency: 'RUB' },
        confirmation: { type: 'redirect', return_url: returnUrl },
        description,
        metadata:     { companyCode: code },
        capture:      true,
      }),
    });

    const payment = await resp.json();

    if (!resp.ok) {
      console.error('YooKassa error:', JSON.stringify(payment));
      return new Response(JSON.stringify({ error: payment.description || 'YooKassa error' }), { status: 502, headers: CORS });
    }

    return new Response(
      JSON.stringify({ url: payment.confirmation?.confirmation_url ?? null, paymentId: payment.id }),
      { status: 200, headers: CORS }
    );
  } catch (e) {
    console.error('create-payment exception:', e);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: CORS });
  }
});
