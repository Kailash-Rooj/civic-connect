import { Link } from "react-router-dom";
import { UserRound, ShieldCheck, ArrowRight, Users } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-[75vh] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
            <Users size={32} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Welcome to CivicConnect
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-300">
            Choose your portal to continue. Select the option that matches
            your account.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Citizen Card */}
          <div className="group flex flex-col rounded-2xl border border-teal-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-teal-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
              <UserRound size={28} />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Citizen Portal
            </h2>

            <p className="mt-3 flex-1 leading-7 text-slate-600 dark:text-slate-300">
              Report local problems, support existing complaints, and track
              the progress of issues in your community.
            </p>

            <Link
              to="/login/citizen"
              className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Citizen Login
              <ArrowRight size={18} />
            </Link>

            <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
              New citizen?{" "}
              <Link
                to="/register"
                className="font-semibold text-teal-700 hover:underline dark:text-teal-300"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Admin Card */}
          <div className="group flex flex-col rounded-2xl border border-blue-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-blue-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              <ShieldCheck size={28} />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Administration Portal
            </h2>

            <p className="mt-3 flex-1 leading-7 text-slate-600 dark:text-slate-300">
              Review reported issues, manage complaints, and update their
              resolution status.
            </p>

            <Link
              to="/login/admin"
              className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Admin Login
              <ArrowRight size={18} />
            </Link>

            <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
              Authorized administrators only
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Secure access · Role-based permissions · One CivicConnect platform
        </p>
      </div>
    </div>
  );
}