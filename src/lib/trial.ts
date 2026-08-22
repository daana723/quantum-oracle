// Client-side trial gate for the oracle.
// PWA-friendly: no backend required. Persisted in localStorage.
// Note: local state is inspectable by users — this is a soft gate, not DRM.

const STORAGE_KEY = "qv-trial-v1";

export const TRIAL_DAYS = 7;
export const TRIAL_READINGS = 5;

/** Unlock codes accepted by the client gate (rotate per campaign). */
const UNLOCK_CODES = ["VEIL-LIFETIME", "CANDLE-2026", "ND-UNSTICK"];

export interface TrialState {
  startedAt: number;
  readingsUsed: number;
  unlocked: boolean;
}

function defaultState(): TrialState {
  return { startedAt: Date.now(), readingsUsed: 0, unlocked: false };
}

export function loadTrial(): TrialState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = defaultState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    const parsed = JSON.parse(raw) as Partial<TrialState>;
    return {
      startedAt: typeof parsed.startedAt === "number" ? parsed.startedAt : Date.now(),
      readingsUsed: typeof parsed.readingsUsed === "number" ? parsed.readingsUsed : 0,
      unlocked: parsed.unlocked === true,
    };
  } catch {
    return defaultState();
  }
}

export function saveTrial(state: TrialState): TrialState {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — trial stays in memory for this session */
  }
  return state;
}

export function daysRemaining(state: TrialState): number {
  const elapsedMs = Date.now() - state.startedAt;
  const left = TRIAL_DAYS - Math.floor(elapsedMs / 86_400_000);
  return Math.max(0, left);
}

export function readingsRemaining(state: TrialState): number {
  return Math.max(0, TRIAL_READINGS - state.readingsUsed);
}

/** Premium access = unlocked, or still inside both the day and reading budget. */
export function hasAccess(state: TrialState): boolean {
  if (state.unlocked) return true;
  return daysRemaining(state) > 0 && readingsRemaining(state) > 0;
}

export function recordReading(state: TrialState): TrialState {
  if (state.unlocked) return state;
  return saveTrial({ ...state, readingsUsed: state.readingsUsed + 1 });
}

export function redeemCode(state: TrialState, code: string): TrialState | null {
  const normalized = code.trim().toUpperCase();
  if (!UNLOCK_CODES.includes(normalized)) return null;
  return saveTrial({ ...state, unlocked: true });
}

export function resetTrial(): TrialState {
  return saveTrial(defaultState());
}
