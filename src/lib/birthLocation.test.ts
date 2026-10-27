import { describe, it, expect } from 'vitest';
import { birthTimeToUTC, ascendantLongitude } from './birthLocation';

describe('birth time and location', () => {
  it('includes entered minutes', () => {
    expect(birthTimeToUTC('2000-01-01', 12, 37, 'Etc/UTC').toISOString()).toBe('2000-01-01T12:37:00.000Z');
  });
  it('applies historical summer time for the selected town', () => {
    expect(birthTimeToUTC('1990-07-15', 12, 30, 'Europe/London').toISOString()).toBe('1990-07-15T11:30:00.000Z');
  });
  it('does not use today’s offset for a winter birth', () => {
    expect(birthTimeToUTC('1990-01-15', 12, 30, 'Europe/London').toISOString()).toBe('1990-01-15T12:30:00.000Z');
  });
  it('handles half-hour time zones and date rollover', () => {
    expect(birthTimeToUTC('2000-01-01', 0, 15, 'Asia/Kolkata').toISOString()).toBe('1999-12-31T18:45:00.000Z');
  });
  it('rejects ambiguous clock-change times', () => {
    expect(() => birthTimeToUTC('2026-10-25', 1, 30, 'Europe/London')).toThrow();
  });
  it('uses the eastern horizon at J2000 Greenwich', () => {
    expect(ascendantLongitude(new Date('2000-01-01T12:00:00Z'), 51.4779, 0)).toBeCloseTo(24.27, 0);
  });
  it('changes the ascendant with geographic longitude', () => {
    const date = new Date('2000-01-01T12:00:00Z');
    expect(ascendantLongitude(date, 0, 0)).toBeCloseTo(11.38, 0);
    expect(ascendantLongitude(date, 0, 90)).toBeCloseTo(99.61, 0);
  });
});