const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").MongoStore;
require("dotenv").config();
const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/civicconnect";
const isProduction = process.env.NODE_ENV === "production";
if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is required");

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(session({ name: "civicconnect.sid", secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, store: MongoStore.create({ mongoUrl: MONGODB_URI, collectionName: "sessions" }), cookie: { httpOnly: true, secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 1000 * 60 * 60 * 24 * 7 } }));
app.get("/api/health", (_req, res) => res.json({ success: true, message: "CivicConnect API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ success: false, message: err.message || "Something went wrong" }); });

mongoose.connect(MONGODB_URI).then(() => app.listen(PORT, () => console.log(`CivicConnect API listening on http://localhost:${PORT}`))).catch(err => { console.error("Failed to start server", err); process.exit(1); });
