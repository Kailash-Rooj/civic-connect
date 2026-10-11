import { useEffect, useRef, useState } from "react";
import { Camera, RotateCcw, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MapPicker from "../components/MapPicker";
import api from "../lib/api";
import { useTranslation } from "react-i18next";

const categories = [
  "Streetlights",
  "Roads & Potholes",
  "Garbage & Waste Management",
  "Water Supply",
  "Public Water Taps",
  "Public Toilets & Sanitation",
  "Trees & Green Spaces",
  "Traffic Signals & Road Signs",
  "Public Transport Infrastructure",
  "Footpaths & Public Infrastructure",
  "Electrical Infrastructure",
  "Drainage & Waterlogging",
  "Other",
];

const categoryKeys = {
  Streetlights: "streetlights",
  "Roads & Potholes": "roads",
  "Garbage & Waste Management": "garbage",
  "Water Supply": "water",
  "Public Water Taps": "taps",
  "Public Toilets & Sanitation": "toilets",
  "Trees & Green Spaces": "trees",
  "Traffic Signals & Road Signs": "traffic",
  "Public Transport Infrastructure": "transport",
  "Footpaths & Public Infrastructure": "footpaths",
  "Electrical Infrastructure": "electrical",
  "Drainage & Waterlogging": "drainage",
  Other: "other",
};

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

export default function ReportIssue() {
  const nav = useNavigate();
  const { t, i18n } = useTranslation();

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [file, setFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const [duplicate, setDuplicate] = useState(null);
  const [supporting, setSupporting] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Create and clean up the captured-photo preview URL.
  useEffect(() => {
    if (!file) {
      setPhotoPreview("");
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPhotoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Attach the live camera stream after the modal/video has rendered.
  useEffect(() => {
    if (!cameraOpen || !videoRef.current || !streamRef.current) return;

    videoRef.current.srcObject = streamRef.current;
    videoRef.current.play().catch(() => {});
  }, [cameraOpen]);

  // Stop camera and release the camera when the page unmounts.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  async function openCamera() {
    setCameraError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera access requires HTTPS or localhost. Open the site securely and try again."
      );
      return;
    }

    try {
      // Stop any previous stream before opening a new one.
      streamRef.current?.getTracks().forEach((track) => track.stop());

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraOpen(true);
    } catch (error) {
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setCameraError(
          "Camera permission was denied. Allow camera access in your browser settings."
        );
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        setCameraError("No camera was found on this device.");
      } else {
        setCameraError("Unable to open the camera. Check camera permissions and try again.");
      }
    }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }

  function capturePhoto() {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraError("The camera is not ready yet. Please wait and try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError("Could not capture the photo. Please try again.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Could not capture the photo. Please try again.");
          return;
        }

        if (blob.size > MAX_PHOTO_SIZE) {
          setCameraError(
            "The captured photo exceeds the 5 MB limit. Please retake it."
          );
          return;
        }

        const capturedFile = new File(
          [blob],
          `civicconnect-${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );

        setFile(capturedFile);
        setErr("");
        closeCamera();
      },
      "image/jpeg",
      0.85
    );
  }

  async function submit(e) {
    e.preventDefault();

    setErr("");
    setDuplicate(null);
    setSupportSuccess(false);

    if (!category) {
      return setErr(t("errors.category", "Please select a category."));
    }

    if (!description.trim()) {
      return setErr(t("errors.description", "Please describe the issue."));
    }

    if (!location) {
      return setErr(t("errors.location"));
    }

    if (!file) {
      return setErr(t("errors.photo"));
    }

    if (file.size > MAX_PHOTO_SIZE) {
      return setErr("Photo exceeds the 5 MB limit. Please capture it again.");
    }

    setBusy(true);

    try {
      const fd = new FormData();

      // Keep backend values in English.
      fd.append("category", category);
      fd.append("description", description.trim());
      fd.append("latitude", location[0]);
      fd.append("longitude", location[1]);
      fd.append("beforePhoto", file);

      await api.post("/api/complaints", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      nav("/citizen");
    } catch (e) {
      if (e.response?.status === 409 && e.response.data?.duplicate) {
        setDuplicate(e.response.data.complaint);
      } else {
        setErr(e.response?.data?.message || t("errors.submit"));
      }
    } finally {
      setBusy(false);
    }
  }

  async function supportIssue() {
    if (!duplicate?._id) return;

    setSupporting(true);
    setErr("");

    try {
      const response = await api.post(
        `/api/complaints/${duplicate._id}/support`
      );

      setDuplicate(response.data.complaint);
      setSupportSuccess(true);
    } catch (e) {
      setErr(e.response?.data?.message || "Could not mark you as affected");
    } finally {
      setSupporting(false);
    }
  }

  function viewIssue() {
    if (duplicate?._id) {
      nav(`/issues/${duplicate._id}`);
    }
  }

  function closeDuplicate() {
    setDuplicate(null);
    setSupportSuccess(false);
  }

  return (
    <div className="min-h-screen">
      {/* REPORT PAGE */}
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* LANGUAGE SELECTOR */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Choose your language
          </p>

          <select
            value={i18n.resolvedLanguage || i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-teal-600 dark:focus:border-teal-400"
            aria-label="Language"
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold">{t("report.title")}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{t("report.help")}</p>

        {/* FORM */}
        <form
          onSubmit={submit}
          className="mt-8 space-y-7 rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-sm"
        >
          {/* CATEGORY */}
          <div>
            <label className="font-medium">{t("report.category")}</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900
                        dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
                <option
                  value=""
                  className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                >
                  {t("report.selectCategory")}
                </option>

                {categories.map((c) => (
                  <option
                    key={c}
                    value={c}
                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {t(`categories.${categoryKeys[c]}`)}
                  </option>
                ))}
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-medium">{t("report.description")}</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              required
              rows={5}
              className="mt-2 w-full rounded-lg border p-3"
              placeholder={t("report.descriptionPlaceholder")}
            />

            <p className="mt-1 text-right text-xs text-slate-500 dark:text-slate-400">
              {description.length}/500
            </p>
          </div>

          {/* LOCATION */}
          <div>
            <label className="font-medium">{t("report.location")}</label>
            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
              {t("report.locationHelp")}
            </p>

            <MapPicker value={location} onChange={setLocation} />
          </div>

          {/* BEFORE PHOTO - CAMERA ONLY */}
          <div>
            <label className="font-medium">{t("report.beforePhoto")}</label>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Take a live photo of the civic issue using your camera. Gallery uploads are not available.
            </p>

            {!file ? (
              <button
                type="button"
                onClick={openCamera}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 py-3 font-semibold text-white hover:bg-teal-900 dark:hover:bg-teal-700"
              >
                <Camera size={18} />
                Open Camera
              </button>
            ) : (
              <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-700">
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Captured civic issue"
                    className="max-h-64 w-full rounded-lg object-contain"
                  />
                )}

                <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  Photo captured successfully
                </p>

                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="mt-2 flex items-center gap-2 rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                >
                  <RotateCcw size={15} />
                  Retake photo
                </button>
              </div>
            )}

            {cameraError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-300">{cameraError}</p>
            )}

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Exactly one photo, maximum 5 MB.
            </p>
          </div>

          {/* ERROR */}
          {err && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-700 dark:text-red-300">
              {err}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-teal-800 p-3 font-semibold text-white disabled:opacity-60"
          >
            {busy ? t("report.submitting") : t("report.submit")}
          </button>
        </form>
      </div>

      {/* CAMERA MODAL */}
      {cameraOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between p-4">
              <h2 className="font-bold text-slate-900 dark:text-slate-100">Capture civic issue</h2>

              <button
                type="button"
                onClick={closeCamera}
                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Close camera"
              >
                <X size={20} />
              </button>
            </div>

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="max-h-[65vh] w-full bg-black object-contain"
            />

            {cameraError && (
              <p className="px-4 pt-3 text-sm text-red-600 dark:text-red-300">{cameraError}</p>
            )}

            <div className="flex gap-3 p-4">
              <button
                type="button"
                onClick={closeCamera}
                className="flex-1 rounded-xl border px-4 py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 py-3 font-semibold text-white"
              >
                <Camera size={18} />
                Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DUPLICATE MODAL */}
      {duplicate && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl">
            {!supportSuccess ? (
              <>
                {/* WARNING ICON */}
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40 text-2xl">
                  ⚠️
                </div>

                <h2 className="mt-4 text-center text-xl font-bold">
                  {t("duplicate.title")}
                </h2>

                <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
                  {t("duplicate.message")}
                </p>

                {/* EXISTING COMPLAINT */}
                <div className="mt-5 rounded-xl bg-slate-50 dark:bg-slate-950 p-4">
                  <p className="text-sm font-semibold text-teal-800 dark:text-teal-300">
                    {duplicate.category
                      ? t(`categories.${categoryKeys[duplicate.category]}`)
                      : ""}
                  </p>

                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {duplicate.description}
                  </p>

                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    👥 {duplicate.affectedCount || 1} {t("duplicate.affected")}
                  </div>
                </div>

                <p className="mt-4 text-center text-sm font-medium">
                  {t("duplicate.question")}
                </p>

                {/* ACTIONS */}
                <div className="mt-5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={supportIssue}
                    disabled={supporting}
                    className="w-full rounded-xl bg-teal-800 px-4 py-3 font-semibold text-white disabled:opacity-60"
                  >
                    {supporting
                      ? t("duplicate.supporting")
                      : t("duplicate.support")}
                  </button>

                  <button
                    type="button"
                    onClick={viewIssue}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 font-semibold"
                  >
                    {t("duplicate.view")}
                  </button>

                  <button
                    type="button"
                    onClick={closeDuplicate}
                    className="w-full px-4 py-2 text-sm text-slate-500 dark:text-slate-400"
                  >
                    {t("duplicate.close")}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* SUCCESS ICON */}
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-2xl">
                  ✓
                </div>

                <h2 className="mt-4 text-center text-xl font-bold">
                  {t("duplicate.successTitle")}
                </h2>

                <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
                  {t("duplicate.successMessage")}
                </p>

                <div className="mt-5 rounded-xl bg-green-50 dark:bg-green-950/40 p-4 text-center">
                  <p className="text-sm font-semibold text-green-800">
                    👥 {duplicate.affectedCount || 1} {t("duplicate.affected")}
                  </p>
                </div>

                {/* SUCCESS ACTIONS */}
                <div className="mt-5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={viewIssue}
                    className="w-full rounded-xl bg-teal-800 px-4 py-3 font-semibold text-white"
                  >
                    {t("duplicate.view")}
                  </button>

                  <button
                    type="button"
                    onClick={() => nav("/citizen")}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 font-semibold"
                  >
                    {t("duplicate.dashboard")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}