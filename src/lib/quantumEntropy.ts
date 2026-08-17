// Quantum entropy pool — sources random bytes from the ANU QRNG (quantum vacuum
// fluctuations) via a backend function, cached in memory. Falls back silently to
// the browser's cryptographic RNG when the pool is empty and the fetch fails.

import { supabase } from "@/integrations/supabase/client";

export type EntropySource = "quantum" | "local";

const POOL_TARGET = 512; // bytes fetched per refill
const REFILL_THRESHOLD = 64; // refill when fewer bytes than this remain

let pool: number[] = [];
let refilling: Promise<void> | null = null;
let lastSource: EntropySource = "local";

/** Entropy source used for the most recently consumed random value. */
export function getLastEntropySource(): EntropySource {
  return lastSource;
}

async function refill(): Promise<void> {
  if (refilling) return refilling;

  refilling = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke("quantum-entropy", {
        body: { length: POOL_TARGET },
      });
      if (error) return;
      const bytes = (data as { data?: unknown })?.data;
      if (Array.isArray(bytes) && bytes.length > 0) {
        pool = pool.concat(
          bytes.filter((b): b is number => typeof b === "number" && b >= 0 && b <= 255),
        );
      }
    } catch {
      // Silent — local fallback covers it.
    } finally {
      refilling = null;
    }
  })();

  return refilling;
}

/** Warm the pool in the background. Safe to call repeatedly. */
export function primeEntropyPool(): void {
  if (pool.length < REFILL_THRESHOLD) void refill();
}

function localBytes(count: number): number[] {
  const buf = new Uint8Array(count);
  crypto.getRandomValues(buf);
  return Array.from(buf);
}

/** Take `count` bytes, preferring quantum entropy. Never throws, never blocks a draw. */
export async function takeBytes(count: number): Promise<{ bytes: number[]; source: EntropySource }> {
  if (pool.length < count) {
    await refill();
  }

  if (pool.length >= count) {
    const bytes = pool.splice(0, count);
    lastSource = "quantum";
    if (pool.length < REFILL_THRESHOLD) void refill();
    return { bytes, source: "quantum" };
  }

  lastSource = "local";
  return { bytes: localBytes(count), source: "local" };
}

/**
 * Unbiased integer in [0, max) using rejection sampling over the byte pool.
 * Falls back to local entropy transparently.
 */
export async function randomInt(max: number): Promise<number> {
  if (max <= 1) return 0;

  // Number of bytes needed to cover `max`.
  const byteCount = Math.ceil(Math.log2(max) / 8) || 1;
  const range = Math.pow(256, byteCount);
  const limit = range - (range % max); // largest unbiased multiple of max

  for (let attempt = 0; attempt < 16; attempt++) {
    const { bytes } = await takeBytes(byteCount);
    let value = 0;
    for (const b of bytes) value = value * 256 + b;
    if (value < limit) return value % max;
  }

  // Extremely unlikely — accept a negligibly biased value rather than loop forever.
  const { bytes } = await takeBytes(byteCount);
  let value = 0;
  for (const b of bytes) value = value * 256 + b;
  return value % max;
}

/** Unbiased float in [0, 1). */
export async function randomFloat(): Promise<number> {
  const n = await randomInt(0x1000000); // 24 bits of precision
  return n / 0x1000000;
}

/** True once quantum bytes are buffered and ready for the next draw. */
export function isQuantumPoolReady(): boolean {
  return pool.length > 0;
}
