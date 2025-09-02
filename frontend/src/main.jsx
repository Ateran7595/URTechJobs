import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Home from './home.jsx'
import ResumeUpgrader from './ResumeUpgrader.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/internships" element={<App />} />
        <Route path="/resumeupgrader" element={<ResumeUpgrader />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
