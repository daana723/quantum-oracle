import { describe, expect, it } from 'vitest';
import { calculateBirthChart, saveBirthData, loadBirthData, clearBirthData } from './birthChartEngine';

const london = { name: 'London', latitude: 51.5085, longitude: -0.1257, timeZone: 'Europe/London' };

describe('location-aware birth chart', () => {
  it('passes minutes and birth-town timezone through to the chart', () => {
    const chart = calculateBirthChart('1990-07-15', 12, 37, london);
    expect(chart.birthUTC).toBe('1990-07-15T11:37:00.000Z');
    expect(chart.calculationMethod).toBe('location');
    expect(chart.sunSign.sign).toBe('Cancer');
    expect(chart.risingSign.sign).toBe('Libra');
  });
  it('saves minute-precise birth inputs and the selected town', () => {
    const chart = calculateBirthChart('1990-07-15', 12, 37, london);
    saveBirthData('1990-07-15', 12, chart, 37, london);
    expect(loadBirthData()).toMatchObject({ birthMinute: 37, location: london, chart: { calculationMethod: 'location' } });
    clearBirthData();
    expect(loadBirthData()).toBeNull();
  });
});