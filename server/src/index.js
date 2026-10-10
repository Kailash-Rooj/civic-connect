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
const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/civicconnect";

const isProduction = process.env.NODE_ENV === "production";

// Ensure the session secret is configured.
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required");
}

// Trust Render's reverse proxy in production.
// This is required for secure cookies behind HTTPS termination.
if (isProduction) {
  app.set("trust proxy", 1);
}

// CORS: allow your frontend to send and receive session cookies.
app.use(
  cors({
    origin: CLIENT_URL.replace(/\/+$/, ""),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request bodies.
app.use(express.json());

// Session configuration.
app.use(
  session({
    name: "civicconnect.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,

    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
    }),

    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// Health check.
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CivicConnect API is running",
  });
});

// API routes.
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

// Handle unknown API routes.
app.use("/api", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Central error handler.
app.use((err, _req, res, _next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
});

// Connect to MongoDB before starting the server.
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`CivicConnect API listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });