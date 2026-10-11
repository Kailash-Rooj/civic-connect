import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
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

      if (u.role !== "admin") {
        setErr(
          "This account does not have administrator access. Please use the Citizen Portal."
        );
        return;
      }

      nav("/admin", { replace: true });
    } catch (e) {
      setErr(
        e.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[75vh] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-md">
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300"
        >
          <ArrowLeft size={17} />
          Back to portal selection
        </Link>

        <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm dark:border-blue-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            <ShieldCheck size={28} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Admin Login
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Sign in to review complaints and manage community issues.
          </p>

          <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
            Restricted area. Only authorized administrators can access this
            portal.
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
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
                htmlFor="admin-email"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Administrator email
              </label>

              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                placeholder="Enter your email"
                required
                value={f.email}
                onChange={(e) =>
                  setF({ ...f, email: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                value={f.password}
                onChange={(e) =>
                  setF({ ...f, password: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-blue-700 p-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Sign in as Admin"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Need citizen access?{" "}
            <Link
              to="/login/citizen"
              className="font-semibold text-blue-700 hover:underline dark:text-blue-300"
            >
              Citizen Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}