import React from 'react'
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    
    return (
        <div className='flex flex-col gap-3'>
            <h1 className='text-sky-400 font-semibold md:text-[90px] xs:text-[42px] text-center font-bungee'>URTechJobs</h1>
            <h2 className='text-center font-inter font-semibold text-sky-200 md:text-2xl xs:text-[15px] '>
                Finding Tech Internships has never been easier!
            </h2>
            <div className='flex justify-center items-center gap-3'>
                <button
                onClick={() => navigate("/internships")}
                className="md:px-6 xs:px-3 py-2 md:text-[15px] xs:text-[12px] rounded-2xl bg-sky-400 text-white md:font-semibold xs:font-bold hover:bg-sky-600 hover:cursor-pointer"
                >
                Browse Internships
                </button>
                <button 
                onClick={() => navigate("/resumeupgrader")}
                className='md:px-6 xs:px-3 py-2 md:text-[15px] xs:text-[12px] rounded-2xl bg-emerald-400 text-white md:font-semibold xs:font-bold hover:bg-emerald-600 hover:cursor-pointer'>Improve My Resume</button>
            </div>
        </div>
    )
}

export default Home