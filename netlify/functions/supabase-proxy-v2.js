// Улучшенная прокси-функция для обхода CORS
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const SB_URL = 'https://zutiselchauekvvoirgw.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dGlzZWxjaGF1ZWt2dm9pcmd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMyMTAzMiwiZXhwIjoyMDg2ODk3MDMyfQ.XghMDb_u3s1Yz9sg2XL22gW-UEjoyPmVRukq_vlxUwc';

  try {
    // Parse request
    const { path, method, body: requestBody } = JSON.parse(event.body || '{}');
    
    console.log('Proxy request:', { path, method });

    // Make request to Supabase
    const response = await fetch(`${SB_URL}${path}`, {
      method: method || 'GET',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: (method && method !== 'GET' && requestBody) ? requestBody : undefined
    });

    const data = await response.json();
    console.log('Supabase response:', { status: response.status, dataLength: Array.isArray(data) ? data.length : 'not array' });

    return {
      statusCode: response.ok ? 200 : response.status,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      })
    };
  }
};
