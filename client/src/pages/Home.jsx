import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  MapPin,
  ClipboardList,
  Clock3,
  Droplets,
  Lightbulb,
  Trash2,
  Waves,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const reportLink = user ? "/citizen/report" : "/register";

  return (
    <div className="bg-white text-slate-900">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-white">

        <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-[1700px] lg:grid-cols-[34%_66%]">

          {/* LEFT CONTENT */}
          <div className="relative z-10 flex items-center px-6 py-12 sm:px-10 lg:px-12 xl:px-16">

            <div className="w-full max-w-xl">

              {/* SMALL LABEL */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                <span>Citizens</span>
                <span>×</span>
                <span>Cleaner cities</span>
                <span>×</span>
                <span>Stronger communities</span>
              </div>

              {/* HEADING */}
              <h1 className="mt-7 text-5xl font-bold leading-[0.98] tracking-tight text-slate-950 sm:text-6xl xl:text-7xl">
                See a problem?
                <br />
                Make it{" "}
                <span className="text-teal-700">
                  visible.
                </span>
              </h1>

              {/* DESCRIPTION */}
              <p className="mt-7 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
                <span className="font-semibold text-slate-800">
                  Report civic issues with a photo and exact location.
                </span>{" "}
                Track the progress and see evidence when the work is done.
              </p>

              {/* BUTTONS */}
              <div className="mt-7 flex flex-wrap gap-3">

                <Link
                  to={reportLink}
                  className="group flex items-center gap-3 rounded-xl bg-teal-800 px-5 py-3.5 font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:bg-teal-900"
                >
                  <Camera size={19} />
                  Report an issue
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/issues"
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Explore public issues
                </Link>

              </div>

              {/* SMALL FEATURES */}
              <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">

                <div className="flex items-center gap-2">
                  <MapPin
                    size={22}
                    className="shrink-0 text-teal-700"
                  />

                  <span className="text-xs font-medium text-slate-600 sm:text-sm">
                    Exact location
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={22}
                    className="shrink-0 text-teal-700"
                  />

                  <span className="text-xs font-medium text-slate-600 sm:text-sm">
                    Transparent process
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ClipboardList
                    size={22}
                    className="shrink-0 text-teal-700"
                  />

                  <span className="text-xs font-medium text-slate-600 sm:text-sm">
                    Real impact
                  </span>
                </div>

              </div>
            </div>
          </div>


          {/* =================================================
              BEFORE / AFTER VISUAL
          ================================================= */}
          <div className="relative min-h-[500px] overflow-hidden lg:min-h-0">

            {/* IMAGES */}
            <div className="absolute inset-0 grid grid-cols-2">

              {/* BEFORE */}
              <div className="relative overflow-hidden">
                <img
                  src="/images/before.jpg"
                  alt="Road before civic issue resolution"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />

                {/* BEFORE LABEL */}
                <div className="absolute left-5 top-8 rounded-xl bg-slate-950/85 px-4 py-2.5 text-white shadow-lg backdrop-blur">
                  <p className="text-lg font-bold leading-none">
                    BEFORE
                  </p>

                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-300">
                    Reported by a citizen
                  </p>
                </div>

              </div>


              {/* AFTER */}
              <div className="relative overflow-hidden border-l-2 border-white">
                <img
                  src="/images/after.png"
                  alt="Road after civic issue resolution"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/5" />

                {/* AFTER LABEL */}
                <div className="absolute right-5 top-8 rounded-xl bg-white/90 px-4 py-2.5 text-slate-900 shadow-lg backdrop-blur">
                  <p className="text-lg font-bold leading-none">
                    AFTER
                  </p>

                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                    Resolved by administration
                  </p>
                </div>

              </div>
            </div>


            {/* FADE INTO LEFT CONTENT */}
            {/* <div className="absolute inset-y-0 left-0 hidden w-32 bg-gradient-to-r from-white to-transparent lg:block" /> */}
            {/* SUBTLE FADE INTO LEFT CONTENT */}
            <div className="absolute inset-y-0 left-0 hidden w-10 bg-gradient-to-r from-black/70 to-transparent lg:block" />


            {/* CENTER ARROW */}
            <div className="absolute left-1/2 top-1/2 z-10 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-slate-800 shadow-xl ring-4 ring-white/30">
              <ArrowRight size={24} />
            </div>


            {/* BEFORE INFO CARD */}
            <div className="absolute bottom-7 left-5 right-5 sm:left-7 sm:right-auto sm:w-[310px]">



            </div>




          </div>
        </div>
      </section>


      {/* =====================================================
          SECTION 2 — REPORT → TRACK → VERIFY
      ===================================================== */}
      <section className="border-y border-slate-200 bg-slate-50">

        <div className="mx-auto max-w-[1400px] px-6 py-12 sm:px-10 lg:px-12">

          <div className="grid gap-8 lg:grid-cols-[230px_1fr] lg:items-center">

            {/* TITLE */}
            <div>
              <p className="text-3xl font-bold leading-tight text-slate-950">
                From reporting
                <br />
                to{" "}
                <span className="text-teal-700">
                  real change.
                </span>
              </p>
            </div>


            {/* STEPS */}
            <div className="grid gap-3 md:grid-cols-3">

              {/* STEP 1 */}
              <div className="flex min-h-[125px] items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500">
                  <Camera size={21} />
                </div>

                <div>
                  <p className="text-lg font-bold">
                    1. Report
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    Take a photo, describe the issue and mark the exact
                    location.
                  </p>
                </div>

              </div>


              {/* STEP 2 */}
              <div className="flex min-h-[125px] items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Clock3 size={21} />
                </div>

                <div>
                  <p className="text-lg font-bold">
                    2. Track
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    Follow the status as the issue moves from submitted
                    to in progress.
                  </p>
                </div>

              </div>


              {/* STEP 3 */}
              <div className="flex min-h-[125px] items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={21} />
                </div>

                <div>
                  <p className="text-lg font-bold">
                    3. Verify
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    See the resolution with after-photo evidence.
                  </p>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          SECTION 3 — COMMON ISSUES
          COMPACT, NOT A HUGE EXTRA PAGE
      ===================================================== */}
      <section className="relative overflow-hidden bg-white">

        <div className="mx-auto max-w-[1400px] px-6 py-12 sm:px-10 lg:px-12">

          <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:items-center">

            {/* LEFT */}
            <div>

              <p className="text-2xl font-bold leading-tight text-slate-950">
                Common civic issues
              </p>

              <Link
                to="/issues"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
              >
                Explore public issues
                <ArrowRight size={16} />
              </Link>

            </div>


            {/* ISSUE CARDS */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

              {/* ROADS */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-700">
                  <ClipboardList size={22} />
                </div>

                <p className="mt-4 text-sm font-bold">
                  Roads & Potholes
                </p>

                <p className="mt-1 text-xs leading-4 text-slate-500">
                  Damaged roads and potholes
                </p>
              </div>


              {/* GARBAGE */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Trash2 size={22} />
                </div>

                <p className="mt-4 text-sm font-bold">
                  Garbage
                </p>

                <p className="mt-1 text-xs leading-4 text-slate-500">
                  Overflowing bins and waste
                </p>
              </div>


              {/* STREETLIGHTS */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-amber-600">
                  <Lightbulb size={22} />
                </div>

                <p className="mt-4 text-sm font-bold">
                  Streetlights
                </p>

                <p className="mt-1 text-xs leading-4 text-slate-500">
                  Broken or non-working lights
                </p>
              </div>


              {/* WATER */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Droplets size={22} />
                </div>

                <p className="mt-4 text-sm font-bold">
                  Water Supply
                </p>

                <p className="mt-1 text-xs leading-4 text-slate-500">
                  Supply and leakage issues
                </p>
              </div>


              {/* DRAINAGE */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Waves size={22} />
                </div>

                <p className="mt-4 text-sm font-bold">
                  Drainage
                </p>

                <p className="mt-1 text-xs leading-4 text-slate-500">
                  Blocked drains and waterlogging
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          COMPACT FOOTER
      ===================================================== */}
      <footer className="border-t bg-slate-950 text-slate-400">

        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-4 px-6 py-6 sm:flex-row sm:items-center sm:px-10 lg:px-12">

          <div>
            <p className="font-bold text-white">
              CivicConnect
            </p>

            <p className="mt-1 text-xs">
              Report civic problems. See the work. Verify the result.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs">
            <Link
              to="/issues"
              className="hover:text-white"
            >
              Public Issues
            </Link>

            <Link
              to={reportLink}
              className="hover:text-white"
            >
              Report Issue
            </Link>

            <span>
              © 2026 CivicConnect
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}