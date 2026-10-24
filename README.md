# Wayfarer 🌍

A travel tracker that keeps a map of everywhere you've been. Click a spot on the map, log the city with a date and a note, and Wayfarer builds your personal travel history: a list of cities, the countries they add up to, and pins for all of them on the map.

> Based on the **WorldWise** project from Jonas Schmedtmann's *Ultimate React Course*, rebuilt from scratch in **React 19 + TypeScript** on Vite.

<!-- Add a screenshot or GIF here -->
<!-- ![Wayfarer screenshot](./docs/screenshot.png) -->

## Features

- **Interactive map**: click anywhere to start logging a city at that spot
- **Your location**: jump the map to your current position with the browser's Geolocation API
- **Auto-filled city details**: reverse geocoding fills in the city and country from the clicked coordinates
- **Cities and countries lists**: every visited city, plus the unique countries they belong to
- **City pages**: the date of the visit, your notes and a link to read more
- **URL as state**: map position and the selected city live in the URL, so back/forward, refresh and shared links all work
- **Protected app routes**: a fake login guards the `/app` section
- **Code splitting**: pages load lazily, so the first load stays small

## Tech stack

| Area | Tools |
|---|---|
| UI | React 19, TypeScript |
| Build | Vite |
| Routing | React Router (nested routes, URL params, query strings) |
| State | Context API + `useReducer` |
| Map | Leaflet / React Leaflet |
| Styling | CSS Modules |
| Fake API | json-server |
| Code quality | oxlint, Prettier |

## Getting started

**Requirements:** Node.js 22+ and npm.

```bash
git clone https://github.com/DevJamaly/wayfarer.git
cd wayfarer
npm install
```

Run the fake API and the app in **two terminals**:

```bash
npm run server   # json-server on http://localhost:8000
npm run dev      # Vite on http://localhost:5173
```

### Demo login

The login is fake (no real backend auth). Use the demo credentials from `src/contexts/FakeAuthContext.tsx`.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run server` | Start json-server with `data/cities.json` |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run oxlint |

## Project structure

```
wayfarer/
├── data/
│   └── cities.json        # fake API database
├── src/
│   ├── components/        # reusable UI (Map, CityList, Form, Button…)
│   ├── contexts/          # CitiesContext, FakeAuthContext
│   ├── hooks/             # custom hooks (useGeolocation, useUrlPosition…)
│   ├── pages/             # route-level pages
│   ├── types/             # shared TypeScript types
│   └── main.tsx
└── index.html
```

## What I learned

- Structuring an SPA with nested routes, and treating the URL as state
- Managing remote data and loading/error states with Context + `useReducer`
- Pulling reusable logic into custom hooks
- Typing a real React app end to end with strict TypeScript
- Working with browser APIs (Geolocation) and third-party libraries (Leaflet)
- Keeping the bundle small with `lazy()` and `<Suspense>`

## Credits

- Original project design and course by [Jonas Schmedtmann](https://codingheroes.io/)
- Map tiles by [OpenStreetMap](https://www.openstreetmap.org/) contributors
- Reverse geocoding by [BigDataCloud](https://www.bigdatacloud.com/)
