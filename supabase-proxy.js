// Прокси-функция для обхода CORS
exports.handler = async (event, context) => {
  const SB_URL = 'https://zutiselchauekvvoirgw.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dGlzZWxjaGF1ZWt2dm9pcmd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMyMTAzMiwiZXhwIjoyMDg2ODk3MDMyfQ.XghMDb_u3s1Yz9sg2XL22gW-UEjoyPmVRukq_vlxUwc';
  
  const { path, method, body } = JSON.parse(event.body || '{}');
  
  try {
    const response = await fetch(`${SB_URL}${path}`, {
      method: method || 'GET',
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json'
      },
      body: method !== 'GET' ? body : undefined
    });
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
