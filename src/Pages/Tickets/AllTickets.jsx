import React, { useDeferredValue, useMemo, useState } from "react";
import TicketCard from "../../Components/Cards/TicketCard";
import useAllTickets from "../../QueryOptions/UserFunctions/allTicketQuery";
import AllTicketsSkeleton from "../../Components/skeletons/AllTicketsSkeleton";

const PAGE_SIZES = [6, 9];

const safeLower = (v) => (typeof v === "string" ? v.toLowerCase() : "");
const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const getPageItems = (current, total) => {
  // returns array of numbers and "…" for ellipsis
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items = new Set([1, total, current, current - 1, current + 1]);
  const pages = Array.from(items)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out = [];
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const prev = pages[i - 1];
    if (i > 0 && p - prev > 1) out.push("…");
    out.push(p);
  }
  return out;
};

const AllTickets = () => {
  const query = useAllTickets();
  const tickets = query.data ?? [];

  // v4/v5 safe initial loading detection
  const isInitialLoading = query.isPending ?? query.isLoading;

  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [transportFilter, setTransportFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("none"); // low-high | high-low | none
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [currentPage, setCurrentPage] = useState(1);

  // Defer text input to keep typing smooth on large lists
  const deferredFrom = useDeferredValue(searchFrom);
  const deferredTo = useDeferredValue(searchTo);

  const transportTypes = useMemo(() => {
    const types = new Set();
    for (const t of tickets) {
      if (t?.transportType) types.add(t.transportType);
    }
    return ["all", ...Array.from(types)];
  }, [tickets]);

  const processedTickets = useMemo(() => {
    let result = Array.isArray(tickets) ? [...tickets] : [];

    const fromQ = deferredFrom.trim().toLowerCase();
    const toQ = deferredTo.trim().toLowerCase();

    if (fromQ) {
      result = result.filter((t) => safeLower(t?.from).includes(fromQ));
    }

    if (toQ) {
      result = result.filter((t) => safeLower(t?.to).includes(toQ));
    }

    if (transportFilter !== "all") {
      result = result.filter((t) => t?.transportType === transportFilter);
    }

    if (sortOrder === "low-high") {
      result.sort(
        (a, b) =>
          (safeNumber(a?.price) ?? Infinity) -
          (safeNumber(b?.price) ?? Infinity)
      );
    } else if (sortOrder === "high-low") {
      result.sort(
        (a, b) =>
          (safeNumber(b?.price) ?? -Infinity) -
          (safeNumber(a?.price) ?? -Infinity)
      );
    }

    return result;
  }, [tickets, deferredFrom, deferredTo, transportFilter, sortOrder]);

  // Initial load: skeleton
  if (isInitialLoading) return <AllTicketsSkeleton count={pageSize} />;

  // Error
  if (query.isError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-destructive">
                Failed to load tickets. Please try again.
              </p>
              <button
                type="button"
                onClick={() => query.refetch()}
                className="btn btn-sm btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(processedTickets.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const currentPageTickets = processedTickets.slice(
    startIndex,
    startIndex + pageSize
  );

  const pageItems = getPageItems(currentPageSafe, totalPages);

  const resetFilters = () => {
    setSearchFrom("");
    setSearchTo("");
    setTransportFilter("all");
    setSortOrder("none");
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                All Tickets
              </h1>
              {query.isFetching && (
                <span
                  className="loading loading-spinner loading-sm text-primary"
                  aria-label="Refreshing tickets"
                />
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Search, filter, and sort tickets to find the best option for you.
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="btn btn-sm btn-ghost"
          >
            Clear filters
          </button>
        </div>

        {/* Controls */}
        <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 md:grid-cols-5">
            {/* From */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                From
              </label>
              <input
                type="text"
                value={searchFrom}
                onChange={(e) => {
                  setSearchFrom(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="e.g. Dhaka"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Search by origin"
              />
            </div>

            {/* To */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                To
              </label>
              <input
                type="text"
                value={searchTo}
                onChange={(e) => {
                  setSearchTo(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="e.g. Chittagong"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Search by destination"
              />
            </div>

            {/* Transport */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Transport
              </label>
              <select
                value={transportFilter}
                onChange={(e) => {
                  setTransportFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Filter by transport type"
              >
                {transportTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All" : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Sort by price
              </label>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Sort tickets by price"
              >
                <option value="none">Default</option>
                <option value="low-high">Low → High</option>
                <option value="high-low">High → Low</option>
              </select>
            </div>

            {/* Page size */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Per page
              </label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Tickets per page"
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid / Empty */}
        <div className="mt-6">
          {currentPageTickets.length === 0 ? (
            <div className="rounded-xl border border-border bg-card px-6 py-10 text-center">
              <p className="text-sm font-medium text-foreground">
                No tickets found
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try changing your search, filter, or sort options.
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn btn-sm btn-primary"
                >
                  Clear filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentPageTickets.map((ticket) => (
                <TicketCard key={ticket?._id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {processedTickets.length > 0 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {startIndex + 1}-
                {Math.min(startIndex + pageSize, processedTickets.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {processedTickets.length}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(currentPageSafe - 1)}
                disabled={currentPageSafe === 1}
                className="btn btn-sm"
              >
                Previous
              </button>

              <div className="join">
                {pageItems.map((item, idx) => {
                  if (item === "…") {
                    return (
                      <button
                        key={`ellipsis-${idx}`}
                        type="button"
                        className="btn btn-sm join-item"
                        disabled
                        aria-hidden="true"
                      >
                        …
                      </button>
                    );
                  }

                  const page = item;
                  const isActive = page === currentPageSafe;

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      className={[
                        "btn btn-sm join-item",
                        isActive ? "btn-primary" : "btn-ghost",
                      ].join(" ")}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => goToPage(currentPageSafe + 1)}
                disabled={currentPageSafe === totalPages}
                className="btn btn-sm"
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
