import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Sparkles } from "lucide-react";
import { calculateBirthChart, saveBirthData, loadBirthData, clearBirthData, type BirthChartData } from "@/data/birthChartEngine";
import { majorArcana } from "@/data/tarotCards";
import { elementInfo } from "@/data/cosmicWeather";
import { cardImages } from "@/assets/cards";

const BirthChart: React.FC = () => {
  const stored = useMemo(() => loadBirthData(), []);

  const [birthDate, setBirthDate] = useState(stored?.birthDate?.slice(0, 10) || "");
  const [birthHour, setBirthHour] = useState(stored?.birthHour ?? 12);
  const [chart, setChart] = useState<BirthChartData | null>(stored?.chart || null);

  const handleCalculate = () => {
    if (!birthDate) return;
    const result = calculateBirthChart(birthDate, birthHour);
    setChart(result);
    saveBirthData(birthDate, birthHour, result);
  };

  const handleClear = () => {
    clearBirthData();
    setChart(null);
    setBirthDate("");
    setBirthHour(12);
  };

  return (
    <>
      <Helmet>
        <title>Birth Chart — Victorian Quantum Veil</title>
        <meta name="description" content="Calculate your Sun, Moon, and Rising signs using pure astronomical math. Discover which tarot cards resonate with your natal chart." />
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
            <div className="w-full max-w-sm mx-auto animate-fade-in-up">
              <div className="text-center mb-8">
                <User className="w-8 h-8 text-gold/60 mx-auto mb-3" />
                <h2 className="font-display text-xl text-gold/90 mb-2">Natal Calculation</h2>
                <p className="font-body text-sm text-muted-foreground italic">
                  Enter your birth data to reveal your cosmic signature
                </p>
              </div>

              <div className="space-y-5 bg-card/30 border border-border/40 rounded-xl p-6 backdrop-blur-sm">
                <div>
                  <label className="block font-display text-xs text-gold/70 tracking-wider uppercase mb-2">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 font-body text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block font-display text-xs text-gold/70 tracking-wider uppercase mb-2">
                    Birth Hour (approximate)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={23}
                      value={birthHour}
                      onChange={(e) => setBirthHour(parseInt(e.target.value))}
                      className="flex-1 accent-primary"
                    />
                    <span className="font-body text-sm text-foreground/80 w-14 text-right">
                      {birthHour.toString().padStart(2, "0")}:00
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-1 italic">
                    Birth time refines your Rising sign calculation
                  </p>
                </div>

                <button
                  onClick={handleCalculate}
                  disabled={!birthDate}
                  className="w-full px-6 py-3 rounded-full font-display text-sm tracking-wider border border-gold/50 text-gold bg-transparent hover:bg-gold/10 hover:border-gold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Calculate Chart
                </button>
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

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Sun", data: chart.sunSign },
                  { label: "Moon", data: chart.moonSign },
                  { label: "Rising", data: chart.risingSign },
                ].map(({ label, data }) => {
                  const elData = elementInfo[data.element];
                  return (
                    <div
                      key={label}
                      className="bg-card/40 border border-border/40 rounded-xl p-4 text-center backdrop-blur-sm"
                    >
                      <p className="font-display text-xs text-gold/60 tracking-wider uppercase mb-1">
                        {label}
                      </p>
                      <p className="text-3xl mb-1">{data.symbol}</p>
                      <p className="font-display text-sm text-gold">{data.sign}</p>
                      <p className={`text-xs mt-1 ${elData.color}`}>
                        {elData.symbol} {data.element}
                      </p>
                      <p className="font-body text-xs text-foreground/60 mt-1">{data.degree}°</p>
                    </div>
                  );
                })}
              </div>

              {/* Description */}
              <div className="bg-card/30 border border-border/30 rounded-xl p-5 backdrop-blur-sm">
                <p className="font-body text-sm text-foreground/85 leading-relaxed italic text-center">
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
                <button
                  onClick={handleClear}
                  className="font-display text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider"
                >
                  Recalculate with different data
                </button>
                <Link
                  to="/"
                  className="font-display text-sm text-gold/70 hover:text-gold transition-colors tracking-wider"
                >
                  Draw a Reading →
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default BirthChart;
