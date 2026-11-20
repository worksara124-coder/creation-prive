import { createRoot } from 'react-dom/client';
import '@fontsource/poppins/latin-300.css';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import './styles.css';
import App from './App.jsx';
import { scrollToHash } from './hooks/index.js';

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

createRoot(document.getElementById('root')).render(<App />);

// Arrivée directe sur une ancre (#collections, #maison, #contact).
if (window.location.hash) {
  const go = () => window.setTimeout(() => scrollToHash(window.location.hash), 120);
  if (document.readyState === 'complete') go();
  else window.addEventListener('load', go, { once: true });
}
