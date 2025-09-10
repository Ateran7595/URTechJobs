import './App.css'
import { useState, useEffect } from "react";
import InternshipTable from './InternshipTable';

function App() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const API_URL = "https://urtechjobs.onrender.com";
      // const test = 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/internships`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setInternships(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  return (
    <div className='flex flex-col justify-center items-center gap-5 '>
      <h1 className='text-sky-400 font-semibold md:text-[50px] xs:text-[30px] font-bungee text-center'>
        Find Your Next Tech Internship!
      </h1>
      <h2 className='text-center font-inter font-semibold text-sky-200 md:text-2xl xs:text-[15px] '>
        Browse hundreds of openings and apply today
      </h2>
      {loading ? (
        <p className='text-sm text-gray-400 mt-2'>Loading Internships...</p>
      ) : (
        <InternshipTable internships={internships} />
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
