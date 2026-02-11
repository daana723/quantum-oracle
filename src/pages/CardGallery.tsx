import React from "react";
import { cardImages } from "@/assets/cards";
import { majorArcana } from "@/data/tarotCards";
import { useNavigate } from "react-router-dom";

const CardGallery: React.FC = () => {
  const navigate = useNavigate();

  return (
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
        {majorArcana.map((card) => (
          <div key={card.id} className="flex flex-col items-center gap-2">
            <div className="w-full aspect-[2/3] rounded-lg overflow-hidden">
              <img
                src={cardImages[card.id]}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-gold/70 font-body text-center">
              {card.id}. {card.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardGallery;
