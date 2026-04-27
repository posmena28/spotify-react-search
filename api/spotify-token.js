export default async function handler(req, res) {
    const credentials = Buffer.from(
        process.env.REACT_APP_SPOTIFY_CLIENT_ID +
        ':' + 
        process.env.SPOTIFY_CLIENT_SECRET
    ).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + credentials,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ grant_type: 'client_credentials' }),
    });

    const data = await response.json();

    if (!response.ok) {
        return res.status(500).json({ error: data.error_description });
    }

    res.status(200).json({ access_token: data.access_token });
}