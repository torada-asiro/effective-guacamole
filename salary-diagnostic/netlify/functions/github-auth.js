/**
 * Netlify Function: GitHub OAuth トークン交換
 * フロントエンドから code を受け取り、access_token に交換して返す
 */
exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const code = event.queryStringParameters?.code;
  if (!code) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing code parameter' }) };
  }

  const clientId     = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error' }) };
  }

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id:     clientId,
        client_secret: clientSecret,
        code
      })
    });

    const data = await res.json();

    if (data.error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: data.error_description || data.error })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ access_token: data.access_token })
    };

  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Token exchange failed: ' + e.message })
    };
  }
};
