
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { LoaderCircle, MapPin, RefreshCw } from "lucide-react";
import api from "../lib/api";
import "leaflet/dist/leaflet.css";

// Colors match the actual complaint statuses.
const statusColors = {
  submitted: "#ef4444",
  in_progress: "#f59e0b",
  resolved: "#10b981",
};

const statusLabels = {
  submitted: "Submitted",
  in_progress: "In Progress",
  resolved: "Resolved",
};

// Create a colored map pin.
function createPin(status) {
  const color = statusColors[status] || "#64748b";

  return L.divIcon({
    className: "civic-map-pin-wrapper",
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(15,23,42,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          width: 7px;
          height: 7px;
          background: white;
          border-radius: 50%;
          display: block;
        "></span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
}

// Fit the map to the complaint locations.
function FitComplaints({ complaints }) {
  const map = useMap();

  useEffect(() => {
    const positions = complaints
      .filter((c) => c.location?.coordinates?.length === 2)
      .map((c) => [
        c.location.coordinates[1],
        c.location.coordinates[0],
      ]);

    if (positions.length === 1) {
      map.setView(positions[0], 15);
    } else if (positions.length > 1) {
      map.fitBounds(positions, { padding: [45, 45], maxZoom: 15 });
    } else {
      map.setView([22.5726, 88.3639], 11);
    }
  }, [complaints, map]);

  return null;
}

export default function IssuesMap() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadComplaints() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/complaints");
      setComplaints(response.data.complaints || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load complaints. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  return (
    <div className="relative h-[calc(100dvh-65px)] min-h-[420px] w-full overflow-hidden bg-slate-100">
      {/* Map */}
      <MapContainer
        center={[22.5726, 88.3639]}
        zoom={11}
        className="z-0 h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitComplaints complaints={complaints} />

        {complaints.map((complaint) => {
          const coordinates = complaint.location?.coordinates;

          if (
            !coordinates ||
            coordinates.length !== 2 ||
            !Number.isFinite(coordinates[0]) ||
            !Number.isFinite(coordinates[1])
          ) {
            return null;
          }

          return (
            <Marker
              key={complaint._id}
              position={[coordinates[1], coordinates[0]]}
              icon={createPin(complaint.status)}
              eventHandlers={{
                click: () => navigate(`/issues/${complaint._id}`),
              }}
              title={`${complaint.category} — ${
                statusLabels[complaint.status] || complaint.status
              }`}
            />
          );
        })}
      </MapContainer>

      {/* Floating heading */}
      <div className="absolute left-4 top-4 z-[1000] max-w-[calc(100%-32px)] rounded-2xl bg-white/95 p-4 shadow-lg ring-1 ring-slate-200 backdrop-blur sm:left-6 sm:top-6">
        <div className="flex items-center gap-2 text-teal-800">
          <MapPin size={20} />
          <h1 className="text-lg font-bold">Civic Issues Map</h1>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          {complaints.length} reported{" "}
          {complaints.length === 1 ? "issue" : "issues"}
        </p>
      </div>

      {/* Status legend */}
      <div className="absolute bottom-5 left-1/2 z-[1000] flex max-w-[calc(100%-24px)] -translate-x-1/2 flex-wrap justify-center gap-x-4 gap-y-2 rounded-2xl bg-white/95 px-4 py-3 shadow-lg ring-1 ring-slate-200 backdrop-blur sm:bottom-6 sm:gap-5 sm:px-5">
        {Object.entries(statusLabels).map(([status, label]) => (
          <div key={status} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: statusColors[status] }}
            />
            <span className="whitespace-nowrap text-xs font-medium text-slate-700 sm:text-sm">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Loading and error overlays */}
      {loading && (
        <div className="absolute right-4 top-24 z-[1000] flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-600 shadow-md sm:right-6">
          <LoaderCircle size={16} className="animate-spin" />
          Loading issues…
        </div>
      )}

      {error && (
        <div className="absolute left-4 right-4 top-24 z-[1000] mx-auto max-w-md rounded-xl bg-white p-4 shadow-lg ring-1 ring-red-200">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={loadComplaints}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-teal-800 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-900"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      )}

      {!loading && !error && complaints.length === 0 && (
        <div className="absolute left-1/2 top-1/2 z-[1000] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 text-center shadow-lg">
          <MapPin className="mx-auto text-slate-400" size={28} />
          <p className="mt-2 font-semibold text-slate-800">
            No issues to show yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Reported civic issues will appear on this map.
          </p>
        </div>
      )}
    </div>
  );
}
