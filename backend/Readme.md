# Backend

This package provides the Express API for the timetable project.

## Scripts

- `npm run dev` - start the API with Nodemon.
- `npm start` - start the API with Node.

## Requirements

- Node.js 18 or newer is recommended.
- Install dependencies from this folder before running the server.

## Setup

```bash
npm install
```

Create a `.env` file in this folder with the values your deployment needs. The server reads these variables:

- `PORT` - API port, defaults to `3001`.
- `CORS_URLS` - comma-separated list of allowed frontend origins.
- `TIMETABLE_FRONTEND_URL` - frontend URL used after Google Calendar callback.
- `GOOGLE_CLIENT_ID` - Google OAuth client ID.
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret.
- `GOOGLE_REDIRECT_URL` - OAuth redirect URL that points to the backend callback.
- `CALENDAR_NAME` - calendar name used for Google Calendar sync, defaults to `Timetable`.
- `SEMESTER_START_DATE` - start date used when generating recurring events.
- `CALENDAR_TIME_ZONE` - calendar time zone, defaults to `Asia/Kolkata`.

Example:

```bash
PORT=3001
CORS_URLS=http://localhost:3000
TIMETABLE_FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URL=http://localhost:3001/api/v1/timetable/google/callback
CALENDAR_NAME=Timetable
SEMESTER_START_DATE=2025-07-21
CALENDAR_TIME_ZONE=Asia/Kolkata
```

## Run

```bash
npm run dev
```

The server listens on `PORT` and exposes these routes:

- `GET /api/v1/health` - health check.
- `POST /api/v1/timetable/google/url` - create the Google Calendar auth URL.
- `GET /api/v1/timetable/google/callback` - handle Google OAuth callback.
- `GET /api/v1/timetable/schedule/:batch` - return a batch timetable.
- `POST /api/v1/timetable/freeslots` - return timetable data for multiple batches.
- `GET /api/v1/timetable/batches` - return all available batch names.

## Data Source

Timetable data is loaded from `src/db/timetable.js` and the JSON asset under `src/assets/timetable.json`.
