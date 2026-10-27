import { Temporal } from '@js-temporal/polyfill';

export interface BirthLocation {
  name: string;
  latitude: number;
  longitude: number;
  timeZone: string;
}

/** Reject missing and duplicated DST times rather than silently changing a birth time. */
export function birthTimeToUTC(date: string, hour: number, minute: number, timeZone: string): Date {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23 || !Number.isInteger(minute) || minute < 0 || minute > 59) {
    throw new Error('Enter an hour from 0–23 and minutes from 0–59.');
  }
  const plainDate = Temporal.PlainDate.from(date);
  const instant = Temporal.ZonedDateTime.from({
    year: plainDate.year, month: plainDate.month, day: plainDate.day,
    hour, minute, timeZone,
  }, { disambiguation: 'reject' });
  return new Date(instant.epochMilliseconds);
}

export function ascendantLongitude(date: Date, latitude: number, longitude: number): number {
  if (!Number.isFinite(latitude) || Math.abs(latitude) >= 66 || !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
    throw new Error('Rising calculations are supported between 66° south and 66° north.');
  }
  const jd = date.getTime() / 86400000 + 2440587.5;
  const t = (jd - 2451545) / 36525;
  const radians = Math.PI / 180;
  const sidereal = (280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * t * t - t * t * t / 38710000 + longitude) * radians;
  const obliquity = (23.439291 - 0.0130042 * t) * radians;
  const angle = Math.atan2(-Math.cos(sidereal), Math.sin(sidereal) * Math.cos(obliquity) + Math.tan(latitude * radians) * Math.sin(obliquity)) / radians + 180;
  return ((angle % 360) + 360) % 360;
}