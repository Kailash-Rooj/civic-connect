const mongoose = require("mongoose");

const CATEGORIES = [
  "Streetlights", "Roads & Potholes", "Garbage & Waste Management", "Water Supply", "Public Water Taps",
  "Public Toilets & Sanitation", "Trees & Green Spaces", "Traffic Signals & Road Signs", "Public Transport Infrastructure",
  "Footpaths & Public Infrastructure", "Electrical Infrastructure", "Drainage & Waterlogging", "Other"
];
const STATUS = ["submitted", "in_progress", "resolved", "cancelled"];
const DEPARTMENTS = {
  "Streetlights": "Electrical Department", "Roads & Potholes": "Roads Department", "Garbage & Waste Management": "Sanitation Department",
  "Water Supply": "Water Department", "Public Water Taps": "Water Department", "Public Toilets & Sanitation": "Sanitation Department",
  "Trees & Green Spaces": "Parks & Horticulture Department", "Traffic Signals & Road Signs": "Traffic Department",
  "Public Transport Infrastructure": "Transport Department", "Footpaths & Public Infrastructure": "Public Works Department",
  "Electrical Infrastructure": "Electrical Department", "Drainage & Waterlogging": "Drainage Department", "Other": "Admin Review"
};
const DUPLICATE_RADIUS_METERS = {
  "Streetlights": 30, "Roads & Potholes": 50, "Garbage & Waste Management": 50, "Water Supply": 50,
  "Public Water Taps": 50, "Public Toilets & Sanitation": 100, "Trees & Green Spaces": 50, "Traffic Signals & Road Signs": 100,
  "Public Transport Infrastructure": 100, "Footpaths & Public Infrastructure": 50, "Electrical Infrastructure": 50,
  "Drainage & Waterlogging": 100, "Other": 50
};

const imageSchema = new mongoose.Schema({ url: String, publicId: String }, { _id: false });
const ratingSchema = new mongoose.Schema({ stars: { type: Number, min: 1, max: 5 }, feedback: { type: String, maxlength: 500 } }, { _id: false });

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true, index: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  category: { type: String, enum: CATEGORIES, required: true },
  department: { type: String, required: true },
  description: { type: String, required: true, maxlength: 500 },
  location: { type: { type: String, enum: ["Point"], required: true }, coordinates: { type: [Number], required: true } },
  beforePhoto: { type: imageSchema, required: true },
  afterPhoto: { type: imageSchema, default: null },
  resolutionNote: { type: String, maxlength: 500, default: "" },
  status: { type: String, enum: STATUS, default: "submitted", index: true },
  affectedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  affectedCount: { type: Number, default: 1, min: 1 },
  cancellationReason: { type: String, maxlength: 500, default: "" },
  resolvedAt: Date,
  rating: { type: ratingSchema, default: null }
}, { timestamps: true });

complaintSchema.index({ location: "2dsphere" });
complaintSchema.index({ category: 1, status: 1, createdAt: -1 });

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = { Complaint, CATEGORIES, STATUS, DEPARTMENTS, DUPLICATE_RADIUS_METERS };
