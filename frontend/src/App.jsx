
import './App.css';
import { useState, useEffect } from 'react';
import InternshipTable from './InternshipTable';

// const API_URL = 'https://urtechjobs.onrender.com';
const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [jobType, setJobType] = useState('internships');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError('');
        setJobs([]);

        const endpoint =
          jobType === 'internships'
            ? '/internships'
            : '/newgrad';

        const res = await fetch(`${API_URL}${endpoint}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(
            'Unable to load positions. Please try again.'
          );
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error('Unexpected response from server.');
        }

        setJobs(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchJobs();

    return () => controller.abort();
  }, [jobType, retryCount]);

  const isInternship = jobType === 'internships';

  return (
    <div className="min-h-screen app-background text-white">
      {/* Navigation */}
      <header className="app-container">
        <nav className="navbar">
          <a href="/" className="logo">
            <img
              src="/favicon.png"
              alt="URTechJobs logo"
              className="logo-icon"
            />
            <span>
              URTech<span className="brand-accent">Jobs</span>
            </span>
          </a>
        </nav>
      </header>

      <main className="app-container">
        <section id="opportunities" className="listings-section">

          {/* Job category toggle */}
          <div className="job-type-container">
            <div className="job-type-toggle">
              <button
                type="button"
                className={`job-type-button ${
                  isInternship ? 'active' : ''
                }`}
                onClick={() => setJobType('internships')}
                aria-pressed={isInternship}
              >
                Internships
              </button>

              <button
                type="button"
                className={`job-type-button ${
                  !isInternship ? 'active' : ''
                }`}
                onClick={() => setJobType('newgrad')}
                aria-pressed={!isInternship}
              >
                New Grad
              </button>
            </div>
          </div>

          {/* Listings heading */}
          <div className="listings-heading">
            <div>
              <p className="eyebrow">THE OPPORTUNITIES</p>

              <h2>
                {isInternship
                  ? 'Explore internships'
                  : 'Explore new grad positions'}
              </h2>

              <p className="listings-description">
                {isInternship
                  ? 'Find an internship that matches your skills and ambitions.'
                  : 'Discover entry-level opportunities and launch your career in tech.'}
              </p>
            </div>

            <div className="listing-count">
              <span className="count-dot" />
              {loading
                ? 'Loading listings'
                : `${jobs.length} listings`}
            </div>
          </div>

          {/* Listings panel */}
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
                  onClick={() => setRetryCount(count => count + 1)}
                >
                  Try again
                </button>
              </div>
            ) : (
              <InternshipTable
                key={jobType}
                internships={jobs}
                jobType={jobType}
              />
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="app-footer">
          <p>
            <span className="footer-brand">URTechJobs</span>
            {' '}· Helping you find your next step in tech.
          </p>

          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }}
          >
            Back to top ↑
          </a>
        </footer>
      </main>
    </div>
  );
}

export default App;
