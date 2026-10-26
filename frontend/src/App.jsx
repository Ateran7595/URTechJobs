
import './App.css';
import { useState, useEffect } from 'react';
import InternshipTable from './InternshipTable';

function App() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError('');

      const API_URL = 'https://urtechjobs.onrender.com';
      const res = await fetch(`${API_URL}/internships`);

      if (!res.ok) {
        throw new Error('Unable to load internships. Please try again.');
      }

      const data = await res.json();
      setInternships(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  return (
    <div className="min-h-screen app-background text-white">
      {/* Navigation */}
      <header className="app-container">
        <nav className="navbar">
          <a href="/" className="logo">
            <img src="/favicon.png" alt="URTechJobs logo" className="logo-icon" /> 
            <span>
               URTech<span className="brand-accent">Jobs</span>
            </span>
          </a>
        </nav>
      </header>

      <main className="app-container">
        {/* Internship listings */}
        <section id="internships" className="listings-section">
          <div className="listings-heading">
            <div>
              <p className="eyebrow">THE OPPORTUNITIES</p>
              <h2>Explore internships</h2>
              <p className="listings-description">
                Find a role that matches your skills and ambitions.
              </p>
            </div>

            <div className="listing-count">
              <span className="count-dot" />
              {loading
                ? 'Loading listings'
                : `${internships.length} listings`}
            </div>
          </div>

          <div className="internship-panel">
            {loading ? (
              <div className="status-message">
                <span className="loading-spinner" />
                <p>Finding opportunities for you...</p>
              </div>
            ) : error ? (
              <div className="status-message error-message">
                <span className="error-icon">!</span>
                <p>{error}</p>
                <button
                  type="button"
                  className="retry-button"
                  onClick={fetchInternships}
                >
                  Try again
                </button>
              </div>
            ) : (
              <InternshipTable internships={internships} />
            )}
          </div>
        </section>

        <footer className="app-footer">
          <p>
            <span className="footer-brand">URTechJobs</span>
            {' '}· Helping you find your next step in tech.
          </p>
          <a href="#top" onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            Back to top ↑
          </a>
        </footer>
      </main>
    </div>
  );
}

export default App;
