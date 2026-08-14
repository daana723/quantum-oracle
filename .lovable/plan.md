# Roadmap: Quantum Randomness, Full Deck, Real Ephemeris

Three pieces, built in this order. Desktop package build is parked for later (noted at the end).

---

## Phase 1 — Real quantum randomness (ANU QRNG) — build now

Today every draw uses `Math.random()` (`src/data/tarotCards.ts:291` and `:305`), which is a pseudo-random generator. Phase 1 replaces the entropy source, not the selection logic.

**How it works**
- A backend function fetches raw random bytes from the ANU quantum RNG and returns them to the app. It runs server-side because ANU's endpoint does not allow direct browser calls, and because the newer ANU API requires a key that must not sit in frontend code.
- The app keeps a small pool of quantum bytes in memory, topped up in the background, so a draw never waits on the network.
- Selection stays exactly as it is (intent weighting, echo cards, no repeats) — it just consumes quantum bytes instead of `Math.random()`.

**Offline / failure behaviour (as chosen: silent local fallback)**
- If the pool is empty and the fetch fails, the draw proceeds instantly using the browser's cryptographic randomness. No error, no blocked reading.
- The entropy source is recorded on the reading (`quantum` or `local`) and shown as a small, quiet label — a subtle "⚛ ANU quantum entropy" line on the reading, nothing alarming when it falls back.

**Honest framing**
- Copy will say the draw is seeded by quantum vacuum fluctuations measured at ANU — true — without implying the cards predict anything, in line with the app's reflective stance.

**Setup note**
- ANU's public no-key endpoint is unreliable and heavily rate-limited. If you want dependable quantum draws, a free ANU API key is worth registering; the plan supports both — with a key it uses the fast AWS endpoint, without one it tries the legacy public endpoint and falls back locally.

---

## Phase 2 — Full 78-card Rider-Waite-Smith deck with ND-affirming interpretations

The 22 Major Arcana already have full interpretations and artwork. The 56 Minor Arcana currently exist only as a gallery listing (`src/data/minorArcanaCards.ts`) with no reading text and are not drawable.

- Write full interpretations for all 56 Minors: upright and reversed meaning, element, keywords, and a reflective prompt, matching the Majors' structure.
- Add ND-affirming framing to every one of the 78 cards: language that treats neurodivergent traits as differences rather than deficits — no "you must focus harder", no shame framing around rest, routine, sensory needs, or executive function. Concrete, low-demand reflection prompts instead of vague advice.
- Make the whole 78-card deck drawable: single draws, all existing spreads, and intent weighting extended to Minor suits (Cups/water, Wands/fire, Swords/air, Pentacles/earth).
- Deck-scope toggle so you can still read Majors-only if you want.

Confirm before this phase: "ND" reads as neurodivergent-affirming in this plan. Say the word if you meant something else and I will adjust the copy direction.

---

## Phase 3 — Swiss Ephemeris precision, with local fallback (as chosen)

- Online: a backend function serves true Swiss Ephemeris positions, so planetary longitudes, retrogrades, sun rise/set and birth-chart placements are exact.
- Offline: the app falls back to `astronomy-engine`, a pure-JS library accurate to about an arcminute, so readings keep working with no network.
- Replaces the current approximations: the simplified moon longitude in `src/data/moonEngine.ts`, the ~40°N sunrise/sunset guess and hardcoded 2025 retrograde windows in `src/data/planetaryHoursEngine.ts`, and the birth-chart rising sign.
- Optional geolocation with manual coordinate entry for accurate planetary hours.
- Disclaimer copy updated to say positions are real astronomical calculations, keeping the non-predictive framing.

On your two links: `aloistr/swisseph` is the authoritative C source from Astrodienst and is the right basis. `richardplrj/swiss-ephemeris-api` is a Python/FastAPI wrapper over it — useful as a reference, but AGPL-3.0 and a third-party host, so the plan uses the official Swiss Ephemeris data path in our own backend function rather than depending on someone else's server. Note that Swiss Ephemeris itself is dual-licensed: free under AGPL, otherwise a paid commercial licence from Astrodienst. Since this app is a free public PWA, the AGPL route fits — worth knowing before we ship it.

---

## Later — desktop package

Noted for a future round: an Electron build producing downloadable Windows/macOS/Linux packages of the same app, reusing the offline-capable local engines from Phases 1 and 3. Not part of this work.

## Technical notes

- New backend functions: one for quantum entropy, one for ephemeris. No secrets required for the fallback paths; an ANU API key is optional and requested only if you want it.
- Entropy access goes through a single module so every random draw in the app shares one source and one fallback rule.
- Existing exports (`selectCardWithIntent`, `getMoonData`, `getPlanetaryHours`, `getRetrogradeStatuses`) keep their signatures; card selection becomes async where it fetches.
- Reading history gains an entropy-source field; older saved readings render unchanged.
