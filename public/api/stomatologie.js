// Serverless function for Vapi session - Stomatologie
// Assistant ID: 8726da32-22c5-4f95-bc6d-09e7e8b2594c (assuming similar pattern)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const VAPI_API_KEY = process.env.VAPI_API_KEY;
    const ASSISTANT_ID = process.env.VAPI_ASSISTANT_STOMATOLOGIE || '8726da32-22c5-4f95-bc6d-09e7e8b2594c';

    if (!VAPI_API_KEY) {
      return res.status(500).json({ error: 'Vapi API key not configured' });
    }

    const response = await fetch(`https://api.vapi.ai/assistant/${ASSISTANT_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error: `Vapi API error: ${error}` });
    }

    const assistant = await response.json();
    return res.status(200).json({ assistantId: ASSISTANT_ID });
  } catch (error) {
    console.error('Vapi session error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
