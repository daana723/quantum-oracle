# Unstick on the live site — verified, no code change needed

## What I verified (before this plan)

I loaded the **published** site `https://possibility-pathways.lovable.app/` in a fresh browser and clicked through it:

- The mode toggle shows all three modes: **Reflect · Decide (yes / no) · Unstick (step by step)**.
- Clicking Unstick opens the four-step flow ("What are you stuck on?" → cut options → name the loop → one next action) exactly as in preview.
- The trial banner appears alongside it ("Trial: 5 readings left · 7 days remaining").

I also read the gating code (`src/components/oracle/OracleScreen.tsx`, `src/lib/trial.ts`):

- Only the **Reflect** mode's "Approach the Veil" button is disabled when the trial ends.
- **Decide (yes/no)** and **Unstick** render unconditionally — they are never locked by the trial, matching the copy: "Decide (yes / no) and Unstick stay free, always."

So the live build is current and the lock logic is correct.

## Why it looks missing on your side

Your device is almost certainly showing an **older cached copy**. The app is a PWA: once installed (or once the service worker caches it), the browser can serve the previous build for a while — especially on phones, in Telegram's in-app browser, or if the tab was already open.

## Fix (device-side, no deployment needed)

1. Fully close the app/tab, reopen `https://possibility-pathways.lovable.app/`, then refresh once more (PWA updates apply on the second load).
2. If it still looks old: clear the site's data (browser settings → site data → this site) or, on phone, uninstall the home-screen PWA and re-add it.
3. In Telegram: close and reopen the Mini App.

## Optional hardening (only if you want it)

- I can add an in-app "Update available — refresh" notice whenever a new build ships, so stale caches are less likely to hide new features. Say the word and I'll do it as a follow-up.
