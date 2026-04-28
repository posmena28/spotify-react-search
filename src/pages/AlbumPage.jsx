import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { fetchAlbum } from "../api/spotify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AlbumPage() {
    const { id }                = useParams();
    const navigate              = useNavigate();
    const [album, setAlbum]     = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const didFetch              = useRef(false);

    useEffect(() => {
        // useRef guard prevents double-fetch in React Strict Mode
        if (didFetch.current) return;
        didFetch.current = true;

        fetchAlbum(id)
            .then(data => setAlbum(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);   // re-runs if the user navigates from one album to another


    // --- Render states ---
    if (loading) return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <p style={{ color: '#666' }}>Loading album...</p>
        </div>
    );

    if (error) return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <p style={{ color: 'red' }}>{error}</p>
            <button onClick={() => navigate('/')}>Back to search</button>
        </div>
    );

    // --- Helpers ---
    const artists = album.artists.map(a => a.name).join(', ');
    const image = album.images[0]?.url;

    function msToMinSec(ms) {
        const min = Math.floor(ms / 60000);
        const sec = Math.floor((ms % 60000) / 1000);
        return `${min}:${sec.toString().padStart(2, '0')}`;
    }

    // --- Main render ---
    return (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
            <Navbar />

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                style={{ marginBottom: '1.5rem', cursor: 'pointer' }}
            >
                Back to search
            </button>

            {/* Album header */}
            <div style={{ display: 'flex', gap: 24, marginBottom: '2rem', alignItems: 'flex-start' }}>
                {image && (
                    <img 
                        src={image}
                        alt={album.name}
                        style={{ width: 180, height: 180, borderRadius: 8, flexShrink: 0 }}
                    />
                )}
                <div>
                    <p style={{ margin: '0 0 4px', fontSize: 13, color: 'white', textTransform: 'uppercase' }}>
                        {album.album_type}
                    </p>
                    <h1 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 500, color: 'white' }}>
                        {album.name}
                    </h1>
                    <p style={{ margin: '0 0 4px', fontSize: 15, color: 'white' }}>
                        {artists}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
                        {album.release_date.slice(0, 4)} · {album.total_tracks} tracks
                    </p>
                </div>
            </div>

            {/* Tracklist */}
            <div style={{ borderTop: '1px solid #eee' }}>
                {album.tracks.items.map((track, i) =>(
                    <div
                        key={track.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '10px 0',
                            borderBottom: '1px solid #eee',
                        }}
                    >
                        {/* Track number */}
                        <span style={{ width: 24, textAlign: 'right', fontSize: 13, color: '#999', flexShrink: 0 }}>
                            {i + 1}
                        </span>

                        {/* Track name */}
                        <span style={{ flex: 1, fontSize: 14, color: 'white' }}>
                            {track.name}
                        </span>

                        {/* Preview player -- only shown if Spotify provides a URL */}
                        {track.preview_url ? (
                            <audio
                                controls
                                src={track.preview_url}
                                style={{ height: 28, flexShrink: 0 }}
                            />
                        ) : (
                            <span style={{ fontSize: 12, color: '#bbb', flexShrink: 0 }}>
                                no preview
                            </span>
                        )}

                        {/* Duration */}
                        <span style={{ fontSize: 13, color: '#666', flexShrink: 0 }}>
                            {msToMinSec(track.duration_ms)}
                        </span>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}