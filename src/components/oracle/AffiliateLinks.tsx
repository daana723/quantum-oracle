import React from "react";
import { ExternalLink } from "lucide-react";

interface AffiliateLinksProps {
  cardName: string;
  className?: string;
}

const AffiliateLinks: React.FC<AffiliateLinksProps> = ({ cardName, className = "" }) => {
  const searchQuery = encodeURIComponent(`${cardName} tarot card deck`);

  const links = [
    {
      label: "Find a Physical Deck",
      url: `https://www.amazon.com/s?k=${searchQuery}&tag=YOUR_AFFILIATE_TAG`,
      icon: "📦",
    },
    {
      label: "Browse on Etsy",
      url: `https://www.etsy.com/search?q=${searchQuery}`,
      icon: "🎨",
    },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="font-display text-xs text-gold/50 tracking-widest uppercase">
        Explore Physical Decks
      </p>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/40 border border-gold/20 hover:border-gold/40 hover:bg-card/60 transition-all duration-200 font-body text-sm text-foreground/70 hover:text-foreground/90"
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
            <ExternalLink className="w-3 h-3 text-gold/40" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default AffiliateLinks;
