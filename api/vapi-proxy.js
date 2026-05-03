// Serverless function to proxy Vapi calls - keeps API keys secure
// Deploy this to your serverless backend (Vercel, Netlify, etc.)

export default async function handler(req, res) {
  // CORS headers - adjust for your domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { assistantId, action } = req.body;

    // Your PRIVATE API keys stored securely on the server
    const apiKeys = {
      '202bc2ca-6cf1-4e3e-a339-002a207b000f': process.env.VAPI_KEY_BARBERSHOP,
      'c2aba488-b8d1-45b7-8962-30930ca57f57': process.env.VAPI_KEY_ESTETIKA,
      '5b6584ac-b22c-4d0f-8a32-ae093cbe1b5c': process.env.VAPI_KEY_KADERNICTVI,
      '8726da32-22c5-4f95-bc6d-09e7e8b2594c': process.env.VAPI_KEY_STOMATOLOGIE,
      'ba1d1d22-bb87-4206-baaa-63b4e1871e26': process.env.VAPI_KEY_DENTALNI_HYGIENA,
      'c109c3eb-0db8-4f88-a782-b19d8f6e7d03': process.env.VAPI_KEY_MASAZE,
      '84232e9d-72de-4265-943e-4fc4a6794d5e': process.env.VAPI_KEY_FITNESS,
    };

    const apiKey = apiKeys[assistantId];

    if (!apiKey) {
      return res.status(400).json({ error: 'Unknown assistant ID' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured on server' });
    }

    // For Vapi, the web client needs the key directly
    // But we can return a session token or use public key approach
    // Best approach: Use Vapi's public API keys for frontend
    
    return res.status(200).json({ 
      message: 'Use Vapi Public API Key in frontend',
      needsPublicKey: true 
    });

  } catch (error) {
    console.error('Vapi proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
