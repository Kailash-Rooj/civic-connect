# CivicConnect

### A Community-Driven Civic Issue Reporting and Resolution Platform

**Live application:** [CivicConnect](https://civic-connect-vert-pi.vercel.app)

CivicConnect is a web-based civic technology prototype that helps citizens report local infrastructure and public-service issues, discover existing reports nearby, and track complaint resolution. It provides a public issue map, a citizen reporting interface, and an administrative dashboard.

## The Problem

Civic issues such as potholes, accumulated garbage, broken streetlights, and waterlogging can affect entire communities. Reporting channels may be fragmented, progress can be difficult to track, and multiple citizens may report the same problem independently.

## Our Solution

CivicConnect provides a centralized platform for reporting and tracking civic issues. Citizens can submit a photograph and location, support existing reports affecting their neighbourhood, and follow progress. Administrators can manage complaints and upload evidence when work is completed.

## How It Works

**Citizen workflow**

1. Register or log in.
2. Select a category and capture a photograph of the issue.
3. Choose the location on the map and submit the report.
4. If a nearby unresolved report matches, review it and support the existing complaint when appropriate.
5. Track complaint progress through the dashboard and public issue pages.
6. After resolution, the original reporter can submit a rating and optional feedback.

**Administrator workflow**

1. Sign in using an administrator account created privately by the project maintainer.
2. Review submitted complaints.
3. Change the status to `In Progress` when work begins.
4. Upload an after-photo and confirm resolution.
5. Manage complaints that need cancellation.

**Complaint lifecycle**

```text
Submitted → In Progress → Resolved
     \             /
      → Cancelled ←
```

Cancelled complaints are retained in the backend and are not treated as resolved issues.

## Key Features

- Photo-based civic issue reporting with location selection.
- Public issue listing and interactive map.
- Duplicate detection for nearby unresolved reports in the same category.
- Community support for existing complaints.
- Complaint status tracking.
- Admin dashboard for complaint management.
- Before-and-after photographs for resolution verification.
- Citizen ratings and optional feedback after resolution.
- English, Bengali, and Hindi support on the reporting page.

### Supported Categories

Streetlights, Roads & Potholes, Garbage & Waste Management, Water Supply, Public Water Taps, Public Toilets & Sanitation, Trees & Green Spaces, Traffic Signals & Road Signs, Public Transport Infrastructure, Footpaths & Public Infrastructure, Electrical Infrastructure, Drainage & Waterlogging, and Other.

## Technology Stack

| Layer | Technologies | Purpose |
|---|---|---|
| Frontend | React, Vite | User interface and build tooling |
| Styling | Tailwind CSS | Responsive UI |
| Navigation and icons | React Router, Lucide React | Routing and interface icons |
| API communication | Axios | Frontend-to-backend requests |
| Maps | Leaflet, React Leaflet, OpenStreetMap | Location selection and public issue map |
| Internationalization | i18next, react-i18next | Translation support |
| Backend | Node.js, Express.js | REST API and application logic |
| Database | MongoDB, Mongoose | Users, complaints, and related data |
| Authentication | express-session, connect-mongo, bcrypt | Server-side sessions and password hashing |
| Image storage | Cloudinary | Complaint photographs |
| Deployment | Vercel, Render, MongoDB Atlas | Frontend, backend, and hosted database |

## Getting Started Locally

**Prerequisites:** Node.js, npm, and a MongoDB database.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd civic-connect
```

Replace `<your-repository-url>` with your actual GitHub repository URL.

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file in the backend directory and configure the environment variables listed below.

Start the backend server:

```bash
npm run dev
```

### 3. Start the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Environment Variables

Configure these variables in the backend environment. Use the actual values provided by your services.

| Variable | Purpose |
|---|---|
| `PORT` | Backend port; may be assigned automatically by the hosting provider |
| `NODE_ENV` | Set to `development` locally and `production` when deployed |
| `CLIENT_URL` | Frontend origin allowed by the backend, such as `http://localhost:5173` locally |
| `MONGODB_URI` | MongoDB connection string |
| `SESSION_SECRET` | Strong, random secret for signing session cookies |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

Cloudinary credentials are required for image uploads. Configure all required values in the hosting provider's environment settings for deployment. Never commit real credentials or the backend `.env` file to a public repository.

## Creating an Administrator

Administrator accounts are created privately by the project maintainer rather than through public registration.

From the backend directory, run the administrator creation command configured in `server/package.json`. For example, if the script is named `create-admin`:

```bash
npm run create-admin
```

Use a strong, unique password and grant administrator access only to trusted maintainers.

## Project Structure

```text
civic-connect/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── i18n.js
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   └── index.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## Documentation

| Document | Description |
|---|---|
| [Technical Design](docs/TECHNICAL_DESIGN.md) | System design, architecture, and complaint lifecycle |
| [System Architecture Diagram](docs/system-architecture.png) | Visual overview of the application architecture |
| [Complaint Lifecycle Diagram](docs/Complaint_Lifecycle.png) | Complaint status transitions |
| [Test Cases](docs/TEST_CASES.md) | Functional and security test scenarios |
| [Sample Data](docs/sample-data/README.md) | Sample data usage and setup |



## Expected Impact

CivicConnect aims to make civic reporting more accessible, reduce duplicate reports, encourage community participation, and improve transparency by making complaint progress and resolution evidence visible.

## Future Scope

- Integration with municipal authorities and official complaint systems.
- Notifications when complaint statuses change.
- Analytics to identify recurring civic problems and affected areas.
- Expansion to more cities and local administrative bodies.

---