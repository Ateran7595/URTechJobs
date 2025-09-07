import { useState } from "react";

function InternshipTable({ internships }) {
    const [search, setSearch] = useState("");
    const [sortRecent, setSortRecent] = useState(false);
  
    // Filter + sort logic
    const filteredInternships = internships
      .filter((item) => {
        const query = search.toLowerCase();
        return (
          item.Company.toLowerCase().includes(query) ||
          item.Role.toLowerCase().includes(query) ||
          item.Location.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (!sortRecent) return 0;
        return parsePostedDate(b.Posted) - parsePostedDate(a.Posted);
      });
  
    return (
      <div className="md:w-full">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by name, role, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="flex items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              checked={sortRecent}
              onChange={() => setSortRecent(!sortRecent)}
              className="w-4 h-4"
            />
            Most Recent
          </label>
        </div>
        <div className="w-full overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-gray-100 text-left text-xs xs:text-sm sm:text-base">
                <th className="px-3 xs:px-4 sm:px-6 py-2 sm:py-3">Company</th>
                <th className="px-3 xs:px-4 sm:px-6 py-2 sm:py-3">Role</th>
                {/* Hidden on mobile */}
                <th className="px-3 xs:px-4 sm:px-6 py-2 sm:py-3 hidden sm:table-cell">Location</th>
                <th className="px-3 xs:px-4 sm:px-6 py-2 sm:py-3 hidden sm:table-cell">Posted</th>
                <th className="px-3 xs:px-4 sm:px-6 py-2 sm:py-3">Apply</th>
              </tr>
            </thead>
            <tbody>
              {filteredInternships.length > 0 ? (
                filteredInternships.map((item, i) => (
                  <tr
                    key={i}
                    className="odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition-colors text-xs xs:text-sm sm:text-base"
                  >
                    {/* Company */}
                    <td className="px-3 xs:px-4 sm:px-6 py-2 sm:py-3 font-medium text-blue-400">
                      {item.Company_URL ? (
                        <a
                          href={item.Company_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {item.Company}
                        </a>
                      ) : (
                        item.Company
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-3 xs:px-4 sm:px-6 py-2 sm:py-3 text-gray-200">
                      {item.Role}
                    </td>

                    {/* Location → hidden on mobile */}
                    <td className="px-3 xs:px-4 sm:px-6 py-2 sm:py-3 text-gray-200 hidden sm:table-cell">
                      {item.Location}
                    </td>

                    {/* Posted → hidden on mobile */}
                    <td className="px-3 xs:px-4 sm:px-6 py-2 sm:py-3 text-gray-400 hidden sm:table-cell">
                      {item.Posted}
                    </td>

                    {/* Apply */}
                    <td className="px-3 xs:px-4 sm:px-6 py-2 sm:py-3">
                      {item.Apply_URL ? (
                        <a
                          href={item.Apply_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 sm:px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition text-xs sm:text-sm"
                        >
                          Apply
                        </a>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-400 italic text-xs sm:text-sm"
                  >
                    No internships found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
}

function parsePostedDate(posted) {
    if (!posted) return new Date(0); // fallback
    
    const lower = posted.toLowerCase();
  
    // Handle "Xd" format (days)
    const dayMatch = lower.match(/^(\d+)d$/);
    if (dayMatch) {
      const d = new Date();
      d.setDate(d.getDate() - parseInt(dayMatch[1], 10));
      return d;
    }
  
    // Handle "Xmo" format (months)
    const monthMatch = lower.match(/^(\d+)mo$/);
    if (monthMatch) {
      const d = new Date();
      d.setMonth(d.getMonth() - parseInt(monthMatch[1], 10));
      return d;
    }
  
    // Fallback (if you ever get absolute dates like "Aug 15, 2025")
    const parsed = new Date(posted);
    return isNaN(parsed) ? new Date(0) : parsed;
  }

export default InternshipTable