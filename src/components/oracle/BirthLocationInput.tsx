import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { BirthLocation } from '@/lib/birthLocation';

type TownRow = [string, string, string, number, number, string, string, number];
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function BirthLocationInput({ value, onChange }: {
  value: BirthLocation | null;
  onChange: (value: BirthLocation | null) => void;
}) {
  const [query, setQuery] = useState(value?.name ?? '');
  const [towns, setTowns] = useState<TownRow[]>([]);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    import('@/data/birthTowns.json').then(module => setTowns(module.default as TownRow[])).catch(() => setFailed(true));
  }, []);
  const term = normalize(query.trim());
  const matches = !value && term.length >= 2
    ? towns.filter(town => normalize(`${town[1]} ${town[6]} ${town[2]}`).includes(term)).slice(0, 8)
    : [];
  return (
    <div className="space-y-2">
      <label htmlFor="birth-town" className="block font-display text-sm text-primary">Birth town or city</label>
      <input id="birth-town" type="search" autoComplete="off" value={query}
        onChange={event => { setQuery(event.target.value); onChange(null); }}
        className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-lg font-body text-foreground focus:ring-1 focus:ring-primary"
        placeholder="Town, city or country code" />
      {matches.length > 0 && <ul className="border border-border rounded-md divide-y divide-border">
        {matches.map(town => <li key={town[0]}>
          <Button variant="ghost" type="button" className="h-auto w-full justify-start whitespace-normal text-left py-2 font-body text-base"
            onClick={() => {
              const name = `${town[1]}, ${town[2]} · ${town[5]}`;
              setQuery(name);
              onChange({ name, latitude: town[3], longitude: town[4], timeZone: town[5] });
            }}>{town[1]}, {town[2]} · {town[5]}</Button>
        </li>)}
      </ul>}
      {!value && term.length >= 2 && towns.length > 0 && !matches.length &&
        <p className="font-body text-base text-muted-foreground">No match. Choose a nearby city, or enter coordinates below.</p>}
      {failed && <p className="text-base text-muted-foreground">Town list unavailable. Enter coordinates below.</p>}
      {value && <p className="font-body text-base text-muted-foreground">{value.latitude.toFixed(4)}°, {value.longitude.toFixed(4)}° · {value.timeZone}</p>}
    </div>
  );
}