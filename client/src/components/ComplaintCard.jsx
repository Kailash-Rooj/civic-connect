import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  MapPin,
  Users,
  ImageOff,
  CheckCircle2,
  Clock3,
  ClipboardList,
  XCircle,
} from "lucide-react";

const statusConfig = {
  submitted: {
    label: "Submitted",
    icon: ClipboardList,
    className: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },

  in_progress: {
    label: "In progress",
    icon: Clock3,
    className: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },

  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    className: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },

  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  },
};

export default function ComplaintCard({ complaint: c }) {
  const status = statusConfig[c.status] || statusConfig.submitted;

  const StatusIcon = status.icon;

  return (
    <Link
      to={`/issues/${c._id}`}
      className="group block overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl"
    >
      {/* =====================================================
          IMAGE
      ====================================================== */}
      <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">

        {c.beforePhoto?.url ? (
          <img
            src={c.beforePhoto.url}
            alt={c.category}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-400 dark:text-slate-400">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
              <ImageOff size={22} />
            </div>

            <p className="mt-2 text-xs">
              No image available
            </p>
          </div>
        )}

        {/* IMAGE GRADIENT */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* STATUS */}
        <div
          className={`absolute left-4 top-4 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md ${status.className}`}
        >
          <StatusIcon size={13} />
          {status.label}
        </div>

        {/* CATEGORY */}
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block rounded-lg bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {c.category}
          </span>
        </div>

        {/* TOP RIGHT ARROW */}
        <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight size={17} />
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="p-5">

        {/* DESCRIPTION */}
        <h3 className="line-clamp-2 min-h-[48px] text-[15px] font-semibold leading-6 text-slate-900 dark:text-slate-100">
          {c.description}
        </h3>

        {/* META */}
        <div className="mt-5 grid grid-cols-2 gap-3">

          {/* LOCATION */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-950 px-3 py-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-300 shadow-sm">
              <MapPin size={15} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-400">
                Location
              </p>

              <p className="mt-0.5 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                Exact location
              </p>
            </div>
          </div>

          {/* AFFECTED */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-950 px-3 py-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-300 shadow-sm">
              <Users size={15} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-400">
                Impact
              </p>

              <p className="mt-0.5 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                {c.affectedCount || 1} affected
              </p>
            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="my-5 border-t border-slate-100 dark:border-slate-800" />

        {/* FOOTER */}
        <div className="flex items-center justify-between">

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-400">
              Civic issue
            </p>

            <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              CivicConnect
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 px-3.5 py-2.5 text-xs font-semibold text-teal-700 dark:text-teal-300 transition-all duration-200 group-hover:bg-teal-800 group-hover:text-white">
            View details
            <ArrowUpRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>

        </div>
      </div>
    </Link>
  );
}