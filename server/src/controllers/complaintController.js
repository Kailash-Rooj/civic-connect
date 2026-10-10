const mongoose = require("mongoose");
const { Complaint, CATEGORIES, DEPARTMENTS, DUPLICATE_RADIUS_METERS } = require("../models/Complaint");
const { User } = require("../models/User");
const { isInWestBengal, validCoordinates } = require("../utils/geo");
const { configured, uploadBuffer } = require("../utils/cloudinary");

function clean(v) { return typeof v === "string" ? v.trim() : ""; }
function publicComplaint(c, viewerId) {
  const obj = c.toObject ? c.toObject() : c;
  return { ...obj, reporter: undefined, isReporter: viewerId ? String(obj.reporter) === String(viewerId) : false, canSupport: viewerId ? String(obj.reporter) !== String(viewerId) && !(obj.affectedUsers || []).some(id => String(id) === String(viewerId)) : false, hasSupported: viewerId ? (obj.affectedUsers || []).some(id => String(id) === String(viewerId)) : false };
}
function publicQuery() { return { status: { $ne: "cancelled" } }; }

async function createComplaint(req, res, next) {
  try {
    const category = clean(req.body.category), description = clean(req.body.description);
    const lat = Number(req.body.latitude), lng = Number(req.body.longitude);
    if (!CATEGORIES.includes(category)) return res.status(400).json({ success: false, message: "Invalid category" });
    if (!description || description.length > 500) return res.status(400).json({ success: false, message: "Description is required and must be at most 500 characters" });
    if (!validCoordinates(lat, lng) || !isInWestBengal(lat, lng)) return res.status(400).json({ success: false, message: "Complaint location must be inside West Bengal" });
    if (!req.file) return res.status(400).json({ success: false, message: "Before photo is required" });
    if (!configured()) return res.status(503).json({ success: false, message: "Cloudinary is not configured" });

    const radius = DUPLICATE_RADIUS_METERS[category] || 50;
    const existing = await Complaint.findOne({ category, ...publicQuery(), location: { $near: { $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: radius } } }).sort({ createdAt: -1 });
    if (existing) return res.status(409).json({ success: false, duplicate: true, message: "A nearby active issue already exists", complaint: publicComplaint(existing, req.user._id) });

    const uploaded = await uploadBuffer(req.file.buffer, "civicconnect/before");
    const complaintId = `CC-${Date.now().toString(36).toUpperCase()}`;
    const complaint = await Complaint.create({ complaintId, reporter: req.user._id, category, department: DEPARTMENTS[category], description, location: { type: "Point", coordinates: [lng, lat] }, beforePhoto: { url: uploaded.secure_url, publicId: uploaded.public_id }, affectedUsers: [req.user._id], affectedCount: 1 });
    res.status(201).json({ success: true, complaint: publicComplaint(complaint, req.user._id) });
  } catch (err) { next(err); }
}

async function listPublic(req, res, next) {
  try {
    const filter = { status: { $in: ["submitted", "in_progress", "resolved"] } };
    if (req.query.category && CATEGORIES.includes(req.query.category)) filter.category = req.query.category;
    if (["submitted", "in_progress", "resolved"].includes(req.query.status)) filter.status = req.query.status;
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ success: true, complaints: complaints.map(c => publicComplaint(c, req.user?._id)) });
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const c = await Complaint.findOne({ _id: req.params.id, ...publicQuery() });
    if (!c) return res.status(404).json({ success: false, message: "Complaint not found" });
    res.json({ success: true, complaint: publicComplaint(c, req.user?._id) });
  } catch (err) { next(err); }
}

async function listMine(req, res, next) {
  try {
    const complaints = await Complaint.find({ reporter: req.user._id, status: { $in: ["submitted", "in_progress"] } }).sort({ createdAt: -1 });
    res.json({ success: true, complaints: complaints.map(c => publicComplaint(c, req.user._id)) });
  } catch (err) { next(err); }
}
async function history(req, res, next) {
  try {
    const complaints = await Complaint.find({ reporter: req.user._id, status: "resolved" }).sort({ resolvedAt: -1 });
    res.json({ success: true, complaints: complaints.map(c => publicComplaint(c, req.user._id)) });
  } catch (err) { next(err); }
}

async function support(req, res, next) {
  try {
    const c = await Complaint.findOne({ _id: req.params.id, status: { $in: ["submitted", "in_progress"] } });
    if (!c) return res.status(404).json({ success: false, message: "Active complaint not found" });
    if (String(c.reporter) === String(req.user._id)) return res.status(400).json({ success: false, message: "You already reported this issue" });
    if (c.affectedUsers.some(id => String(id) === String(req.user._id))) return res.status(409).json({ success: false, message: "You already marked this issue as affected" });
    c.affectedUsers.push(req.user._id); c.affectedCount = c.affectedUsers.length; await c.save();
    res.json({ success: true, complaint: publicComplaint(c, req.user._id) });
  } catch (err) { next(err); }
}

async function cancel(req, res, next) {
  try {
    const c = await Complaint.findOne({ _id: req.params.id, reporter: req.user._id, status: { $in: ["submitted", "in_progress"] } });
    if (!c) return res.status(404).json({ success: false, message: "Active complaint not found" });
    const reason = clean(req.body.reason);
    if (!reason) return res.status(400).json({ success: false, message: "Cancellation reason is required" });
    c.status = "cancelled"; c.cancellationReason = reason; await c.save();
    res.json({ success: true, message: "Complaint cancelled" });
  } catch (err) { next(err); }
}

async function rate(req, res, next) {
  try {
    const c = await Complaint.findOne({ _id: req.params.id, reporter: req.user._id, status: "resolved" });
    if (!c) return res.status(404).json({ success: false, message: "Resolved complaint not found" });
    const stars = Number(req.body.stars), feedback = clean(req.body.feedback);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    if (feedback.length > 500) return res.status(400).json({ success: false, message: "Feedback must be at most 500 characters" });
    c.rating = { stars, feedback }; await c.save(); res.json({ success: true, complaint: publicComplaint(c, req.user._id) });
  } catch (err) { next(err); }
}
async function deleteRating(req, res, next) {
  try {
    const c = await Complaint.findOne({ _id: req.params.id, reporter: req.user._id, status: "resolved" });
    if (!c) return res.status(404).json({ success: false, message: "Resolved complaint not found" });
    c.rating = null; await c.save(); res.json({ success: true });
  } catch (err) { next(err); }
}

async function adminList(req, res, next) {
  try {
    const filter = {};
    if (["submitted", "in_progress", "resolved", "cancelled"].includes(req.query.status)) filter.status = req.query.status;
    const complaints = await Complaint.find(filter).populate("reporter", "fullName email phone").sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, complaints });
  } catch (err) { next(err); }
}
async function adminUpdate(req, res, next) {
  try {
    const c = await Complaint.findById(req.params.id);
    if (!c) return res.status(404).json({ success: false, message: "Complaint not found" });
    const status = clean(req.body.status);
    if (!["submitted", "in_progress", "resolved", "cancelled"].includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });
    if (status === "resolved") {
      if (!req.file) return res.status(400).json({ success: false, message: "After photo is required before resolving" });
      if (!configured()) return res.status(503).json({ success: false, message: "Cloudinary is not configured" });
      const uploaded = await uploadBuffer(req.file.buffer, "civicconnect/after");
      c.afterPhoto = { url: uploaded.secure_url, publicId: uploaded.public_id };
      c.resolutionNote = clean(req.body.resolutionNote);
      c.resolvedAt = new Date();
    }
    if (status === "cancelled") c.cancellationReason = clean(req.body.reason);
    c.status = status;
    await c.save();
    res.json({ success: true, complaint: c });
  } catch (err) { next(err); }
}

module.exports = { createComplaint, listPublic, getOne, listMine, history, support, cancel, rate, deleteRating, adminList, adminUpdate };
