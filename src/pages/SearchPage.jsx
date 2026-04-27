import { useState } from "react";
import { searchSpotify } from "../api/spotify";
import { loginWithSpotify, guestLogin, getToken } from "../auth";
import ResultCard from "../components/ResultCard";
import './SearchPage.css'
import spotifyLogo from '../assets/spotifyPNG.png'

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const isLoggedIn = Boolean(getToken());

    async function handleSearch(e) {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setSearched(true);

        try {
            const items = await searchSpotify(query);
            setResults(items);
        }   catch (err) {
            setError('Something went wrong. Try searching again.');
        }   finally {
            setLoading(false);
        }
    }

    // Not logged in -- show login prompt
    if (!isLoggedIn) {
        return (
            <div className="landing-page">
                <div className="landing__header">
                    <img src={spotifyLogo} alt="" />
                    <p>Created with Spotify's API</p>
                </div>
                <div className="landing">
                    <p>Connect to <span>Spotify</span> to start searching.</p>
                    <button className="login__btn" onClick={loginWithSpotify}>Login with Spotify</button>
                    <button
                        className="guest__login--btn"
                        onClick={async () => {
                            try {
                                await guestLogin();
                                // force re-render by reloading
                                window.location.reload();
                            } catch (err) {
                                alert('Guest login failed. Try again.');
                            }
                        }}>Continue as Guest</button>
                </div>
                <div className="landing__footer">
                    <p>© Spotify 2026</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: '2rem' }}>
                <input 
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search songs, albums, artists..."
                    style={{ flex: 1, padding: '8px 12px', fontSize: 14, borderRadius: 6, border: '1px solid #ccc' }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: '8px 16px', fontSize: 14, borderRadius: 6, cursor: 'pointer' }}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {/* Error Message */}
            {error && (
                <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>
            )}

            {/* No results message */}
            {searched && !loading && results.length === 0 && !error && (
                <p style={{ color: '#666' }}>No results found for "{query}".</p>
            )}

            {/* Results grid */}
            {results.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                }}>
                    {results.map(item => (
                        <ResultCard key={item.id} item={item} />
                    ))}
                </div>
            )}

        </div>
    );
}