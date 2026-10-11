import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import api from "../lib/api";

const categories = [
  "Streetlights",
  "Roads & Potholes",
  "Garbage & Waste Management",
  "Water Supply",
  "Public Water Taps",
  "Public Toilets & Sanitation",
  "Trees & Green Spaces",
  "Traffic Signals & Road Signs",
  "Public Transport Infrastructure",
  "Footpaths & Public Infrastructure",
  "Electrical Infrastructure",
  "Drainage & Waterlogging",
  "Other",
];

const statusOptions = [
  { value: "submitted", label: "Submitted" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
];

function getStatusStyle(status) {
  if (status === "resolved") {
    return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
  }

  if (status === "in_progress") {
    return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
  }

  return "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
}

function getStatusLabel(status) {
  if (status === "in_progress") return "In progress";
  if (status === "resolved") return "Resolved";
  return "Submitted";
}

export default function PublicIssues() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api
      .get("/api/complaints", {
        params: {
          category,
          status,
        },
      })
      .then((r) => {
        setItems(r.data.complaints || []);
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, status]);

  const hasFilters = category || status;

  function clearFilters() {
    setCategory("");
    setStatus("");
  }

  return (
    <div className="min-h-screen bg-[#f8fafb] text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Public civic issues
            </h1>

          </div>
        </div>

        {/* FILTER SECTION */}
        <div className="mt-8 rounded-3xl bg-white dark:bg-slate-900 p-4 shadow-[0_6px_25px_rgba(15,23,42,0.05)] ring-1 ring-slate-200/70 dark:ring-slate-700/70 sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300">
                <SlidersHorizontal size={18} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  Filter issues
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Narrow down public complaints
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* CATEGORY */}
              <div className="relative">
                <Filter
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2.5 pl-9 pr-10 text-sm outline-none transition focus:border-teal-500 dark:focus:border-teal-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 sm:w-64"
                >
                  <option value="">All categories</option>

                  {categories.map((categoryName) => (
                    <option key={categoryName} value={categoryName}>
                      {categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 dark:focus:border-teal-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 sm:w-44"
              >
                <option value="">All statuses</option>

                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

            </div>
          </div>

          {/* ACTIVE FILTERS */}
          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">

              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Active filters:
              </span>

              {category && (
                <button
                  onClick={() => setCategory("")}
                  className="flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950/50 px-3 py-1.5 text-xs font-medium text-teal-700 dark:text-teal-300"
                >
                  {category}
                  <X size={13} />
                </button>
              )}

              {status && (
                <button
                  onClick={() => setStatus("")}
                  className="flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950/50 px-3 py-1.5 text-xs font-medium text-teal-700 dark:text-teal-300"
                >
                  {getStatusLabel(status)}
                  <X size={13} />
                </button>
              )}

              <button
                onClick={clearFilters}
                className="ml-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 shadow-sm"
              >
                <div className="h-48 animate-pulse bg-slate-200 dark:bg-slate-700" />

                <div className="space-y-3 p-5">
                  <div className="h-3 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CARDS */}
        {!loading && items.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {items.map((complaint) => (
              <div
                key={complaint._id}
                onClick={() => navigate(`/issues/${complaint._id}`)}
                className="group cursor-pointer overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                {/* IMAGE */}
                {complaint.beforePhoto?.url ? (
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={complaint.beforePhoto.url}
                      alt={complaint.category}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    <span
                      className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${getStatusStyle(
                        complaint.status
                      )}`}
                    >
                      {getStatusLabel(complaint.status)}
                    </span>
                  </div>
                ) : (
                  <div className="relative grid h-48 place-items-center bg-slate-100 dark:bg-slate-800">
                    <MapPin size={34} className="text-slate-300 dark:text-slate-400" />

                    <span
                      className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${getStatusStyle(
                        complaint.status
                      )}`}
                    >
                      {getStatusLabel(complaint.status)}
                    </span>
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                      {complaint.category}
                    </span>

                    <span className="text-xs text-slate-400 dark:text-slate-400">
                      #{complaint._id.slice(-6)}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    {complaint.description}
                  </p>

                  {/* INFO */}
                  <div className="mt-4 space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4">

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin size={14} className="shrink-0 text-teal-600 dark:text-teal-300" />
                      <span>Exact location</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Users size={14} className="shrink-0 text-teal-600 dark:text-teal-300" />
                      <span>
                        {complaint.affectedCount || 1} affected
                      </span>
                    </div>

                  </div>

                  {/* FOOTER */}
                  <div className="mt-5 flex items-center justify-between">

                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      West Bengal
                    </span>

                    <span className="flex items-center gap-1 text-sm font-semibold text-teal-700 dark:text-teal-300 transition group-hover:gap-2">
                      View details
                      <ArrowRight size={16} />
                    </span>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && items.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-14 text-center shadow-sm">

            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <Search size={24} className="text-slate-400 dark:text-slate-400" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
              No public issues found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              Try changing the category or status filter to find more
              reported civic issues.
            </p>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900 dark:hover:bg-teal-700"
              >
                Clear filters
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
}