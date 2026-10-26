import React from 'react'
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col gap-3'>
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
            <section className="hero-section">
                <div className="hero-glow" aria-hidden="true" />

                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="status-dot" />
                        Your next opportunity starts here
                    </div>

                    <h1 className="hero-title">
                        Your future in tech
                        <br />
                        starts <span>here.</span>
                    </h1>

                    <p className="hero-description">
                        Discover tech internships, explore new opportunities,
                        and take the next step toward your career.
                    </p>

                    <a onClick={() => navigate("/internships")} className="hero-button cursor-pointer">
                        Find your internship
                        <span aria-hidden="true">↓</span>
                    </a>
                    {/* <a onClick={() => navigate("/resumeupgrader")} className='hero-button bg-green-500 cursor-pointer'>
                        Improve My Resume
                    </a> */}

                </div>
            </section>
        </div>
    )
}

export default Home