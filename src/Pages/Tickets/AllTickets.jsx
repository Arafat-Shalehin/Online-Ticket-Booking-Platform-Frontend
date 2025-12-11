import { useEffect, useMemo, useState } from "react";
import TicketCard from "../../Components/Cards/TicketCard";
import useAllTickets from "../../QueryOptions/allTicketQuery";
import Loader from "../../Components/Common/Loader";

const PAGE_SIZE = 6;

const AllTickets = () => {
  const { data, isFetching, isError } = useAllTickets();
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [transportFilter, setTransportFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("none"); // 'low-high' | 'high-low' | 'none'
  const [currentPage, setCurrentPage] = useState(1);
  const [progress, setProgress] = useState(0);

  const tickets = data;
//   console.log(tickets);

  useEffect(() => {
    if (!isFetching) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFetching]);

  // Unique transport types for filter dropdown
  const transportTypes = useMemo(
    () => ["all", ...Array.from(new Set(tickets.map((t) => t.transportType)))],
    [tickets]
  );

  // Derived list: search -> filter -> sort
  const processedTickets = useMemo(() => {
    let result = [...tickets];

    // Search by From
    if (searchFrom.trim()) {
      const query = searchFrom.trim().toLowerCase();
      result = result.filter((t) => t.from.toLowerCase().includes(query));
    }

    // Search by To
    if (searchTo.trim()) {
      const query = searchTo.trim().toLowerCase();
      result = result.filter((t) => t.to.toLowerCase().includes(query));
    }

    // Filter by transport type
    if (transportFilter !== "all") {
      result = result.filter((t) => t.transportType === transportFilter);
    }

    // Sort by price
    if (sortOrder === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [tickets, searchFrom, searchTo, transportFilter, sortOrder]);

  //   Loading and error
  if (isFetching) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Finding All Available Tickets..."
          subMessage="Accessing admin approved tickets..."
          progress={progress}
        />
      </div>
    );
  }
  if (isError)
    return (
      <p className="mt-50 flex justify-center items-center text-2xl text-red-400 font-semibold">
        Failed to load tickets
      </p>
    );

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(processedTickets.length / PAGE_SIZE)
  );
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * PAGE_SIZE;
  const currentPageTickets = processedTickets.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const handleSearchFromChange = (e) => {
    setSearchFrom(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchToChange = (e) => {
    setSearchTo(e.target.value);
    setCurrentPage(1);
  };

  const handleTransportFilterChange = (e) => {
    setTransportFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">All Tickets</h1>
            <p className="mt-1 text-sm text-slate-500">
              Search, filter, and sort tickets to find the best option for you.
            </p>
          </div>
        </div>

        {/* Controls: Search, Filter, Sort */}
        <div className="mt-6 rounded-xl bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 md:grid-cols-4">
            {/* From */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                From
              </label>
              <input
                type="text"
                value={searchFrom}
                onChange={handleSearchFromChange}
                placeholder="e.g. Dhaka"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* To */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                To
              </label>
              <input
                type="text"
                value={searchTo}
                onChange={handleSearchToChange}
                placeholder="e.g. Chittagong"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Transport Type Filter */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                Transport Type
              </label>
              <select
                value={transportFilter}
                onChange={handleTransportFilterChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {transportTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All" : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort by Price */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                Sort by Price
              </label>
              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="none">Default</option>
                <option value="low-high">Low to High</option>
                <option value="high-low">High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="mt-6">
          {currentPageTickets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500">
              No tickets found for the selected criteria.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {currentPageTickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {processedTickets.length > 0 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold">
                {startIndex + 1}-
                {Math.min(startIndex + PAGE_SIZE, processedTickets.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold">{processedTickets.length}</span>{" "}
              tickets
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPageSafe - 1)}
                disabled={currentPageSafe === 1}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:text-slate-300"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  const isActive = page === currentPageSafe;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`h-8 w-8 rounded-lg text-xs font-semibold ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(currentPageSafe + 1)}
                disabled={currentPageSafe === totalPages}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:text-slate-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTickets;
