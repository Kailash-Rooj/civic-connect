import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
  RefreshCw,
} from "lucide-react";
import api from "../lib/api";
import ComplaintCard from "../components/ComplaintCard";
import { useAuth } from "../context/AuthContext";

export default function CitizenDashboard() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadComplaints() {
    try {
      setLoading(true);
      setError("");

      const r = await api.get("/api/complaints/mine");
      setItems(r.data.complaints || []);
    } catch (err) {
      setError("Unable to load your complaints.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  const submittedCount = items.filter(
    (c) => c.status === "submitted"
  ).length;

  const inProgressCount = items.filter(
    (c) => c.status === "in_progress"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">

        {/* HERO */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 shadow-lg">
          <div className="relative p-6 text-white sm:p-8">

            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/5 dark:bg-slate-800/30" />
            <div className="pointer-events-none absolute -bottom-24 right-20 h-40 w-40 rounded-full bg-white/5 dark:bg-slate-800/30" />

            <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-teal-200">
                  <span className="h-2 w-2 rounded-full bg-teal-300" />
                  CITIZEN DASHBOARD
                </div>

                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Welcome back, {user.fullName}
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-teal-100 sm:text-base">
                  Track your reported civic issues and follow their progress
                  from submission to resolution.
                </p>
              </div>

              <Link
                to="/citizen/report"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-5 py-3 font-semibold text-teal-900 dark:text-teal-200 shadow-sm transition hover:bg-teal-50 dark:hover:bg-teal-950/60"
              >
                <Plus size={18} />
                Report an issue
              </Link>

            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300">
            <span>{error}</span>

            <button
              onClick={loadComplaints}
              className="flex items-center gap-1 rounded-lg bg-white dark:bg-slate-900 px-3 py-2 font-medium shadow-sm hover:bg-red-100 dark:hover:bg-red-900/50"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* SUMMARY */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          {/* TOTAL */}
          <div className="rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Active complaints
                </p>

                {loading ? (
                  <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                ) : (
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {items.length}
                  </p>
                )}
              </div>

              <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300">
                <FileText size={21} />
              </div>

            </div>
          </div>

          {/* SUBMITTED */}
          <div className="rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Awaiting action
                </p>

                {loading ? (
                  <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                ) : (
                  <p className="mt-2 text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {submittedCount}
                  </p>
                )}
              </div>

              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300">
                <Clock3 size={21} />
              </div>

            </div>
          </div>

          {/* IN PROGRESS */}
          <div className="rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  In progress
                </p>

                {loading ? (
                  <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                ) : (
                  <p className="mt-2 text-3xl font-bold text-amber-700 dark:text-amber-300">
                    {inProgressCount}
                  </p>
                )}
              </div>

              <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300">
                <CheckCircle2 size={21} />
              </div>

            </div>
          </div>

        </div>

        {/* ACTIVE COMPLAINTS */}
        <section className="mt-9">

          <div className="mb-5 flex items-end justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                Your reports
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                Active complaints
              </h2>
            </div>

            <Link
              to="/citizen/history"
              className="hidden items-center gap-1 text-sm font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-200 sm:flex"
            >
              View history
              <ArrowRight size={15} />
            </Link>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="grid gap-5 md:grid-cols-2">

              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 shadow-sm"
                >
                  <div className="h-44 animate-pulse bg-slate-200 dark:bg-slate-700" />

                  <div className="space-y-3 p-5">
                    <div className="h-3 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                </div>
              ))}

            </div>
          )}

          {/* COMPLAINTS */}
          {!loading && items.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              {items.map((complaint) => (
                <ComplaintCard
                  key={complaint._id}
                  complaint={complaint}
                />
              ))}
            </div>
          )}

          {/* EMPTY */}
          {!loading && items.length === 0 && (
            <div className="rounded-2xl border bg-white dark:bg-slate-900 px-6 py-14 text-center shadow-sm">

              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 dark:bg-teal-950/50">
                <FileText size={25} className="text-teal-600 dark:text-teal-300" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                No active complaints
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Haven't reported a civic issue yet? Submit one with a
                photo and exact location so it can be tracked.
              </p>

              <Link
                to="/citizen/report"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-900 dark:hover:bg-teal-700"
              >
                <Plus size={16} />
                Report an issue
              </Link>

            </div>
          )}

          {/* MOBILE HISTORY LINK */}
          <div className="mt-5 sm:hidden">
            <Link
              to="/citizen/history"
              className="flex items-center justify-center gap-2 rounded-xl border bg-white dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              View complaint history
              <ArrowRight size={15} />
            </Link>
          </div>

        </section>
      </div>
    </div>
  );
}