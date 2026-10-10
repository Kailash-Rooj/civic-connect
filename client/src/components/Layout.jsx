import { Link, NavLink, useNavigate } from "react-router-dom";
import { Landmark, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = user
    ? user.role === "admin"
      ? [
          ["/admin", "Dashboard"],
          ["/admin/issues", "Complaints"],
          ["/issues", "Public Issues"],
          ["/issues/map", "Issues Map"],
        ]
      : [
          ["/citizen", "Dashboard"],
          ["/citizen/report", "Report Issue"],
          ["/citizen/history", "History"],
          ["/issues", "Public Issues"],
          ["/issues/map", "Issues Map"],
        ]
    : [["/issues", "Public Issues"], ["/issues/map", "Issues Map"]];

  async function signOut() {
    await logout();
    setOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

          {/* LOGO */}
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 font-bold text-teal-800"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-800 text-white">
              <Landmark size={19} />
            </span>

            CivicConnect
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-5 md:flex">

            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-teal-700"
                    : "text-slate-600 hover:text-slate-900"
                }
              >
                {label}
              </NavLink>
            ))}

            {/* USER NAME */}
            {user && (
              <span className="text-sm text-slate-500">
                {user.fullName}
              </span>
            )}

            {/* LOGOUT / LOGIN */}
            {user ? (
              <button
                onClick={signOut}
                className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
              >
                <LogOut size={15} />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-slate-700 hover:text-slate-900"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-teal-800 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-900"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* MOBILE NAVIGATION */}
        {open && (
          <nav className="border-t bg-white p-4 md:hidden">

            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 ${
                    isActive
                      ? "bg-teal-50 font-semibold text-teal-700"
                      : "text-slate-700"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* MOBILE LOGOUT / LOGIN */}
            {user ? (
              <button
                onClick={signOut}
                className="mt-3 flex w-full items-center gap-2 rounded-lg bg-slate-100 px-3 py-2"
              >
                <LogOut size={15} />
                Logout
              </button>
            ) : (
              <div className="mt-3 flex gap-3">

                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border px-3 py-2"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-teal-800 px-3 py-2 text-white"
                >
                  Register
                </Link>

              </div>
            )}
          </nav>
        )}
      </header>

      {/* PAGE CONTENT */}
      <main>{children}</main>
    </div>
  );
}