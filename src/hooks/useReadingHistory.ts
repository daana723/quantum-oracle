import { useState, useEffect, useCallback } from "react";
import type { TarotCard } from "@/data/tarotCards";

export interface Reading {
  id: string;
  timestamp: number;
  intent: string | null;
  customIntent: string | null;
  primaryCard: TarotCard;
  echoCards: TarotCard[];
  spreadType?: "single" | "past-present-future";
}

const STORAGE_KEY = "victorian-quantum-veil-readings";

export function useReadingHistory() {
  const [readings, setReadings] = useState<Reading[]>([]);

  // Load readings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setReadings(parsed);
      }
    } catch (error) {
      console.error("Failed to load readings from localStorage:", error);
    }
  }, []);

  // Save a new reading
  const saveReading = useCallback(
    (
      intent: string | null,
      customIntent: string | null,
      primaryCard: TarotCard,
      echoCards: TarotCard[],
      spreadType: "single" | "past-present-future" = "single"
    ) => {
      const newReading: Reading = {
        id: `reading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        intent,
        customIntent,
        primaryCard,
        echoCards,
        spreadType,
      };

      const updatedReadings = [newReading, ...readings].slice(0, 50); // Keep last 50 readings
      setReadings(updatedReadings);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReadings));
      } catch (error) {
        console.error("Failed to save reading to localStorage:", error);
      }

      return newReading;
    },
    [readings]
  );

  // Delete a reading
  const deleteReading = useCallback(
    (id: string) => {
      const updatedReadings = readings.filter((r) => r.id !== id);
      setReadings(updatedReadings);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReadings));
      } catch (error) {
        console.error("Failed to delete reading from localStorage:", error);
      }
    },
    [readings]
  );

  // Clear all readings
  const clearAllReadings = useCallback(() => {
    setReadings([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear readings from localStorage:", error);
    }
  }, []);

  return {
    readings,
    saveReading,
    deleteReading,
    clearAllReadings,
  };
}
