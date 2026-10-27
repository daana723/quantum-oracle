import { describe, expect, it } from 'vitest';
import first from './birthTowns1.json';
import second from './birthTowns2.json';

describe('offline town chunks', () => {
  it('keeps each directory chunk below the default 2 MiB precache limit with bundling headroom', () => {
    for (const chunk of [first, second]) {
      expect(new TextEncoder().encode(JSON.stringify(chunk)).byteLength).toBeLessThan(1.7 * 1024 * 1024);
    }
  });
  it('preserves the full town directory without duplicate ids', () => {
    const rows = [...first, ...second];
    expect(rows).toHaveLength(34189);
    expect(new Set(rows.map(row => row[0])).size).toBe(34189);
    expect(rows.some(row => row[1] === 'London' && row[2] === 'GB' && row[5] === 'Europe/London')).toBe(true);
  });
});