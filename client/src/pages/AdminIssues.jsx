import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Camera,
  CircleCheck,
  Play,
  XCircle,
} from "lucide-react";
import api from "../lib/api";

export default function AdminIssues() {
  const [params, setParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState("");
  const [pendingPhoto, setPendingPhoto] = useState(null);

  const status = params.get("status") || "";

  async function load() {
    try {
      const r = await api.get("/api/complaints/admin/all", {
        params: { status },
      });

      setItems(r.data.complaints);
    } catch (e) {
      alert(
        e.response?.data?.message ||
          "Failed to load complaints"
      );
    }
  }

  useEffect(() => {
    load();
  }, [status]);

  async function update(id, newStatus, file) {
    setBusy(id);

    try {
      const fd = new FormData();

      fd.append("status", newStatus);

      if (file) {
        fd.append("afterPhoto", file);
      }

      await api.patch(
        `/api/complaints/admin/${id}`,
        fd
      );

      await load();
    } catch (e) {
      alert(
        e.response?.data?.message ||
          "Update failed"
      );
    } finally {
      setBusy("");
    }
  }

  function getStatusStyle(status) {
    switch (status) {
      case "submitted":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  }

  function handlePhotoSelect(complaint, file) {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setPendingPhoto({
      complaintId: complaint._id,
      complaintIdText: complaint.complaintId,
      category: complaint.category,
      file,
      previewUrl,
    });
  }

  function closePhotoPreview() {
    if (pendingPhoto?.previewUrl) {
      URL.revokeObjectURL(pendingPhoto.previewUrl);
    }

    setPendingPhoto(null);
  }

  async function confirmResolve() {
    if (!pendingPhoto) return;

    const {
      complaintId,
      file,
      previewUrl,
    } = pendingPhoto;

    setPendingPhoto(null);

    // The preview URL is no longer needed.
    URL.revokeObjectURL(previewUrl);

    await update(
      complaintId,
      "resolved",
      file
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">

      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Complaints
          </h1>

          <p className="mt-1 text-slate-600">
            Review and resolve civic issues.
          </p>
        </div>

        {/* STATUS FILTER */}
        <select
          value={status}
          onChange={(e) => {
            const value = e.target.value;

            if (value) {
              setParams({ status: value });
            } else {
              setParams({});
            }
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
        >
          <option value="">All</option>

          <option value="submitted">
            Submitted
          </option>

          <option value="in_progress">
            In progress
          </option>

          <option value="resolved">
            Resolved
          </option>

          <option value="cancelled">
            Cancelled
          </option>
        </select>
      </div>

      {/* COMPLAINTS */}
      <div className="mt-8 space-y-5">

        {items.map((complaint) => (
          <div
            key={complaint._id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >

            {/* CARD CONTENT */}
            <div className="p-5">

              {/* TOP ROW */}
              <div className="flex flex-wrap items-start justify-between gap-4">

                <div className="min-w-0">

                  {/* COMPLAINT ID */}
                  <p className="text-xs font-bold tracking-wide text-teal-700">
                    {complaint.complaintId}
                  </p>

                  {/* CATEGORY */}
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    {complaint.category}
                  </h2>

                  {/* DESCRIPTION */}
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {complaint.description}
                  </p>
                </div>

                {/* STATUS */}
                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                    complaint.status
                  )}`}
                >
                  {complaint.status.replace(
                    "_",
                    " "
                  )}
                </span>
              </div>

              {/* REPORTER INFO */}
              <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Reporter
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {complaint.reporter?.fullName ||
                    "Citizen"}

                  {" · "}

                  {complaint.reporter?.phone ||
                    "No phone"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Department:{" "}
                  {complaint.department}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            {complaint.status !== "resolved" &&
              complaint.status !== "cancelled" && (
                <div className="border-t bg-slate-50 px-5 py-4">

                  <div className="flex flex-wrap gap-2">

                    {/* START WORK */}
                    {complaint.status ===
                      "submitted" && (
                      <button
                        disabled={
                          busy === complaint._id
                        }
                        onClick={() =>
                          update(
                            complaint._id,
                            "in_progress"
                          )
                        }
                        className="flex items-center gap-2 rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Play size={15} />

                        {busy === complaint._id
                          ? "Updating..."
                          : "Start work"}
                      </button>
                    )}

                    {/* AFTER PHOTO */}
                    <label
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 ${
                        busy === complaint._id
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    >
                      <Camera size={16} />

                      Choose after photo

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={
                          busy === complaint._id
                        }
                        onChange={(e) => {
                          handlePhotoSelect(
                            complaint,
                            e.target.files?.[0]
                          );

                          // Allows selecting the same
                          // image again later.
                          e.target.value = "";
                        }}
                      />
                    </label>

                    {/* CANCEL */}
                    <button
                      disabled={
                        busy === complaint._id
                      }
                      onClick={() =>
                        update(
                          complaint._id,
                          "cancelled"
                        )
                      }
                      className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle size={16} />

                      Cancel
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    Upload the after photo to mark
                    this complaint as resolved.
                  </p>
                </div>
              )}

            {/* RESOLVED MESSAGE */}
            {complaint.status === "resolved" && (
              <div className="flex items-center gap-2 border-t bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700">
                <CircleCheck size={17} />

                Complaint resolved
              </div>
            )}

            {/* CANCELLED MESSAGE */}
            {complaint.status === "cancelled" && (
              <div className="flex items-center gap-2 border-t bg-red-50 px-5 py-3 text-sm font-medium text-red-700">
                <XCircle size={17} />

                Complaint cancelled
              </div>
            )}
          </div>
        ))}

        {/* EMPTY STATE */}
        {!items.length && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">

            <p className="font-medium text-slate-700">
              No complaints found.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing the status filter.
            </p>

          </div>
        )}
      </div>

      {/* PHOTO PREVIEW + CONFIRMATION MODAL */}
      {pendingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="p-5 pb-3">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Preview after photo
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Check the photo before marking
                    the complaint as resolved.
                  </p>
                </div>

                <button
                  onClick={closePhotoPreview}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  <XCircle size={20} />
                </button>

              </div>
            </div>

            {/* ACTUAL IMAGE PREVIEW */}
            <div className="px-5">

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">

                <img
                  src={pendingPhoto.previewUrl}
                  alt="Selected after photo"
                  className="max-h-[55vh] w-full object-contain"
                />

              </div>

            </div>

            {/* FILE INFO */}
            <div className="px-5 pt-4">

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs font-bold tracking-wide text-teal-700">
                  {pendingPhoto.complaintIdText}
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {pendingPhoto.category}
                </p>

                <p className="mt-2 truncate text-sm text-slate-500">
                  {pendingPhoto.file.name}
                </p>

              </div>
            </div>

            {/* MODAL ACTIONS */}
            <div className="flex justify-end gap-3 p-5">

              {/* CANCEL */}
              <button
                onClick={closePhotoPreview}
                disabled={
                  busy ===
                  pendingPhoto.complaintId
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              {/* CONFIRM */}
              <button
                onClick={confirmResolve}
                disabled={
                  busy ===
                  pendingPhoto.complaintId
                }
                className="rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm & Resolve
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}