# Phase 1 (build now): Real quantum randomness via ANU QRNG

Only this phase gets built now. Minor Arcana content and the Electron desktop build come after, once quantum draws are confirmed working. No ANU API key for now — register one later if the free endpoint proves flaky.

## What it does

Today every draw uses `Math.random()` (`src/data/tarotCards.ts:291` and `:305`) — a pseudo-random generator. This phase swaps the entropy source only; the selection logic (intent weighting, echo cards, no repeats) is unchanged.

- A backend function fetches raw random bytes from the ANU quantum RNG and returns them. It runs server-side because ANU's endpoint blocks direct browser calls, and so an API key can be added later without touching frontend code.
- The app keeps an in-memory pool of quantum bytes, refilled in the background when it runs low, so a draw never waits on the network.
- Card selection consumes bytes from the pool instead of `Math.random()`.

## Offline / failure behaviour (silent local fallback)

- If the pool is empty and the fetch fails, the draw proceeds immediately using the browser's cryptographic randomness. No error, no blocked reading.
- The entropy source is recorded on the reading (`quantum` or `local`) and shown as a quiet label — a small "⚛ ANU quantum entropy" line, with a neutral "local entropy" variant when it falls back.
- The pool is in-memory only, so it resets on reload; that is intentional — no stale entropy persisted to disk.

## Framing

Copy says the draw is seeded by quantum vacuum fluctuations measured at ANU — true — without implying the cards predict anything, in line with the app's reflective stance.

## Later (not this build)

- **Free ANU API key** — with a key the function uses ANU's faster AWS endpoint; without one it tries the legacy public endpoint (unreliable, rate-limited) and falls back locally. Drop-in when you have it.
- **Full 78-card deck with ND-affirming interpretations** — you'll author the Minor Arcana content; the deck plumbing gets wired then.
- **Electron desktop package** — downloadable Windows/macOS/Linux builds of the same app.
- **Swiss Ephemeris precision with local fallback** — official Astrodienst data online, `astronomy-engine` offline. On your links: `aloistr/swisseph` is the authoritative source and the right basis; `richardplrj/swiss-ephemeris-api` is a third-party AGPL wrapper, useful as reference but not something to depend on as a host. Swiss Ephemeris is dual-licensed (AGPL or paid commercial) — the AGPL route fits a free public PWA.

## Technical notes

- One new backend function for quantum entropy. No secrets needed; an ANU API key is optional and added later.
- Entropy access goes through a single module so every draw in the app shares one source and one fallback rule.
- Selection uses rejection sampling over the byte pool so the weighted intent distribution stays unbiased.
- `selectCardWithIntent` / `selectEchoCards` become async (they may await a pool refill); calling components are updated accordingly.
- Reading history gains an entropy-source field; older saved readings render unchanged.

