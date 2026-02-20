import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { cardImages } from "@/assets/cards";
import { majorArcana } from "@/data/tarotCards";
import { cardInterpretations } from "@/data/cardInterpretations";

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
        {majorArcana.map((card) => {
          const interp = cardInterpretations[card.id];
          const slug = interp?.slug;
          return (
            <Link
              key={card.id}
              to={slug ? `/cards/${slug}` : "#"}
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-card flex items-center justify-center border border-transparent group-hover:border-gold/30 transition-colors">
                <img
                  src={cardImages[card.id]}
                  alt={`${card.name} tarot card`}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
              <span className="text-xs text-gold/70 group-hover:text-gold font-body text-center transition-colors">
                {card.id}. {card.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CardGallery;
