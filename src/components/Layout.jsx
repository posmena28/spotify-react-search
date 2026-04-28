import { useNavigate } from "react-router-dom";
import spotifyLogo from '../assets/spotifyPNG.png';
import '../components/Layout.css'
import { getToken, logout } from "../auth";

export default function Layout({ children }) {
    const navigate = useNavigate();
    const isLoggedIn = Boolean(getToken());

    function logoutUser() {
        logout();
        navigate('/');
        window.location.reload();
    }

    return (
        <div className="layout">
            <header className='layout__header'>
                <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src={spotifyLogo} alt="" />
                </div>
                <p>Created with Spotify's API</p>
                {isLoggedIn ? <button className="logout__btn" onClick={logoutUser}>Logout</button> : null}
            </header>
            <main className="layout__body">
                <div className="layout__content">
                    {children}
                </div>
            </main>
            <footer className="layout__footer">
                <div className="layout__footer--inner">
                    <p>© Spotify 2026</p>
                    <p>Powered by Spotify's API</p>
                </div>
            </footer>
        </div>
    )
}