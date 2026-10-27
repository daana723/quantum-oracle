import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Sparkles } from "lucide-react";
import { calculateBirthChart, saveBirthData, loadBirthData, clearBirthData, type BirthChartData } from "@/data/birthChartEngine";
import { majorArcana } from "@/data/tarotCards";
import { elementInfo } from "@/data/cosmicWeather";
import { cardImages } from "@/assets/cards";
import { Button } from '@/components/ui/button';
import BirthLocationInput from '@/components/oracle/BirthLocationInput';
import type { BirthLocation } from '@/lib/birthLocation';

const BirthChart: React.FC = () => {
  const stored = useMemo(() => loadBirthData(), []);

  const [birthDate, setBirthDate] = useState(stored?.birthDate?.slice(0, 10) || "");
  const [birthHour, setBirthHour] = useState(stored?.birthHour ?? 12);
  const [birthMinute, setBirthMinute] = useState(stored?.birthMinute ?? 0);
  const [location, setLocation] = useState<BirthLocation | null>(stored?.location ?? null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [error, setError] = useState('');
  const [chart, setChart] = useState<BirthChartData | null>(stored?.chart.calculationMethod === 'location' ? stored.chart : null);

  const handleCalculate = () => {
    setError('');
    if (!birthDate || !location) return;
    try {
      const result = calculateBirthChart(birthDate, birthHour, birthMinute, location);
      saveBirthData(birthDate, birthHour, result, birthMinute, location);
      setChart(result);
    } catch (cause) {
      setError(cause instanceof RangeError
        ? 'This local birth time is invalid or falls in a clock-change hour. Check the date and time; use coordinates with an explicit UTC offset (for example +01:00) if the hour repeats.'
        : cause instanceof Error ? cause.message : 'Please check your birth details.');
    }
  };

  const handleClear = () => {
    clearBirthData();
    setChart(null);
    setBirthDate("");
    setBirthHour(12);
    setBirthMinute(0);
    setLocation(null);
    setLatitude('');
    setLongitude('');
    setTimeZone('');
    setError('');
  };

  return (
    <>
      <Helmet>
        <title>Birth Chart — Victorian Quantum Veil</title>
        <meta name="description" content="Calculate your Sun, Moon, and Rising signs using pure astronomical math. Discover which tarot cards resonate with your natal chart." />
        <meta property="og:title" content="Birth Chart Calculator — Victorian Quantum Veil" />
        <meta property="og:description" content="Calculate your Sun, Moon, and Rising signs. Discover which tarot cards resonate with your natal chart." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Birth Chart Calculator — Victorian Quantum Veil" />
        <meta name="twitter:description" content="Calculate your cosmic triad and discover your resonant tarot cards." />
        <link rel="canonical" href="/birth-chart" />
      </Helmet>

      <div className="min-h-screen bg-cosmic bg-nebula-overlay bg-vignette flex flex-col relative">
        {/* Stars */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-gold/40 rounded-full animate-twinkle"
              style={{
                left: `${10 + (i * 17) % 80}%`,
                top: `${5 + (i * 23) % 90}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + (i % 3)}s`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <header className="relative z-20 px-4 py-4 md:py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gold/60 hover:text-gold transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-body text-sm">Oracle</span>
          </Link>
          <h1 className="font-display text-lg md:text-xl text-gold-gradient tracking-widest">Birth Chart</h1>
          <div className="w-16" />
        </header>

        <main className="flex-1 flex flex-col items-center px-4 pb-12 relative z-10">
          {/* Input form */}
          {!chart && (
            <div className="w-full max-w-md mx-auto animate-fade-in-up">
              <div className="text-center mb-8">
                <User className="w-8 h-8 text-gold/60 mx-auto mb-3" />
                <h2 className="font-display text-xl text-gold/90 mb-2">Natal Calculation</h2>
                <p className="font-body text-lg text-muted-foreground italic">
                  Your birth date, local time and birthplace
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="birth-date" className="block font-display text-sm text-primary mb-2">
                    Birth Date
                  </label>
                  <input
                    id="birth-date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-input border border-border rounded-md px-4 py-2.5 font-body text-lg text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="birth-hour" className="block font-display text-sm text-primary mb-2">
                    Hour (0–23)
                  </label>
                  <input
                    id="birth-hour"
                    type="number"
                    min={0}
                    max={23}
                    value={birthHour}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 0 && val <= 23) setBirthHour(val);
                      else if (e.target.value === "") setBirthHour(0);
                    }}
                    className="w-full bg-input border border-border rounded-md px-4 py-2.5 font-body text-lg text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label htmlFor="birth-minute" className="block font-display text-sm text-primary mb-2">Minutes (0–59)</label>
                  <input id="birth-minute" type="number" min={0} max={59} step={1} value={birthMinute}
                    onChange={event => {
                      const value = Number(event.target.value);
                      if (Number.isInteger(value) && value >= 0 && value <= 59) setBirthMinute(value);
                    }}
                    className="w-full bg-input border border-border rounded-md px-4 py-2.5 font-body text-lg text-foreground focus:ring-1 focus:ring-primary" />
                </div>
                </div>
                <BirthLocationInput value={location} onChange={setLocation} />
                <details className="font-body text-lg">
                  <summary className="cursor-pointer text-primary">Enter coordinates instead</summary>
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-base">Latitude
                        <input aria-label="Latitude" type="number" min={-65.99} max={65.99} step="any" value={latitude} onChange={e => setLatitude(e.target.value)} className="w-full mt-1 bg-input border border-border rounded-md px-3 py-2" />
                      </label>
                      <label className="text-base">Longitude
                        <input aria-label="Longitude" type="number" min={-180} max={180} step="any" value={longitude} onChange={e => setLongitude(e.target.value)} className="w-full mt-1 bg-input border border-border rounded-md px-3 py-2" />
                      </label>
                    </div>
                    <label className="block text-base">Birth time zone or UTC offset
                      <input aria-label="Birth time zone or UTC offset" value={timeZone} onChange={e => setTimeZone(e.target.value)} placeholder="Europe/London or +01:00" className="w-full mt-1 bg-input border border-border rounded-md px-3 py-2" />
                    </label>
                    <Button type="button" variant="outline" disabled={!latitude || !longitude || !timeZone} onClick={() => {
                      const lat = Number(latitude), lon = Number(longitude);
                      if (!Number.isFinite(lat) || Math.abs(lat) >= 66 || !Number.isFinite(lon) || Math.abs(lon) > 180) {
                        setError('Use latitude between 66° south and north, and longitude between −180° and 180°.'); return;
                      }
                      setLocation({ name: 'Custom birthplace', latitude: lat, longitude: lon, timeZone: timeZone.trim() }); setError('');
                    }}>Use these coordinates</Button>
                  </div>
                </details>
                <p className="font-body text-base text-muted-foreground leading-relaxed">Use the local time recorded at birth. Town time zones include historical daylight saving. If your time is unknown, noon is only an estimate and Rising may be wrong.</p>
                {error && <p role="alert" className="font-body text-lg text-primary">{error}</p>}

                <Button
                  onClick={handleCalculate}
                  disabled={!birthDate || !location}
                  className="w-full font-display"
                >
                  Calculate Chart
                </Button>
              </div>
            </div>
          )}

          {/* Chart display */}
          {chart && (
            <div className="w-full max-w-lg mx-auto animate-fade-in-up space-y-6">
              {/* Big Three */}
              <div className="text-center mb-2">
                <Sparkles className="w-6 h-6 text-gold/60 mx-auto mb-2" />
                <h2 className="font-display text-sm text-gold/70 tracking-widest uppercase">
                  Your Cosmic Triad
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { label: "Sun", data: chart.sunSign },
                  { label: "Moon", data: chart.moonSign },
                  { label: "Rising", data: chart.risingSign },
                ].map(({ label, data }) => {
                  const elData = elementInfo[data.element];
                  return (
                    <div
                      key={label}
                      className="bg-card/70 border border-border rounded-lg px-2 py-4 sm:p-4 text-center backdrop-blur-sm min-w-0"
                    >
                      <p className="font-display text-xs text-gold/60 tracking-wider uppercase mb-1">
                        {label}
                      </p>
                      <p className="text-3xl mb-1">{data.symbol}</p>
                      <p className="font-display text-sm sm:text-base text-gold break-words">{data.sign}</p>
                      <p className={`text-xs mt-1 ${elData.color}`}>
                        {elData.symbol} {data.element}
                      </p>
                      <p className="font-body text-base text-muted-foreground mt-1">{data.degree}°</p>
                    </div>
                  );
                })}
              </div>

              {/* Description */}
              <div className="py-3">
                <p className="reading-prose italic text-center">
                  {chart.description}
                </p>
              </div>

              {/* Element Balance */}
              <div className="bg-card/30 border border-border/30 rounded-xl p-5 backdrop-blur-sm">
                <h3 className="font-display text-xs text-gold/70 tracking-widest uppercase text-center mb-4">
                  Elemental Balance
                </h3>
                <div className="space-y-2">
                  {(["fire", "water", "air", "earth"] as const).map((el) => {
                    const val = chart.elementBalance[el] || 0;
                    const max = 6;
                    const pct = Math.round((val / max) * 100);
                    const info = elementInfo[el];
                    return (
                      <div key={el} className="flex items-center gap-3">
                        <span className={`text-lg w-6 ${info.color}`}>{info.symbol}</span>
                        <span className="font-display text-xs capitalize w-12 text-foreground/70">{el}</span>
                        <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary/60 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personal Cards */}
              {chart.personalCards.length > 0 && (
                <div className="bg-card/30 border border-border/30 rounded-xl p-5 backdrop-blur-sm">
                  <h3 className="font-display text-xs text-gold/70 tracking-widest uppercase text-center mb-4">
                    Your Resonant Cards
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {chart.personalCards.map((cardId) => {
                      const card = majorArcana.find((c) => c.id === cardId);
                      if (!card) return null;
                      return (
                        <Link
                          key={cardId}
                          to={`/cards/${card.name.toLowerCase().replace(/\s+/g, "-").replace("the-", "")}`}
                          className="flex flex-col items-center gap-1 group"
                        >
                          <div className="w-16 h-24 rounded overflow-hidden border border-gold/20 group-hover:border-gold/50 transition-colors">
                            <img
                              src={cardImages[cardId]}
                              alt={card.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-body text-xs text-gold/60 group-hover:text-gold transition-colors">
                            {card.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <p className="font-body text-xs text-muted-foreground text-center mt-3 italic">
                    These cards carry special significance in your readings
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col items-center gap-3">
                <Button variant="ghost"
                  onClick={handleClear}
                  className="font-body text-lg text-muted-foreground whitespace-normal h-auto"
                >
                  Recalculate with different data
                </Button>
                <Link
                  to="/"
                  className="font-display text-sm text-gold/70 hover:text-gold transition-colors tracking-wider"
                >
                  Draw a Reading →
                </Link>
              </div>
            </div>
          )}
          <div className="w-full max-w-lg mt-8 space-y-3 text-center font-body text-base text-muted-foreground leading-relaxed">
            {chart && <p>{location?.name} · {String(birthHour).padStart(2, '0')}:{String(birthMinute).padStart(2, '0')} local time<br />{chart.birthUTC?.replace('T', ' ').replace('.000Z', ' UTC')}</p>}
            <p>Sun and Moon use simplified astronomical formulas, not Swiss Ephemeris. Rising uses your birthplace and local birth time. Degrees and signs close to a boundary remain approximate; this chart is for reflection, not prediction.</p>
            <p className="text-sm">Town data: <a href="https://www.geonames.org/" target="_blank" rel="noreferrer" className="underline text-primary">GeoNames</a> · CC BY 4.0. Towns and cities over 15,000 residents; smaller places can use coordinates.</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default BirthChart;
