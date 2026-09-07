import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main>
      <p className="eyebrow">WINDOWKEEP · LOCAL DEVELOPMENT</p>
      <h1>Your windows, ready when you are.</h1>
      <p>Save your Chrome windows together and return to them later.</p>
      <section aria-labelledby="connection-heading">
        <h2 id="connection-heading">Browser connection</h2>
        <p>
          The desktop shell is ready. Chrome connection and workspace detection
          are the next milestone.
        </p>
        <span className="status">Not connected</span>
      </section>
    </main>
  );
}

const root = document.getElementById('root');
if (root === null) throw new Error('Application root element is missing');
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
