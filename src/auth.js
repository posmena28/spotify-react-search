const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI


function base64urlEncode(array) {
  let str = '';
  for (let i = 0; i < array.length; i++) {
    str += String.fromCharCode(array[i]);
  }
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateCodeVerifier() {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  // Reliable base64url encoding that doesn't use spread operator
  return base64urlEncode(array);
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64urlEncode(new Uint8Array(digest));
}

// Step 1: Send user to Spotify login ---------

export async function loginWithSpotify() {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem('code_verifier', verifier);

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: 'user-read-private',
        code_challenge_method: 'S256',
        code_challenge: challenge,
    });

    window.location = 'https://accounts.spotify.com/authorize?' + params;
}

// Step 2: Exchanging code for token (called from CallbackPage) ---------

export async function exchangeCodeForToken(code) {
  const verifier = localStorage.getItem('code_verifier');

  console.log('code:', code);
  console.log('verifier:', verifier);
  console.log('CLIENT_ID:', CLIENT_ID);
  console.log('REDIRECT_URI:', REDIRECT_URI);

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: verifier,
    }),
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.error_description ?? json.error);

  localStorage.setItem('access_token', json.access_token);
  localStorage.setItem('token_expiry', Date.now() + json.expires_in * 1000);
  return json.access_token;
}

// Helper function: Use in every API call
export function getToken() {
    return localStorage.getItem('access_token');
}

// returns true if token is missing or expired
export function isTokenExpired() {
    const token = localStorage.getItem('access_token');
    if (!token) return true;

    const expiry = localStorage.getItem('token_expiry');
    // if no expiry saved, assume valid rather than booting the user out
    if (!expiry) return false;

    return Date.now() > parseInt(expiry);
}

// clears all auth data - useful for logout or after expiry
export function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('code_verifier');
}