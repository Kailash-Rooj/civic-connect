import { Routes, Route } from "react-router-dom";

import { GuestRoute, ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenDashboard from "./pages/CitizenDashboard";
import ReportIssue from "./pages/ReportIssue";
import History from "./pages/History";
import PublicIssues from "./pages/PublicIssues";
import IssueDetails from "./pages/IssueDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminIssues from "./pages/AdminIssues";
import IssuesMap from "./pages/IssuesMap";

export default function App() {
  return (
    <Layout>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />

        <Route
          path="/issues"
          element={<PublicIssues />}
        />

        <Route
          path="/issues/map"
          element={<IssuesMap />}
        />
        <Route
          path="/issues/:id"
          element={<IssueDetails />}
        />

        {/* GUEST */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* CITIZEN */}
        <Route
          path="/citizen"
          element={
            <ProtectedRoute roles={["citizen"]}>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizen/report"
          element={
            <ProtectedRoute roles={["citizen"]}>
              <ReportIssue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizen/history"
          element={
            <ProtectedRoute roles={["citizen"]}>
              <History />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/issues"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminIssues />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Home />}
        />

      </Routes>
    </Layout>
  );
}