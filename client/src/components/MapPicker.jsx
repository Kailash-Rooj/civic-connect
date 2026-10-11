import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

export default function MapPicker({ value, onChange }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [locating, setLocating] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const initial = value || [22.5726, 88.3639];

    const map = L.map(mapContainer.current).setView(initial, 13);

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
      }
    ).addTo(map);

    const marker = L.marker(initial, {
      draggable: true,
    }).addTo(map);

    marker.on("dragend", () => {
      const position = marker.getLatLng();

      onChange([position.lat, position.lng]);
    });

    map.on("click", (event) => {
      marker.setLatLng(event.latlng);

      onChange([
        event.latlng.lat,
        event.latlng.lng,
      ]);
    });

    mapRef.current = map;
    markerRef.current = marker;

    // Fix map rendering size
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // IMPORTANT: proper cleanup
    return () => {
      map.remove();

      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker when location changes
  useEffect(() => {
    if (!value || !mapRef.current || !markerRef.current) {
      return;
    }

    markerRef.current.setLatLng(value);
    mapRef.current.setView(value, 16);
  }, [value]);

  // GPS
  function locate() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        onChange(newLocation);

        if (mapRef.current) {
          mapRef.current.setView(newLocation, 16);
        }

        if (markerRef.current) {
          markerRef.current.setLatLng(newLocation);
        }

        setLocating(false);
      },
      (error) => {
        console.error("GPS error:", error);

        alert(
          "Unable to get your location. Please allow location access or select the location manually."
        );

        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  return (
    <div>
      <div
        ref={mapContainer}
        className="h-80 w-full rounded-xl"
      />

      <button
        type="button"
        onClick={locate}
        disabled={locating}
        className="mt-2 rounded-lg border px-3 py-2 text-sm"
      >
        {locating
          ? "Locating..."
          : "Use my current location"}
      </button>

      {value && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Location: {value[0].toFixed(5)},{" "}
          {value[1].toFixed(5)}
        </p>
      )}
    </div>
  );
}