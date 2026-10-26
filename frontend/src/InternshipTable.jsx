
import { useMemo, useState, useEffect } from "react";

function InternshipTable({ internships = [] }) {
  const [search, setSearch] = useState("");
  const [sortRecent, setSortRecent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 50;

  const filteredInternships = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = internships.filter((item) => {
      const company = String(item.Company ?? "").toLowerCase();
      const role = String(item.Role ?? "").toLowerCase();
      const location = String(item.Location ?? "").toLowerCase();

      return (
        company.includes(query) ||
        role.includes(query) ||
        location.includes(query)
      );
    });

    if (sortRecent) {
      filtered.sort(
        (a, b) =>
          parsePostedDate(b.Posted) - parsePostedDate(a.Posted)
      );
    }

    return filtered;
  }, [internships, search, sortRecent]);

  const totalPages = Math.ceil(filteredInternships.length / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const paginatedInternships = filteredInternships.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const firstResult = filteredInternships.length === 0
    ? 0
    : startIndex + 1;

  const lastResult = Math.min(
    startIndex + PAGE_SIZE,
    filteredInternships.length
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortRecent]);

  return (
    <section className="internship-section">

      {/* Search Toolbar */}
      <div className="search-controls">

        {/* Search Input */}
        <div className="search-input relative">

          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2
                       w-5 h-5 text-slate-500 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            type="search"
            placeholder="Search companies, roles, or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search internship opportunities"
            className="pl-12"
          />

        </div>

        {/* Sort Checkbox */}
        <label
          className="flex items-center gap-3 px-4 py-3
                     rounded-lg border border-slate-700
                     bg-slate-900/70
                     text-sm text-slate-300
                     whitespace-nowrap
                     hover:border-slate-600
                     transition-colors"
        >

          <input
            type="checkbox"
            checked={sortRecent}
            onChange={(e) => setSortRecent(e.target.checked)}
          />

          <span>Most Recent</span>

        </label>

      </div>

      {/* Results Information */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <p className="text-sm text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-200">
            {firstResult}–{lastResult}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-200">
            {filteredInternships.length}
          </span>{" "}
          internships
        </p>

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Internship Table */}
      <div className="internship-table-wrapper ">

        <table>

          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th className="hidden sm:table-cell">
                Location
              </th>
              <th className="hidden sm:table-cell">
                Posted
              </th>
              <th>Apply</th>
            </tr>
          </thead>

          <tbody>

            {filteredInternships.length > 0 ? (

              paginatedInternships.map((item, index) => (

                <tr key={item.Apply_URL || item.Company_URL || `${item.Company}-${item.Role}-${index}`}>

                  {/* Company */}
                  <td>

                    {item.Company_URL ? (

                      <a
                        href={item.Company_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="company-link"
                      >
                        {item.Company || "Unknown Company"}
                      </a>

                    ) : (

                      <span>
                        {item.Company || "Unknown Company"}
                      </span>

                    )}

                  </td>

                  {/* Role */}
                  <td>

                    <span className="block text-slate-200 font-medium">
                      {item.Role || "Internship"}
                    </span>

                    {/* Mobile location */}
                    <span className="block sm:hidden mt-1 text-xs text-slate-500">
                      {item.Location || "Location not specified"}
                    </span>

                    {/* Mobile posted date */}
                    <span className="block sm:hidden mt-1 text-xs text-slate-500">
                      Posted {item.Posted || "Recently"}
                    </span>

                  </td>

                  {/* Location */}
                  <td className="hidden sm:table-cell">
                    {item.Location || "Not specified"}
                  </td>

                  {/* Posted */}
                  <td className="hidden sm:table-cell">
                    {item.Posted || "Unknown"}
                  </td>

                  {/* Apply */}
                  <td>

                    {item.Apply_URL ? (

                      <a
                        href={item.Apply_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="apply-button"
                        aria-label={`Apply for ${item.Role || "internship"} at ${item.Company || "company"}`}
                      >
                        Apply

                        <svg
                          className="w-3.5 h-3.5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path d="M7 17 17 7" />
                          <path d="M7 7h10v10" />
                        </svg>

                      </a>

                    ) : (

                      <span className="text-slate-500 text-xs">
                        Unavailable
                      </span>

                    )}

                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan={5}>

                  <div className="empty-state">

                    <svg
                      className="w-10 h-10 mx-auto mb-4
                                 text-slate-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-4-4" />
                    </svg>

                    <p className="font-medium text-slate-300">
                      No internships found
                    </p>

                    <p className="text-sm mt-2">
                      Try another company, role, or location.
                    </p>

                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="btn btn-secondary mt-4"
                      >
                        Clear search
                      </button>
                    )}

                  </div>

                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => page - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              aria-label="Select internship page"
              className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
            >
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                const first = (page - 1) * PAGE_SIZE + 1;
                const last = Math.min(
                  page * PAGE_SIZE,
                  filteredInternships.length
                );

                return (
                  <option key={page} value={page}>
                    {first}–{last}
                  </option>
                );
              })}
            </select>

            <button
              type="button"
              onClick={() => setCurrentPage((page) => page + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">

        <p className="text-xs text-slate-500">
          Internship listings are subject to change.
        </p>

        {sortRecent && (
          <span className="text-xs text-indigo-400">
            Sorted by newest
          </span>
        )}

      </div>

    </section>
  );
}

/**
 * Convert relative or absolute posted dates into timestamps.
 *
 * Supported:
 * Today, Yesterday, 3h, 2d, 3w, 2mo, 1y
 * Absolute dates such as Aug 15, 2026
 */
function parsePostedDate(posted) {
  if (!posted) return 0;

  const value = String(posted).trim().toLowerCase();

  if (!value) return 0;

  const now = Date.now();

  if (value === "today") {
    return now;
  }

  if (value === "yesterday") {
    return now - 24 * 60 * 60 * 1000;
  }

  const match = value.match(
    /^(\d+)\s*(h|hr|hrs|hour|hours|d|day|days|w|wk|wks|week|weeks|mo|mos|month|months|y|yr|yrs|year|years)$/
  );

  if (match) {
    const amount = Number(match[1]);
    const unit = match[2];

    const milliseconds = {
      h: 60 * 60 * 1000,
      hr: 60 * 60 * 1000,
      hrs: 60 * 60 * 1000,
      hour: 60 * 60 * 1000,
      hours: 60 * 60 * 1000,

      d: 24 * 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,

      w: 7 * 24 * 60 * 60 * 1000,
      wk: 7 * 24 * 60 * 60 * 1000,
      wks: 7 * 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      weeks: 7 * 24 * 60 * 60 * 1000,

      mo: 30 * 24 * 60 * 60 * 1000,
      mos: 30 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      months: 30 * 24 * 60 * 60 * 1000,

      y: 365 * 24 * 60 * 60 * 1000,
      yr: 365 * 24 * 60 * 60 * 1000,
      yrs: 365 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
      years: 365 * 24 * 60 * 60 * 1000,
    };

    return now - amount * milliseconds[unit];
  }

  const parsed = Date.parse(posted);

  return Number.isNaN(parsed) ? 0 : parsed;
}

export default InternshipTable;
