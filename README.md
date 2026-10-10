# CivicConnect

A civic issue reporting and resolution platform for West Bengal.

## Stack
React + Vite + Tailwind, Node + Express, MongoDB, Express sessions, Cloudinary, Leaflet + OpenStreetMap.

## Features
- Citizen/admin roles
- Session authentication
- Civic issue reporting with exact map location
- One before photo + one after photo
- Category to department mapping
- Duplicate detection by category and configurable distance
- "I'm also affected" support count
- Submitted → In Progress → Resolved
- Citizen cancellation and history
- Public issue list
- Before/after resolution evidence
- Citizen 1–5 star rating and optional feedback

## Run
1. Start MongoDB.
2. Copy `server/.env.example` to `server/.env` and fill session + Cloudinary credentials.
3. `cd server && npm install && npm run dev`
4. `cd client && npm install && npm run dev`
5. Create an admin: `cd server && npm run create-admin -- "Admin" admin@example.com password123 9876543210`

Cloudinary is required for complaint photo uploads.
