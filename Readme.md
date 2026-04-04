# Timetable

Timetable is a split frontend/backend project for viewing batch schedules, finding shared free slots, and syncing timetable entries with Google Calendar.

## Project Structure

- [frontend](frontend/Readme.md) - React + Vite UI for timetable browsing, free slots, and calendar sync.
- [backend](backend/Readme.md) - Express API for timetable data, health checks, and Google Calendar integration.

## What It Does

- Shows batch timetables in a browser UI.
- Finds free slots across multiple batches.
- Starts Google Calendar auth flows and handles the callback.
- Serves timetable data from the backend API.

## Local Development

Run the backend and frontend separately:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

## Defaults

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

## Notes

- Update the backend CORS and frontend environment settings if you deploy to different domains.
- The frontend uses Vite routing, so direct page refreshes rely on the host serving `index.html` for unknown routes.
