import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  RefreshCw,
  XCircle,
} from "lucide-react";
import api from "../lib/api";

const statusConfig = {
  submitted: {
    label: "Submitted",
    description: "Waiting for action",
    icon: ClipboardList,
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    numberColor: "text-blue-700",
    border: "border-blue-100",
  },
  in_progress: {
    label: "In Progress",
    description: "Currently being handled",
    icon: Clock3,
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    numberColor: "text-amber-700",
    border: "border-amber-100",
  },
  resolved: {
    label: "Resolved",
    description: "Successfully completed",
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    numberColor: "text-emerald-700",
    border: "border-emerald-100",
  },
  cancelled: {
    label: "Cancelled",
    description: "Closed without resolution",
    icon: XCircle,
    bg: "bg-slate-50",
    iconBg: "bg-slate-200",
    iconColor: "text-slate-500",
    numberColor: "text-slate-700",
    border: "border-slate-200",
  },
};

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    submitted: 0,
    in_progress: 0,
    resolved: 0,
    cancelled: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const r = await api.get("/api/complaints/admin/all");

      const x = {
        submitted: 0,
        in_progress: 0,
        resolved: 0,
        cancelled: 0,
      };

      r.data.complaints.forEach((c) => {
        if (x[c.status] !== undefined) {
          x[c.status]++;
        }
      });

      setCounts(x);
    } catch (err) {
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const total =
    counts.submitted +
    counts.in_progress +
    counts.resolved +
    counts.cancelled;

  const active = counts.submitted + counts.in_progress;

  const resolutionRate =
    total > 0 ? Math.round((counts.resolved / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">

        {/* HEADER */}
        <div className="rounded-3xl bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-teal-200">
                <LayoutDashboard size={16} />
                ADMIN CONTROL CENTER
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                CivicConnect operations
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-100 sm:text-base">
                Monitor reported civic issues, track ongoing work, and
                verify completed resolutions.
              </p>
            </div>

            <Link
              to="/admin/issues"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-teal-900 shadow-sm transition hover:bg-teal-50"
            >
              Manage complaints
              <ArrowRight size={17} />
            </Link>

          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>

            <button
              onClick={loadDashboard}
              className="flex items-center gap-1 rounded-lg bg-white px-3 py-2 font-medium text-red-700 shadow-sm hover:bg-red-100"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* OVERVIEW */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">

          {/* TOTAL */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total complaints
                </p>

                {loading ? (
                  <div className="mt-3 h-10 w-20 animate-pulse rounded-lg bg-slate-200" />
                ) : (
                  <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                    {total}
                  </p>
                )}
              </div>

              <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
                <ClipboardList size={23} />
              </div>
            </div>

            <div className="mt-5 border-t pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Currently active
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-800">
                {loading ? "—" : active}
              </p>
            </div>
          </div>

          {/* RESOLUTION RATE */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Resolution overview
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {loading ? "Loading..." : `${resolutionRate}% resolved`}
                </p>
              </div>

              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={23} />
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: loading ? "0%" : `${resolutionRate}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>
                {loading ? "—" : `${counts.resolved} resolved`}
              </span>

              <span>
                {loading ? "—" : `${active} active`}
              </span>
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div className="mt-8">

          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                Complaint status
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Current workload
              </h2>
            </div>

            <Link
              to="/admin/issues"
              className="hidden items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-900 sm:flex"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {Object.entries(counts).map(([key, value]) => {
              const config = statusConfig[key];
              const Icon = config.icon;

              return (
                <Link
                  key={key}
                  to={`/admin/issues?status=${key}`}
                  className={`group rounded-2xl border ${config.border} ${config.bg} p-5 transition duration-200 hover:-translate-y-1 hover:shadow-md`}
                >
                  <div className="flex items-start justify-between">

                    <div
                      className={`grid h-11 w-11 place-items-center rounded-xl ${config.iconBg} ${config.iconColor}`}
                    >
                      <Icon size={21} />
                    </div>

                    <ArrowRight
                      size={17}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500"
                    />
                  </div>

                  {loading ? (
                    <div className="mt-5 h-9 w-14 animate-pulse rounded-lg bg-white/70" />
                  ) : (
                    <p
                      className={`mt-5 text-3xl font-bold ${config.numberColor}`}
                    >
                      {value}
                    </p>
                  )}

                  <p className="mt-1 font-semibold text-slate-800">
                    {config.label}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {config.description}
                  </p>
                </Link>
              );
            })}

          </div>
        </div>



      </div>
    </div>
  );
}