import { beforeEach, describe, expect, it } from "vitest";
import { hasAccess, recordReading, type TrialState } from "./trial";

describe("free public demo", () => {
  beforeEach(() => localStorage.clear());

  it("allows reading after the former five-reading limit", () => {
    const state: TrialState = { startedAt: Date.now(), readingsUsed: 5, unlocked: false };
    expect(hasAccess(state)).toBe(true);
  });

  it("allows reading after the former seven-day trial expires", () => {
    const state: TrialState = {
      startedAt: Date.now() - 8 * 86_400_000,
      readingsUsed: 0,
      unlocked: false,
    };
    expect(hasAccess(state)).toBe(true);
  });

  it("does not consume a reading budget or change saved trial state", () => {
    const state: TrialState = { startedAt: Date.now(), readingsUsed: 5, unlocked: false };
    localStorage.setItem("qv-trial-v1", JSON.stringify(state));
    expect(recordReading(state)).toEqual(state);
    expect(JSON.parse(localStorage.getItem("qv-trial-v1") ?? "null")).toEqual(state);
  });
});