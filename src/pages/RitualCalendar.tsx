import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getRitualEvents, getUpcomingEvents, getEventTypeColor, type RitualEvent } from "@/data/ritualCalendar";
import { elementInfo } from "@/data/cosmicWeather";

const RitualCalendar: React.FC = () => {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [selectedEvent, setSelectedEvent] = useState<RitualEvent | null>(null);

  const events = useMemo(() => getRitualEvents(viewYear), [viewYear]);
  const upcoming = useMemo(() => getUpcomingEvents(3), []);

  // Group events by month
  const byMonth = useMemo(() => {
    const map = new Map<number, RitualEvent[]>();
    events.forEach((e) => {
      const m = e.date.getMonth();
      if (!map.has(m)) map.set(m, []);
      map.get(m)!.push(e);
    });
    return map;
  }, [events]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <>
      <Helmet>
        <title>Ritual Calendar — Victorian Quantum Veil</title>
        <meta name="description" content="Solstices, equinoxes, retrogrades, and sabbats mapped to tarot spreads and themes for your mystical practice." />
      </Helmet>

      <div className="min-h-screen bg-cosmic bg-nebula-overlay bg-vignette relative">
        <header className="relative z-20 px-4 py-4 md:py-6 flex items-center justify-between max-w-4xl mx-auto">
          <Link to="/" className="text-gold/60 hover:text-gold font-body text-sm transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Oracle
          </Link>
          <h1 className="font-display text-lg text-gold-gradient tracking-widest">Ritual Calendar</h1>
          <div className="w-16" />
        </header>

        <main className="relative z-10 max-w-4xl mx-auto px-4 pb-16">
          {/* Upcoming events */}
          <section className="mb-10">
            <h2 className="font-display text-sm text-gold/60 tracking-widest uppercase mb-4">Next on the Wheel</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {upcoming.map((ev, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedEvent(ev)}
                  className={`text-left p-4 rounded-lg border transition-all hover:scale-[1.02] ${getEventTypeColor(ev.type)}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{ev.icon}</span>
                    <span className="font-display text-sm tracking-wider">{ev.name}</span>
                  </div>
                  <p className="font-body text-xs opacity-70">
                    {ev.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Year nav */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button onClick={() => setViewYear((y) => y - 1)} className="text-gold/60 hover:text-gold">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-display text-xl text-gold tracking-wider">{viewYear}</span>
            <button onClick={() => setViewYear((y) => y + 1)} className="text-gold/60 hover:text-gold">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            {monthNames.map((month, mi) => {
              const monthEvents = byMonth.get(mi);
              if (!monthEvents) return null;
              const isPast = viewYear < now.getFullYear() || (viewYear === now.getFullYear() && mi < now.getMonth());

              return (
                <div key={mi} className={`${isPast ? "opacity-50" : ""}`}>
                  <h3 className="font-display text-xs text-gold/50 tracking-widest uppercase mb-3">{month}</h3>
                  <div className="space-y-2">
                    {monthEvents.map((ev, ei) => {
                      const isActive = selectedEvent === ev;
                      return (
                        <button
                          key={ei}
                          onClick={() => setSelectedEvent(isActive ? null : ev)}
                          className={`w-full text-left p-4 rounded-lg border transition-all ${
                            isActive
                              ? "border-gold/50 bg-card/60"
                              : "border-border/30 bg-card/20 hover:border-gold/30 hover:bg-card/40"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{ev.icon}</span>
                              <span className="font-display text-sm text-foreground/90 tracking-wider">{ev.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body ${getEventTypeColor(ev.type)}`}>
                                {ev.type.replace("-", " ")}
                              </span>
                            </div>
                            <span className="font-body text-xs text-muted-foreground">
                              {ev.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>

                          {isActive && (
                            <div className="mt-3 space-y-3 animate-fade-in-up">
                              <p className="font-body text-sm text-foreground/80 leading-relaxed italic">
                                {ev.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <span className="text-xs px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold/80 font-body">
                                  <Sparkles className="w-3 h-3 inline mr-1" />
                                  {ev.suggestedSpread}
                                </span>
                                <span className={`text-xs px-2.5 py-1 rounded-full bg-card/40 border border-gold/10 font-body ${elementInfo[ev.element]?.color || "text-foreground/60"}`}>
                                  {elementInfo[ev.element]?.symbol} {ev.element}
                                </span>
                              </div>
                              <p className="font-body text-xs text-muted-foreground">
                                Theme: {ev.theme}
                              </p>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
};

export default RitualCalendar;
