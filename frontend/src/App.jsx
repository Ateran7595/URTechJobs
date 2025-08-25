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
      const res = await fetch("http://127.0.0.1:8000/internships");
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
      <h1 className='text-sky-400 font-semibold text-[50px] font-bungee text-center'>
        Find Your Next Tech Internship!
      </h1>
      <h2 className='text-gray-300 text-center text-lg mt-2'>
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
