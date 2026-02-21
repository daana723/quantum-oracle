import React from "react";
import { Heart } from "lucide-react";

interface KofiButtonProps {
  className?: string;
}

const KofiButton: React.FC<KofiButtonProps> = ({ className = "" }) => {
  return (
    <a
      href="https://ko-fi.com/YOUR_KOFI_USERNAME"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/50 border border-gold/30 hover:border-gold/50 hover:bg-card/70 transition-all duration-300 font-display text-sm tracking-wider text-gold/80 hover:text-gold group ${className}`}
    
    >
      <Heart className="w-4 h-4 text-rose-400/80 group-hover:text-rose-400 transition-colors" />
      <span>Buy Me a Candle</span>
      <span className="text-gold/40">✧</span>
    </a>
  );
};

export default KofiButton;
