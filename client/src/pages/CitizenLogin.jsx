import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function CitizenLogin() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");

    try {
      const u = await login(f.email, f.password);

      if (u.role !== "citizen") {
        setErr("This account is not a citizen account. Please use the correct portal.");
        return;
      }

      nav("/citizen", { replace: true });
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[75vh] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-md">
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300"
        >
          <ArrowLeft size={17} />
          Back to portal selection
        </Link>

        <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-sm dark:border-teal-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
            <UserRound size={28} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Citizen Login
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Sign in to report issues and track your community complaints.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            {err && (
              <div
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
              >
                {err}
              </div>
            )}

            <div>
              <label
                htmlFor="citizen-email"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Email address
              </label>
              <input
                id="citizen-email"
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:ring-teal-900"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
              />
            </div>

            <div>
              <label
                htmlFor="citizen-password"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Password
              </label>
              <input
                id="citizen-password"
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:ring-teal-900"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                value={f.password}
                onChange={(e) => setF({ ...f, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-teal-700 p-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Sign in as Citizen"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
            New citizen?{" "}
            <Link
              to="/register"
              className="font-semibold text-teal-700 hover:underline dark:text-teal-300"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
