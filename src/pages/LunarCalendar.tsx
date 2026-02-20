import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { getMoonData, type MoonData } from "@/data/moonEngine";
import { getCurrentSeasonalEnergy } from "@/data/elementalSeasonEngine";
import { getDayRuler, getRetrogradeStatuses } from "@/data/planetaryHoursEngine";
import { elementInfo } from "@/data/cosmicWeather";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const LunarCalendar: React.FC = () => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  // Precompute moon data for each day
  const moonDays = useMemo(() => {
    const result: Record<number, MoonData> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      result[d] = getMoonData(new Date(viewYear, viewMonth, d, 12));
    }
    return result;
  }, [viewYear, viewMonth, daysInMonth]);

  const seasonalEnergy = useMemo(() => getCurrentSeasonalEnergy(new Date(viewYear, viewMonth, 15)), [viewYear, viewMonth]);
  const retrogrades = useMemo(() => getRetrogradeStatuses(new Date(viewYear, viewMonth, 15)), [viewYear, viewMonth]);
  const activeRetrogrades = retrogrades.filter((r) => r.isRetrograde);

  const selectedMoon = selectedDay ? moonDays[selectedDay] : null;
  const selectedDayRuler = selectedDay ? getDayRuler(new Date(viewYear, viewMonth, selectedDay)) : null;

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  // Optimal reading days: New Moon and Full Moon
  const optimalDays = useMemo(() => {
    const days: number[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const phase = moonDays[d]?.phase;
      if (phase === "New Moon" || phase === "Full Moon") {
        days.push(d);
      }
    }
    return days;
  }, [moonDays, daysInMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
    setSelectedDay(null);
  };

  return (
    <>
      <Helmet>
        <title>Lunar Calendar — Victorian Quantum Veil</title>
        <meta name="description" content="Monthly moon phase calendar with optimal reading days and planetary hour tracking." />
      </Helmet>

      <div className="min-h-screen bg-cosmic bg-nebula-overlay bg-vignette flex flex-col relative">
        {/* Stars */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(12)].map((_, i) => (
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
          <h1 className="font-display text-lg md:text-xl text-gold-gradient tracking-widest">Lunar Calendar</h1>
          <div className="w-16" />
        </header>

        <main className="flex-1 flex flex-col items-center px-4 pb-12 relative z-10">
          {/* Month navigation */}
          <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
            <button onClick={prevMonth} className="text-gold/60 hover:text-gold transition-colors p-1">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-display text-lg text-gold/90 tracking-wider min-w-[200px] text-center">
              {monthName}
            </h2>
            <button onClick={nextMonth} className="text-gold/60 hover:text-gold transition-colors p-1">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Seasonal energy bar */}
          <div className="w-full max-w-md mx-auto mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="bg-card/30 border border-border/30 rounded-lg p-3 flex items-center gap-3">
              <span className="text-xl">{seasonalEnergy.zodiacSymbol}</span>
              <div className="flex-1">
                <p className="font-display text-xs text-gold/80 tracking-wider">
                  {seasonalEnergy.zodiacSeason} Season · {seasonalEnergy.season}
                </p>
                <p className={`text-xs ${elementInfo[seasonalEnergy.element].color}`}>
                  {elementInfo[seasonalEnergy.element].symbol} {seasonalEnergy.element} · {seasonalEnergy.phase}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-xs text-gold/50">Energy</p>
                <p className="font-display text-sm text-gold">{seasonalEnergy.energyLevel}%</p>
              </div>
            </div>
          </div>

          {/* Retrograde alerts */}
          {activeRetrogrades.length > 0 && (
            <div className="w-full max-w-md mx-auto mb-4 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              {activeRetrogrades.map((r) => (
                <div
                  key={r.planet}
                  className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-2 flex items-center gap-3"
                >
                  <span className="text-lg">{r.symbol}</span>
                  <div className="flex-1">
                    <p className="font-display text-xs text-foreground/80">{r.description}</p>
                    <p className="font-body text-xs text-muted-foreground italic">{r.effect}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Calendar grid */}
          <div className="w-full max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((day) => (
                <div key={day} className="text-center font-display text-xs text-gold/50 tracking-wider py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const moon = moonDays[day];
                const optimal = optimalDays.includes(day);
                const selected = selectedDay === day;
                const todayClass = isToday(day);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(selected ? null : day)}
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all duration-200
                      ${selected ? "bg-primary/20 border border-primary/50" : "bg-card/20 border border-transparent hover:bg-card/40"}
                      ${todayClass ? "ring-1 ring-primary/40" : ""}
                      ${optimal ? "bg-gold/5" : ""}
                    `}
                  >
                    <span className="text-sm leading-none">{moon?.icon}</span>
                    <span className={`font-body text-xs ${todayClass ? "text-gold font-semibold" : "text-foreground/70"}`}>
                      {day}
                    </span>
                    {optimal && (
                      <span className="w-1 h-1 rounded-full bg-gold/60" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                <span className="font-body text-xs text-muted-foreground">Optimal reading day</span>
              </div>
            </div>
          </div>

          {/* Selected day details */}
          {selectedMoon && selectedDay && (
            <div className="w-full max-w-md mx-auto mt-6 animate-fade-in-up">
              <div className="bg-card/40 border border-border/40 rounded-xl p-5 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedMoon.icon}</span>
                  <div>
                    <p className="font-display text-sm text-gold">{selectedMoon.phase}</p>
                    <p className="font-body text-xs text-foreground/60">
                      {selectedMoon.zodiacSymbol} Moon in {selectedMoon.zodiacSign} · {selectedMoon.illumination}% illumination
                    </p>
                  </div>
                </div>

                <p className="font-body text-sm text-foreground/80 italic leading-relaxed">
                  {selectedMoon.poeticDescription}
                </p>

                {selectedMoon.isVoidOfCourse && (
                  <p className="font-body text-xs text-destructive/80 italic">
                    ⚠ Void of Course — consider waiting before beginning new ventures
                  </p>
                )}

                {selectedDayRuler && (
                  <div className="pt-2 border-t border-border/30">
                    <p className="font-body text-xs text-muted-foreground">
                      {selectedDayRuler.symbol} {selectedDayRuler.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seasonal reading suggestion */}
          <div className="w-full max-w-md mx-auto mt-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="bg-card/20 border border-border/20 rounded-xl p-5 text-center">
              <h3 className="font-display text-xs text-gold/60 tracking-widest uppercase mb-2">
                Seasonal Guidance
              </h3>
              <p className="font-body text-sm text-foreground/75 italic leading-relaxed">
                {seasonalEnergy.readingSuggestion}
              </p>
            </div>
          </div>

          {/* Nav */}
          <div className="flex flex-col items-center gap-3 mt-8">
            <Link to="/birth-chart" className="font-display text-sm text-gold/70 hover:text-gold transition-colors tracking-wider">
              Calculate Birth Chart →
            </Link>
            <Link to="/" className="font-display text-sm text-foreground/50 hover:text-foreground/80 transition-colors tracking-wider">
              Draw a Reading
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default LunarCalendar;
