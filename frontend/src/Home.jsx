import React from 'react'
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    
    return (
        <div className='flex flex-col gap-3'>
            <h1 className='text-sky-400 font-semibold text-[90px] font-bungee'>URTechJobs</h1>
            <h2 className='text-center font-inter font-semibold text-sky-200 text-2xl'>
                Finding Tech Internships has never been easier!
            </h2>
            <div className='flex justify-center items-center gap-3'>
                <button
                onClick={() => navigate("/internships")}
                className="px-6 py-2 rounded-2xl bg-sky-400 text-white font-semibold hover:bg-sky-600 hover:cursor-pointer"
                >
                Browse Internships
                </button>
                <button 
                onClick={() => navigate("/resumeupgrader")}
                className='px-6 py-2 rounded-2xl bg-emerald-400 text-white font-semibold hover:bg-emerald-600 hover:cursor-pointer'>Improve My Resume</button>
            </div>
        </div>
    )
}

export default Home