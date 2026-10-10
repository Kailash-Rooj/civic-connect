import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null), [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/api/auth/me").then(r => setUser(r.data.user)).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  async function login(email, password) { const r = await api.post("/api/auth/login", { email, password }); setUser(r.data.user); return r.data.user; }
  async function register(payload) { const r = await api.post("/api/auth/register", payload); setUser(r.data.user); return r.data.user; }
  async function logout() { try { await api.post("/api/auth/logout"); } finally { setUser(null); } }
  const value = useMemo(() => ({ user, loading, isAuthenticated: !!user, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const c = useContext(AuthContext); if (!c) throw new Error("useAuth must be used within AuthProvider"); return c; }
