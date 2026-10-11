import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  ThumbsUp,
  Users,
  XCircle,
  Camera,
} from "lucide-react";

import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const statusConfig = {
  submitted: {
    label: "Submitted",
    icon: Clock3,
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    description: "Your complaint has been submitted.",
  },
  in_progress: {
    label: "In progress",
    icon: Clock3,
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    description: "The issue is currently being worked on.",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    color: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    description: "The issue has been resolved.",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-slate-600 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-800",
    description: "This complaint has been cancelled.",
  },
};

function getStatus(status) {
  return statusConfig[status] || statusConfig.submitted;
}

export default function IssueDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [c, setC] = useState(null);
  const [err, setErr] = useState("");
  const [reason, setReason] = useState("");
  const [stars, setStars] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    api
      .get(`/api/complaints/${id}`)
      .then((r) => {
        setC(r.data.complaint);

        if (r.data.complaint.rating) {
          setStars(r.data.complaint.rating.stars);
          setFeedback(r.data.complaint.rating.feedback || "");
        }
      })
      .catch((e) => {
        setErr(e.response?.data?.message || "Issue not found");
      });
  }, [id]);

  async function support() {
    try {
      setLoadingAction(true);

      const r = await api.post(`/api/complaints/${id}/support`);

      setC(r.data.complaint);
    } catch (e) {
      alert(e.response?.data?.message || "Unable to support this issue.");
    } finally {
      setLoadingAction(false);
    }
  }

  async function cancel() {
    if (!reason.trim()) return;

    try {
      setLoadingAction(true);

      await api.post(`/api/complaints/${id}/cancel`, {
        reason,
      });

      setC({
        ...c,
        status: "cancelled",
      });
    } catch (e) {
      alert(e.response?.data?.message || "Unable to cancel complaint.");
    } finally {
      setLoadingAction(false);
    }
  }

  async function saveRating() {
    try {
      setLoadingAction(true);

      const r = await api.post(`/api/complaints/${id}/rating`, {
        stars,
        feedback,
      });

      setC(r.data.complaint);
    } catch (e) {
      alert(e.response?.data?.message || "Unable to save rating.");
    } finally {
      setLoadingAction(false);
    }
  }

  async function deleteRating() {
    try {
      setLoadingAction(true);

      await api.delete(`/api/complaints/${id}/rating`);

      setC({
        ...c,
        rating: null,
      });

      setStars(5);
      setFeedback("");
    } catch (e) {
      alert(e.response?.data?.message || "Unable to delete rating.");
    } finally {
      setLoadingAction(false);
    }
  }

  if (err) {
    return (
      <div className="min-h-[70vh] bg-slate-50 dark:bg-slate-950 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white dark:bg-slate-900 p-8 text-center shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/70">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400">
            <XCircle size={25} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900 dark:text-slate-100">
            Issue not found
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {err}
          </p>

          <Link
            to="/issues"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900 dark:hover:bg-teal-700"
          >
            <ArrowLeft size={16} />
            Back to public issues
          </Link>
        </div>
      </div>
    );
  }

  if (!c) {
    return (
      <div className="min-h-[70vh] bg-slate-50 dark:bg-slate-950 px-4 py-16">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-5 w-28 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-5 h-10 w-72 rounded bg-slate-200 dark:bg-slate-700" />

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="h-[380px] rounded-3xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-[380px] rounded-3xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  const status = getStatus(c.status);
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-[#f8fafb]">

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">

        {/* =====================================================
            BACK
        ===================================================== */}
        <Link
          to="/issues"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:text-teal-700"
        >
          <ArrowLeft size={16} />
          Back to public issues
        </Link>


        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">
              <span>CivicConnect</span>

              <span className="text-slate-300 dark:text-slate-400">•</span>

              <span>{c.complaintId}</span>
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-100 sm:text-4xl">
              {c.category}
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {c.department}
            </p>

          </div>


          {/* STATUS */}
          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${status.bg} ${status.color}`}
          >
            <StatusIcon size={17} />
            {status.label}
          </div>

        </div>


        {/* =====================================================
            STATUS PROGRESS
        ===================================================== */}
        {c.status !== "cancelled" && (
          <div className="mt-7 rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/70 sm:p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Issue progress
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {status.description}
                </p>
              </div>

              <ShieldCheck
                size={21}
                className="text-teal-600 dark:text-teal-300"
              />

            </div>


            <div className="mt-6 grid grid-cols-3 gap-2">

              {/* SUBMITTED */}
              <div>
                <div
                  className={`h-1.5 rounded-full ${
                    ["submitted", "in_progress", "resolved"].includes(
                      c.status
                    )
                      ? "bg-teal-600"
                      : "bg-slate-100 dark:bg-slate-800"
                  }`}
                />

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Submitted
                  </span>
                </div>
              </div>


              {/* IN PROGRESS */}
              <div>
                <div
                  className={`h-1.5 rounded-full ${
                    ["in_progress", "resolved"].includes(c.status)
                      ? "bg-teal-600"
                      : "bg-slate-100 dark:bg-slate-800"
                  }`}
                />

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    In progress
                  </span>
                </div>
              </div>


              {/* RESOLVED */}
              <div>
                <div
                  className={`h-1.5 rounded-full ${
                    c.status === "resolved"
                      ? "bg-emerald-500"
                      : "bg-slate-100 dark:bg-slate-800"
                  }`}
                />

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Resolved
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}


        {/* =====================================================
            BEFORE / AFTER
        ===================================================== */}
        <div className="mt-7 grid gap-5 lg:grid-cols-2">

          {/* BEFORE */}
          <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/70">

            <div className="relative h-[320px] overflow-hidden bg-slate-100 dark:bg-slate-800 sm:h-[380px]">

              {c.beforePhoto?.url ? (
                <img
                  src={c.beforePhoto.url}
                  alt={`${c.category} before resolution`}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                />
              ) : (
                <div className="grid h-full place-items-center text-slate-400 dark:text-slate-400">
                  No photo available
                </div>
              )}

              <div className="absolute left-4 top-4 rounded-xl bg-slate-950/80 px-3 py-2 text-white backdrop-blur">
                <div className="flex items-center gap-2">
                  <Camera size={15} />
                  <span className="text-xs font-bold uppercase tracking-wide">
                    Before
                  </span>
                </div>
              </div>

            </div>

            <div className="px-5 py-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Reported problem
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Photo submitted by the citizen
              </p>
            </div>

          </div>


          {/* AFTER */}
          <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/70">

            <div className="relative h-[320px] overflow-hidden bg-slate-100 dark:bg-slate-800 sm:h-[380px]">

              {c.afterPhoto?.url ? (
                <img
                  src={c.afterPhoto.url}
                  alt={`${c.category} after resolution`}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center">

                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-400 shadow-sm">
                    <Camera size={23} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Resolution photo pending
                  </p>

                  <p className="mt-1 max-w-xs text-xs text-slate-400 dark:text-slate-400">
                    The after photo will appear here once the issue is resolved.
                  </p>

                </div>
              )}

              {c.afterPhoto?.url && (
                <div className="absolute left-4 top-4 rounded-xl bg-emerald-600 px-3 py-2 text-white shadow-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      After
                    </span>
                  </div>
                </div>
              )}

            </div>

            <div className="px-5 py-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Resolution evidence
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {c.afterPhoto?.url
                  ? "Photo uploaded by the administration"
                  : "Not available yet"}
              </p>
            </div>

          </div>

        </div>


        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_340px]">


          {/* =================================================
              LEFT CONTENT
          ================================================= */}
          <div className="space-y-6">


            {/* ISSUE DESCRIPTION */}
            <section className="rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/70 sm:p-7">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                    Complaint
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                    Issue details
                  </h2>
                </div>

                <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400">
                  <MessageSquare size={19} />
                </div>

              </div>

              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
                {c.description}
              </p>


              {/* META */}
              <div className="mt-6 grid gap-3 border-t border-slate-100 dark:border-slate-800 pt-5 sm:grid-cols-2">

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-950 px-4 py-3">

                  <MapPin
                    size={17}
                    className="shrink-0 text-teal-600 dark:text-teal-300"
                  />

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      Exact location
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                      {c.location.coordinates[1].toFixed(5)},{" "}
                      {c.location.coordinates[0].toFixed(5)}
                    </p>
                  </div>

                </div>


                <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-950 px-4 py-3">

                  <Users
                    size={17}
                    className="shrink-0 text-teal-600 dark:text-teal-300"
                  />

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      Community impact
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                      {c.affectedCount} people affected
                    </p>
                  </div>

                </div>

              </div>


              {/* RESOLUTION NOTE */}
              {c.resolutionNote && (
                <div className="mt-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-5">

                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 size={18} />

                    <p className="text-sm font-bold">
                      Resolution update
                    </p>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-emerald-900/80">
                    {c.resolutionNote}
                  </p>

                </div>
              )}

            </section>


            {/* PUBLIC RATING */}
            {c.rating && !c.isReporter && (
              <section className="rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/70">

                <div className="flex items-center gap-3">

                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-300">
                    <Star size={19} fill="currentColor" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-slate-100">
                      Citizen rating
                    </h2>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Feedback from the reporting citizen
                    </p>
                  </div>

                </div>

                <div className="mt-4 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={19}
                      className={
                        n <= c.rating.stars
                          ? "fill-amber-400 text-amber-400 dark:text-amber-300"
                          : "text-slate-200 dark:text-slate-300"
                      }
                    />
                  ))}

                  <span className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {c.rating.stars}/5
                  </span>
                </div>

                {c.rating.feedback && (
                  <p className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    “{c.rating.feedback}”
                  </p>
                )}

              </section>
            )}

          </div>


          {/* =================================================
              RIGHT ACTION SIDEBAR
          ================================================= */}
          <aside className="space-y-4">


            {/* SUPPORT */}
            {user?.role === "citizen" &&
              c.status !== "resolved" &&
              c.status !== "cancelled" && (

                <section className="rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/70">

                  <div className="flex items-start gap-3">

                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300">
                      <ThumbsUp size={18} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900 dark:text-slate-100">
                        Affected by this issue?
                      </h2>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Support this report instead of creating a duplicate complaint.
                      </p>
                    </div>

                  </div>


                  {c.isReporter ? (
                    <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-950 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        You reported this
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {c.affectedCount} people are affected.
                      </p>
                    </div>

                  ) : c.hasSupported ? (
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 size={17} />
                      You're also affected
                    </div>

                  ) : (
                    <button
                      onClick={support}
                      disabled={loadingAction}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-900 dark:hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <ThumbsUp size={16} />
                      {loadingAction
                        ? "Adding support..."
                        : "I'm also affected"}
                    </button>
                  )}

                </section>
              )}


            {/* CANCEL */}
            {user?.role === "citizen" &&
              c.isReporter &&
              (c.status === "submitted" ||
                c.status === "in_progress") && (

                <section className="rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/70">

                  <div className="flex items-center gap-3">

                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300">
                      <XCircle size={18} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900 dark:text-slate-100">
                        Cancel complaint
                      </h2>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Only cancel if the issue no longer needs action.
                      </p>
                    </div>

                  </div>


                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    maxLength={500}
                    className="mt-4 min-h-[90px] w-full resize-none rounded-xl bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 outline-none ring-1 ring-slate-200 dark:ring-slate-700 transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                    placeholder="Why are you cancelling?"
                  />

                  <button
                    onClick={cancel}
                    disabled={!reason.trim() || loadingAction}
                    className="mt-3 w-full rounded-xl border border-red-100 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-4 py-2.5 text-sm font-semibold text-red-700 dark:text-red-300 transition hover:bg-red-100 dark:hover:bg-red-900/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingAction ? "Cancelling..." : "Cancel complaint"}
                  </button>

                </section>
              )}


            {/* RATING */}
            {user?.role === "citizen" &&
              c.isReporter &&
              c.status === "resolved" && (

                <section className="rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/70">

                  <div className="flex items-center gap-3">

                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-300">
                      <Star size={18} fill="currentColor" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900 dark:text-slate-100">
                        Your rating
                      </h2>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        How was the resolution?
                      </p>
                    </div>

                  </div>


                  {/* STARS */}
                  <div className="mt-5 flex items-center gap-1">

                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setStars(n)}
                        className="rounded-lg p-1 transition hover:bg-amber-50 dark:hover:bg-amber-950/40"
                        aria-label={`${n} star`}
                      >
                        <Star
                          size={27}
                          className={
                            n <= stars
                              ? "fill-amber-400 text-amber-400 dark:text-amber-300"
                              : "text-slate-200 dark:text-slate-300"
                          }
                        />
                      </button>
                    ))}

                  </div>


                  <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-400">
                    {stars === 5
                      ? "Excellent"
                      : stars === 4
                      ? "Good"
                      : stars === 3
                      ? "Average"
                      : stars === 2
                      ? "Needs improvement"
                      : "Poor"}
                  </p>


                  {/* FEEDBACK */}
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    maxLength={500}
                    className="mt-4 min-h-[95px] w-full resize-none rounded-xl bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 outline-none ring-1 ring-slate-200 dark:ring-slate-700 transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900"
                    placeholder="Optional feedback about the resolution"
                  />


                  <button
                    onClick={saveRating}
                    disabled={loadingAction}
                    className="mt-3 w-full rounded-xl bg-teal-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-900 dark:hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingAction
                      ? "Saving..."
                      : c.rating
                      ? "Update rating"
                      : "Save rating"}
                  </button>


                  {c.rating && (
                    <button
                      onClick={deleteRating}
                      disabled={loadingAction}
                      className="mt-3 w-full text-xs font-medium text-red-600 dark:text-red-300 hover:text-red-700"
                    >
                      Delete rating
                    </button>
                  )}

                </section>
              )}

          </aside>

        </div>

      </div>
    </div>
  );
}