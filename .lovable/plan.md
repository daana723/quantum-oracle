# Precise Astronomy Engine (Swiss-Ephemeris-grade)

## Answers to your three questions

**GitHub** — Not synced. The project's only git remote is Lovable's internal storage repo; nothing has been pushed to `daana723/quantum-oracle`. To sync, connect GitHub from the Lovable UI (top-right GitHub button). That is a one-click action on your side, not something I can do from code.

**Downloadable app** — Correct, there is no download link. The app is a PWA: it installs from the browser via "Add to Home Screen" / "Install app". No `.apk`/`.exe`/`.dmg` was ever generated. Keeping the PWA route for now; say the word if you want a packaged desktop build later.

**Swiss Ephemeris** — Yes, precise calculations are achievable, and better without an external API.

## Approach

Rather than a hosted Swiss Ephemeris API (account, API key, rate limits, network dependency, breaks offline PWA use), use `astronomy-engine` — a pure-JS/TS astronomy library with accuracy within about 1 arcminute of Swiss Ephemeris/JPL for the Sun, Moon and classical planets. It runs fully client-side, matching the project's static, no-API-key architecture, and keeps readings working offline.

## What changes

**Moon engine (`src/data/moonEngine.ts`)**
- Replace the simplified mean-anomaly longitude with true geocentric ecliptic longitude.
- Real illumination fraction and phase angle instead of the cosine approximation.
- Exact next-phase timestamps (search for the true quarter moments) instead of fixed day offsets.
- Real void-of-course: time until the Moon actually changes sign, not a "past 28 degrees" guess.

**Planetary hours (`src/data/planetaryHoursEngine.ts`)**
- Replace the ~40°N sinusoidal sunrise/sunset with true rise/set times for the user's location.
- Keep the existing Chaldean-order hour logic, now fed by real sun times.

**Retrogrades (same file)**
- Delete the hardcoded 2025 windows and synodic guesses.
- Compute apparent retrograde by comparing each planet's ecliptic longitude across a short interval — correct for any date, any year, for Mercury through Saturn.

**Birth chart (`src/data/birthChartEngine.ts`)**
- Precise Sun and Moon sign placement; Rising sign from real local sidereal time using birth coordinates.

**Location**
- Optional browser geolocation with a manual city/coordinate fallback, stored in localStorage. Default stays a neutral fixed location so nothing breaks if permission is denied.

**Disclaimer copy**
- Update the Quantum Astrology disclaimer: positions are now real astronomical calculations; the reflective, non-predictive framing stays.

## Technical notes

- Add `astronomy-engine` (small, dependency-free, MIT).
- Calculations stay synchronous and fast; no backend function, no secrets, no network calls.
- Existing exported function signatures (`getMoonData`, `getPlanetaryHours`, `getRetrogradeStatuses`, `getDayRuler`) are preserved so all widgets keep working; only internals change, plus optional location arguments.
- Where location is unknown, functions fall back to the current default behaviour.
