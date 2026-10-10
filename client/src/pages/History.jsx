import { useEffect, useState } from "react";
import api from "../lib/api";
import ComplaintCard from "../components/ComplaintCard";

export default function History() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get("/api/complaints/history")
      .then((r) => setItems(r.data.complaints))
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">

      {/* HEADER */}
      <h1 className="text-3xl font-bold">
        Complaint history
      </h1>

      <p className="mt-1 text-slate-600">
        Resolved issues you reported.
      </p>

      {/* COMPLAINTS */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">

        {items.map((complaint) => (
          <ComplaintCard
            key={complaint._id}
            complaint={complaint}
          />
        ))}

        {!items.length && (
          <div className="rounded-2xl border bg-white p-10 text-center text-slate-500">
            No resolved complaints yet.
          </div>
        )}

      </div>
    </div>
  );
}