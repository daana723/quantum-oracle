import React, { useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { cardImages } from "@/assets/cards";
import { majorArcana } from "@/data/tarotCards";
import { cardInterpretations } from "@/data/cardInterpretations";

const CardGallery: React.FC = () => {
  const navigate = useNavigate();

  const handleDownload = useCallback(async (e: React.MouseEvent, cardId: number, cardName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const src = cardImages[cardId];
    if (!src) return;
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cardName.toLowerCase().replace(/\s+/g, "-")}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      window.open(src, "_blank");
    }
  }, []);

  return (
    <>
    <Helmet>
      <title>Major Arcana Gallery — Victorian Quantum Veil</title>
      <meta name="description" content="Browse all 22 Major Arcana tarot cards with original artwork. Explore detailed meanings, symbolism, and cosmic associations for each card." />
      <meta property="og:title" content="Major Arcana Gallery — Victorian Quantum Veil" />
      <meta property="og:description" content="Browse all 22 Major Arcana tarot cards with original artwork and detailed interpretations." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Major Arcana Gallery — Victorian Quantum Veil" />
      <meta name="twitter:description" content="Browse all 22 Major Arcana tarot cards with original artwork and detailed interpretations." />
      <link rel="canonical" href="/gallery" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Major Arcana Gallery",
        description: "Browse all 22 Major Arcana tarot cards with original artwork and detailed interpretations.",
        numberOfItems: 22,
      })}</script>
    </Helmet>
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-gold">All 22 Major Arcana</h1>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gold/60 hover:text-gold border border-gold/30 px-4 py-2 rounded-full"
        >
          ← Back
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
        {majorArcana.map((card) => {
          const interp = cardInterpretations[card.id];
          const slug = interp?.slug;
          return (
            <div key={card.id} className="group flex flex-col items-center gap-2">
              <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-card border border-transparent group-hover:border-gold/30 transition-colors">
                <Link to={slug ? `/cards/${slug}` : "#"}>
                  <img
                    src={cardImages[card.id]}
                    alt={`${card.name} tarot card`}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </Link>
                <button
                  onClick={(e) => handleDownload(e, card.id, card.name)}
                  className="absolute bottom-2 right-2 p-1.5 rounded-full bg-background/80 border border-gold/30 text-gold/70 hover:text-gold hover:bg-background opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title={`Download ${card.name}`}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
              <Link to={slug ? `/cards/${slug}` : "#"}>
                <span className="text-xs text-gold/70 group-hover:text-gold font-body text-center transition-colors">
                  {card.id}. {card.name}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
};

export default CardGallery;
