import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '../auth';

export default function CallbackPage() {
  const navigate = useNavigate();
  const didExchange = useRef(false);

  useEffect(() => {
    if (didExchange.current) return;
    didExchange.current = true;

    const code = new URLSearchParams(window.location.search).get('code');
    console.log('callback code from URL:', code);

    if (code) {
      exchangeCodeForToken(code)
        .then((token) => {
          console.log('Got token:', token);
          navigate('/');
        })
        .catch(err => {
          console.error('Token exchange failed:', err.message);
        });
    } else {
      console.log('No code found in URL');
    }
  }, []);

  return <p>Logging you in...</p>;
}