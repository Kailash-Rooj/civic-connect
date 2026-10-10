import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function home(role) { return role === "admin" ? "/admin" : "/citizen"; }
export function ProtectedRoute({ roles, children }) { const { user, loading } = useAuth(); if (loading) return <div className="min-h-screen grid place-items-center">Checking session…</div>; if (!user) return <Navigate to="/login" replace />; if (roles && !roles.includes(user.role)) return <Navigate to={home(user.role)} replace />; return children; }
export function GuestRoute({ children }) { const { user, loading } = useAuth(); if (loading) return <div className="min-h-screen grid place-items-center">Loading…</div>; if (user) return <Navigate to={home(user.role)} replace />; return children; }
