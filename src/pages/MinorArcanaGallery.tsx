import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { minorArcana, suitLabels, type MinorSuit } from "@/data/minorArcanaCards";
import { minorCardImages } from "@/assets/minor";

const MinorArcanaGallery: React.FC = () => {
  const navigate = useNavigate();

  const handleDownload = useCallback(async (e: React.MouseEvent, cardId: string, cardName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const src = minorCardImages[cardId];
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
      window.open(src, "_blank");
    }
  }, []);

  const suits: MinorSuit[] = ['pentacles', 'cups', 'wands', 'swords'];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-gold">Minor Arcana — Private Collection</h1>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gold/60 hover:text-gold border border-gold/30 px-4 py-2 rounded-full"
        >
          ← Back
        </button>
      </div>

      {suits.map((suit) => {
        const suitCards = minorArcana.filter((c) => c.suit === suit);
        return (
          <section key={suit} className="mb-10">
            <h2 className="font-display text-xl text-gold/80 mb-4 border-b border-gold/20 pb-2">
              {suitLabels[suit]}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {suitCards.map((card) => {
                const imgSrc = minorCardImages[card.id];
                return (
                  <div key={card.id} className="group flex flex-col items-center gap-2">
                    <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-card border border-transparent group-hover:border-gold/30 transition-colors">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={`${card.name} tarot card`}
                          className="w-full h-full object-cover object-center"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gold/30 text-xs font-body">
                          {card.name}
                        </div>
                      )}
                      {imgSrc && (
                        <button
                          onClick={(e) => handleDownload(e, card.id, card.name)}
                          className="absolute bottom-2 right-2 p-1.5 rounded-full bg-background/80 border border-gold/30 text-gold/70 hover:text-gold hover:bg-background opacity-0 group-hover:opacity-100 transition-all duration-200"
                          title={`Download ${card.name}`}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-gold/70 group-hover:text-gold font-body text-center transition-colors">
                      {card.isGroup ? `IV–X` : card.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default MinorArcanaGallery;
