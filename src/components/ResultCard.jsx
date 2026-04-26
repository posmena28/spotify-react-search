import { useNavigate } from "react-router-dom";

export default function ResultCard({ item }) {
    const navigate = useNavigate();

    // tracks have their image nested under item.album.images
    // albums and artists have item.images directly

    const image = item.images?.[1]?.url ?? item.album?.images?.[1]?.url;

    // artists don't have an item.artists array -- they ARE the artist
    const artist = item.artists?.[0]?.name ?? item.name;

    function handleClick() {
        // for tracks, navigate to the track's parent album
        const albumId = item.album?.id ?? item.id;
        navigate('/album/' + albumId);
    }

    return (
        <div onClick={handleClick} style={{
            cursor: 'pointer',
            background: 'var(--color-background-primary)',
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            overflow: 'hidden',
        }}>
            {image
                ? <img src={image} alt={item.name} style={{ width: '100%', display: 'block' }} />
                : <div style={{ width: '100%', aspectRatio: '1', background: '#f5f5f5' }} />
            }
            <div style={{ padding: '10px 12px' }}>
                <p style={{
                    margin: 0, fontSize: 14, fontWeight: 700,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white'
                }}>
                    {item.name}
                </p>
                <p style={{
                    margin: '2px 0 0', fontSize: 12,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white'
                }}>
                    {artist}
                </p>
            </div>
        </div>
    );
}