import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { majorArcana } from "@/data/tarotCards";
import { cardInterpretations, type CardInterpretation } from "@/data/cardInterpretations";
import { cardImages } from "@/assets/cards";
import { elementInfo, getPlanetaryResonance } from "@/data/cosmicWeather";
import AffiliateLinks from "@/components/oracle/AffiliateLinks";

const CardDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const data = useMemo(() => {
    const entry = Object.entries(cardInterpretations).find(([, interp]) => interp.slug === slug);
    if (!entry) return null;
    const cardId = parseInt(entry[0]);
    const card = majorArcana.find((c) => c.id === cardId);
    if (!card) return null;
    return { card, interpretation: entry[1] };
  }, [slug]);

  if (!data) {
    return (
      <div className="min-h-screen bg-cosmic bg-nebula-overlay bg-vignette flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-display text-xl text-gold">Card Not Found</p>
          <Link to="/gallery" className="font-body text-gold/60 hover:text-gold transition-colors">
            ← Return to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const { card, interpretation } = data;
  const elemData = elementInfo[card.element];
  const resonance = getPlanetaryResonance(card.planetaryRuler, card.element);
  const relatedCards = interpretation.relatedCardIds
    .map((id) => {
      const c = majorArcana.find((mc) => mc.id === id);
      const interp = cardInterpretations[id];
      return c && interp ? { card: c, slug: interp.slug } : null;
    })
    .filter(Boolean) as { card: typeof card; slug: string }[];

  // Prev/Next navigation
  const currentIndex = majorArcana.findIndex((c) => c.id === card.id);
  const prevCard = currentIndex > 0 ? majorArcana[currentIndex - 1] : null;
  const nextCard = currentIndex < majorArcana.length - 1 ? majorArcana[currentIndex + 1] : null;
  const prevSlug = prevCard ? cardInterpretations[prevCard.id]?.slug : null;
  const nextSlug = nextCard ? cardInterpretations[nextCard.id]?.slug : null;

  const pageTitle = `${card.name} Tarot Meaning — Victorian Quantum Veil`;
  const pageDescription = `Explore ${card.name}: ${card.keywords.join(", ")}. ${interpretation.uprightDescription.slice(0, 120)}...`;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${card.name} — Tarot Meaning & Interpretation`,
    description: pageDescription,
    author: { "@type": "Organization", name: "Victorian Quantum Veil" },
    articleSection: "Tarot Card Meanings",
    keywords: [...card.keywords, card.planetaryRuler, card.element, card.zodiacAssociation].filter(Boolean).join(", "),
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <link rel="canonical" href={`/cards/${interpretation.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-cosmic bg-nebula-overlay bg-vignette relative">
        {/* Header */}
        <header className="relative z-20 px-4 py-4 md:py-6 flex items-center justify-between max-w-4xl mx-auto">
          <Link to="/gallery" className="text-gold/60 hover:text-gold font-body text-sm transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Gallery
          </Link>
          <Link to="/" className="font-display text-sm text-gold/60 hover:text-gold tracking-widest transition-colors">
            Oracle
          </Link>
        </header>

        <main className="relative z-10 max-w-4xl mx-auto px-4 pb-16">
          {/* Hero section */}
          <section className="flex flex-col md:flex-row gap-8 md:gap-12 items-start mb-12">
            {/* Card image */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="aspect-[2/3] rounded-lg overflow-hidden glow-gold-rose">
                <img
                  src={cardImages[card.id]}
                  alt={`${card.name} tarot card`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Card info */}
            <div className="flex-1 space-y-6">
              <div>
                <p className="font-body text-sm text-gold/50 tracking-wider uppercase mb-1">
                  Major Arcana · {card.id}
                </p>
                <h1 className="font-display text-3xl md:text-4xl text-gold-gradient tracking-wide">
                  {card.name}
                </h1>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2">
                {card.keywords.map((kw) => (
                  <span key={kw} className="px-3 py-1 rounded-full bg-card/60 border border-gold/20 font-body text-sm text-foreground/80 capitalize">
                    {kw}
                  </span>
                ))}
              </div>

              {/* Planetary & Elemental badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 font-display text-xs text-gold tracking-wider">
                  ☿ {card.planetaryRuler}
                </span>
                <span className={`px-3 py-1.5 rounded-full bg-card/50 border border-gold/20 font-display text-xs tracking-wider flex items-center gap-1.5 ${elemData.color}`}>
                  <span className="text-sm">{elemData.symbol}</span>
                  <span className="capitalize">{card.element}</span>
                </span>
                {card.zodiacAssociation && (
                  <span className="px-3 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 font-display text-xs text-foreground/70 tracking-wider">
                    {card.zodiacAssociation}
                  </span>
                )}
              </div>

              {/* Resonance */}
              <p className="font-body text-sm text-foreground/70 italic leading-relaxed">
                {resonance}
              </p>
            </div>
          </section>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-12" />

          {/* Upright Meaning */}
          <section className="mb-12 space-y-4">
            <h2 className="font-display text-xl md:text-2xl text-gold/90 tracking-wider">
              {interpretation.uprightTitle}
            </h2>
            <p className="font-body text-base md:text-lg text-foreground/85 leading-relaxed">
              {interpretation.uprightDescription}
            </p>
          </section>

          {/* Shadow Meaning */}
          <section className="mb-12 space-y-4">
            <h2 className="font-display text-xl md:text-2xl text-foreground/70 tracking-wider">
              Shadow: {interpretation.shadowTitle}
            </h2>
            <p className="font-body text-base md:text-lg text-foreground/70 leading-relaxed">
              {interpretation.shadowDescription}
            </p>
          </section>

          {/* Journey Narrative */}
          <section className="mb-12 p-6 md:p-8 rounded-lg bg-card/40 border border-gold/20">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-gold/60" />
              <h2 className="font-display text-lg text-gold/80 tracking-wider">
                The Deeper Journey
              </h2>
            </div>
            <p className="font-body text-base text-foreground/80 leading-relaxed italic">
              {interpretation.journeyNarrative}
            </p>
          </section>

          {/* Symbolism */}
          <section className="mb-12 space-y-4">
            <h2 className="font-display text-lg text-gold/80 tracking-wider">Symbolism</h2>
            <p className="font-body text-base text-foreground/75 leading-relaxed">
              {card.symbolism}
            </p>
          </section>

          {/* Reflection Prompts */}
          <section className="mb-12 space-y-4">
            <h2 className="font-display text-lg text-gold/80 tracking-wider">Questions for Reflection</h2>
            <ul className="space-y-3">
              {interpretation.reflectionPrompts.map((prompt, i) => (
                <li key={i} className="font-body text-base text-foreground/80 flex gap-3">
                  <span className="text-gold/40 flex-shrink-0">✦</span>
                  <span className="italic">{prompt}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Affirmation */}
          <section className="mb-12 text-center py-8">
            <p className="font-body text-xs text-gold/50 uppercase tracking-widest mb-2">Affirmation</p>
            <p className="font-display text-lg md:text-xl text-gold/90 italic">
              "{interpretation.affirmation}"
            </p>
          </section>

          {/* Affiliate Links */}
          <AffiliateLinks cardName={card.name} className="mb-12" />

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-12" />

          {/* Related Cards */}
          <section className="mb-12">
            <h2 className="font-display text-lg text-gold/80 tracking-wider mb-6">Related Cards</h2>
            <div className="grid grid-cols-3 gap-4">
              {relatedCards.map(({ card: rc, slug: rs }) => (
                <Link
                  key={rc.id}
                  to={`/cards/${rs}`}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-card border border-gold/10 group-hover:border-gold/40 transition-colors">
                    <img
                      src={cardImages[rc.id]}
                      alt={rc.name}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                  <span className="font-body text-xs text-gold/60 group-hover:text-gold transition-colors text-center">
                    {rc.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Prev / Next Navigation */}
          <nav className="flex items-center justify-between" aria-label="Card navigation">
            {prevSlug ? (
              <Link
                to={`/cards/${prevSlug}`}
                className="flex items-center gap-2 text-gold/60 hover:text-gold font-body text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {prevCard?.name}
              </Link>
            ) : (
              <div />
            )}
            {nextSlug ? (
              <Link
                to={`/cards/${nextSlug}`}
                className="flex items-center gap-2 text-gold/60 hover:text-gold font-body text-sm transition-colors"
              >
                {nextCard?.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </main>
      </div>
    </>
  );
};

export default CardDetail;
