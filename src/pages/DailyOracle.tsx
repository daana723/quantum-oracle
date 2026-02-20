import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Sparkles } from "lucide-react";
import { majorArcana } from "@/data/tarotCards";
import { cardInterpretations } from "@/data/cardInterpretations";
import { getCurrentCosmicWeather, elementInfo, getPlanetaryResonance } from "@/data/cosmicWeather";
import { cardImages } from "@/assets/cards";

/** Deterministic hash from a date string to pick a consistent daily card */
function dateSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const DailyOracle: React.FC = () => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
  const displayDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { card, interpretation, weather } = useMemo(() => {
    const seed = dateSeed(dateStr);
    const card = majorArcana[seed % majorArcana.length];
    const interpretation = cardInterpretations[card.id];
    const weather = getCurrentCosmicWeather();
    return { card, interpretation, weather };
  }, [dateStr]);

  const elData = elementInfo[card.element];
  const resonance = getPlanetaryResonance(card.planetaryRuler, card.element);

  return (
    <>
      <Helmet>
        <title>Daily Oracle — {card.name} | Victorian Quantum Veil</title>
        <meta
          name="description"
          content={`Today's cosmic oracle: ${card.name}. ${weather.moonPhase} — ${weather.cosmicClimate.slice(0, 120)}`}
        />
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
          <Link
            to="/"
            className="flex items-center gap-2 text-gold/60 hover:text-gold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-body text-sm">Oracle</span>
          </Link>
          <h1 className="font-display text-lg md:text-xl text-gold-gradient tracking-widest">
            Daily Oracle
          </h1>
          <div className="w-16" />
        </header>

        {/* Content */}
        <main className="flex-1 flex flex-col items-center px-4 pb-12 relative z-10">
          {/* Date */}
          <div className="flex items-center gap-2 text-muted-foreground mb-6 animate-fade-in-up">
            <Calendar className="w-4 h-4" />
            <span className="font-body text-sm">{displayDate}</span>
          </div>

          {/* Cosmic Weather Briefing */}
          <div
            className="w-full max-w-md mx-auto p-5 rounded-lg bg-card/40 border border-gold/20 backdrop-blur-sm mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            <h2 className="font-display text-sm text-gold/80 tracking-widest uppercase text-center mb-4">
              ✧ Cosmic Weather ✧
            </h2>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{weather.moonPhaseIcon}</span>
              <div className="flex-1">
                <p className="font-display text-sm text-gold">{weather.moonPhase}</p>
                <p className="font-body text-xs text-foreground/70 italic">
                  {weather.moonPhaseDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className={`text-2xl ${elData.color}`}>
                {elementInfo[weather.dominantElement].symbol}
              </span>
              <div className="flex-1">
                <p className="font-display text-sm text-gold capitalize">
                  {weather.dominantElement} Dominant
                </p>
                <p className="font-body text-xs text-foreground/70 italic">
                  {weather.elementDescription}
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent my-4" />

            <p className="font-body text-sm text-foreground/80 text-center italic leading-relaxed">
              "{weather.cosmicClimate}"
            </p>
          </div>

          {/* Daily Card */}
          <div className="w-full max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
            <div className="text-center mb-4">
              <Sparkles className="w-5 h-5 text-gold/60 mx-auto mb-2" />
              <h2 className="font-display text-sm text-gold/70 tracking-widest uppercase">
                Today's Reflection
              </h2>
            </div>

            {/* Card image */}
            <div className="flex justify-center mb-6">
              <div className="relative w-48 md:w-56 aspect-[2/3] rounded-lg overflow-hidden glow-gold-rose border-2 border-gold/30">
                <img
                  src={cardImages[card.id]}
                  alt={card.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Card name & planetary info */}
            <div className="text-center space-y-3 mb-6">
              <Link
                to={`/cards/${interpretation?.slug || ""}`}
                className="font-display text-2xl md:text-3xl text-gold-gradient hover:opacity-80 transition-opacity"
              >
                {card.name}
              </Link>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/30 font-display text-xs text-gold tracking-wider">
                  {card.planetaryRuler}
                </span>
                <span className={`px-3 py-1 rounded-full bg-card/50 border border-gold/20 font-display text-xs tracking-wider flex items-center gap-1.5 ${elData.color}`}>
                  <span className="text-sm">{elData.symbol}</span>
                  <span className="capitalize">{card.element}</span>
                </span>
                {card.zodiacAssociation && (
                  <span className="px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 font-display text-xs text-foreground/70 tracking-wider">
                    {card.zodiacAssociation}
                  </span>
                )}
              </div>

              <p className="font-body text-xs text-foreground/60 italic max-w-sm mx-auto">
                {resonance}
              </p>
            </div>

            {/* Meaning */}
            <div className="bg-card/30 border border-gold/15 rounded-lg p-5 mb-6 space-y-4">
              <p className="font-body text-base text-foreground/90 leading-relaxed">
                {card.meaning}
              </p>

              {interpretation && (
                <p className="font-body text-sm text-foreground/70 leading-relaxed italic">
                  {interpretation.journeyNarrative.slice(0, 300)}…
                </p>
              )}
            </div>

            {/* Reflection prompts */}
            {interpretation && (
              <div className="bg-card/20 border border-gold/10 rounded-lg p-5 mb-6">
                <h3 className="font-display text-sm text-gold/70 tracking-wider uppercase mb-3">
                  Reflect Upon
                </h3>
                <ul className="space-y-2">
                  {interpretation.reflectionPrompts.map((prompt, i) => (
                    <li key={i} className="font-body text-sm text-foreground/80 italic flex gap-2">
                      <span className="text-gold/40 shrink-0">✦</span>
                      {prompt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timing */}
            <p className="text-center font-body text-xs text-gold/40 mb-8">
              {weather.timingSuggestion}
            </p>

            {/* Affirmation */}
            {interpretation && (
              <div className="text-center mb-8">
                <p className="font-body text-sm text-gold/60 italic">
                  "{interpretation.affirmation}"
                </p>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-col items-center gap-3">
              <Link
                to={`/cards/${interpretation?.slug || ""}`}
                className="font-display text-sm text-gold/70 hover:text-gold transition-colors tracking-wider"
              >
                Explore Full Interpretation →
              </Link>
              <Link
                to="/"
                className="font-display text-sm text-foreground/50 hover:text-foreground/80 transition-colors tracking-wider"
              >
                Draw a Personal Reading
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DailyOracle;
