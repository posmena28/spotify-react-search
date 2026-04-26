import { getToken, isTokenExpired, logout } from '../auth';

// Central fetch wrapper — handles auth headers and 401s in one place
async function spotifyFetch(url) {
  if (isTokenExpired()) {
    logout();
    window.location = '/';
    throw new Error('Session expired. Please log in again.');
  }

  const token = getToken();
  const res = await fetch(url, {
    headers: { Authorization: 'Bearer ' + token },
  });

  if (res.status === 401) {
    logout();
    window.location = '/';
    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) throw new Error('Spotify API error: ' + res.status);

  return res.json();
}

export async function searchSpotify(query) {
  const params = new URLSearchParams({
    q: query,
    type: 'album,artist,track',
    limit: 6,
  });

  const data = await spotifyFetch(
    'https://api.spotify.com/v1/search?' + params
  );

  return [
    ...(data.albums?.items ?? []),
    ...(data.artists?.items ?? []),
    ...(data.tracks?.items ?? []),
  ].slice(0, 6);
}

export async function fetchAlbum(id) {
  return spotifyFetch(`https://api.spotify.com/v1/albums/${id}`);
}