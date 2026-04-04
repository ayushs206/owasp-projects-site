# Frontend

This package contains the React + Vite user interface for the timetable app.

## Scripts

- `npm run dev` - start the Vite dev server.
- `npm run build` - build the app for production.
- `npm run preview` - preview a production build locally.
- `npm run lint` - run ESLint.

## Setup

```bash
npm install
```

If the backend is hosted somewhere other than the default local setup, update the frontend environment variables used by the app.

## Environment

The app reads at least this variable:

- `VITE_SITE_URL` - absolute public URL used for SEO metadata and canonical links.

Depending on your deployment, you may also want to set any API base URL values used by your app code or hosting platform.

## Routes

- `/` - home page with timetable and free-slot entry points.
- `/schedule` - batch schedule view.
- `/freeslots` - compare free slots across batches.
- `/calendar` - Google Calendar callback status page.
- `*` - fallback not found page.

## Tech Stack

- React 19
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- react-helmet-async

## Run

```bash
npm run dev
```

The app runs on `http://localhost:3000` by default.

## Build

```bash
npm run build
```

The production build is generated in the default Vite output directory.
