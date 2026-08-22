import { useCallback, useEffect, useState } from "react";
import {
  loadTrial,
  recordReading,
  redeemCode,
  hasAccess,
  daysRemaining,
  readingsRemaining,
  type TrialState,
} from "@/lib/trial";

export function useTrial() {
  const [trial, setTrial] = useState<TrialState>(() => loadTrial());

  // Keep multiple tabs / windows in sync
  useEffect(() => {
    const onStorage = () => setTrial(loadTrial());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const consumeReading = useCallback(() => {
    setTrial((prev) => recordReading(prev));
  }, []);

  const unlockWithCode = useCallback((code: string) => {
    let ok = false;
    setTrial((prev) => {
      const next = redeemCode(prev, code);
      ok = next !== null;
      return next ?? prev;
    });
    return ok;
  }, []);

  return {
    trial,
    unlocked: trial.unlocked,
    hasAccess: hasAccess(trial),
    daysLeft: daysRemaining(trial),
    readingsLeft: readingsRemaining(trial),
    consumeReading,
    unlockWithCode,
  };
}
