import React from "react";

interface CardBackProps {
  onClick: () => void;
  isAnimating: boolean;
  size?: "full" | "small";
}

const CardBack: React.FC<CardBackProps> = ({ onClick, isAnimating, size = "full" }) => {
  const isSmall = size === "small";
  const sizeClasses = isSmall
    ? "w-32 h-48 md:w-36 md:h-54"
    : "w-64 h-96 md:w-72 md:h-[432px]";
  return (
    <div
      onClick={!isAnimating ? onClick : undefined}
      className={`
        relative ${sizeClasses} cursor-pointer
        transform transition-all duration-300
        ${!isAnimating ? "hover:scale-105 hover:glow-gold-intense" : ""}
        ${isAnimating ? "animate-wave-collapse" : "animate-gentle-pulse"}
      `}
    >
      {/* Outer frame */}
      <div className="absolute inset-0 rounded-lg border-2 border-gold bg-gradient-to-br from-cosmic-deep via-cosmic-nebula to-cosmic-void glow-gold overflow-hidden">
        {/* Inner decorative border */}
        <div className="absolute inset-2 rounded-md border border-gold/40">
          {/* Art Nouveau pattern overlay */}
          <div className="absolute inset-0 opacity-30">
            {/* Central mandala */}
            <svg
              viewBox="0 0 200 300"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Radial gradient definitions */}
              <defs>
                <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(45, 80%, 55%)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(45, 80%, 55%)" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(45, 60%, 40%)" />
                  <stop offset="50%" stopColor="hsl(45, 90%, 70%)" />
                  <stop offset="100%" stopColor="hsl(45, 60%, 40%)" />
                </linearGradient>
              </defs>

              {/* Central glow */}
              <circle cx="100" cy="150" r="80" fill="url(#goldGlow)" />

              {/* Mandala circles */}
              {[60, 45, 30].map((r, i) => (
                <circle
                  key={i}
                  cx="100"
                  cy="150"
                  r={r}
                  fill="none"
                  stroke="url(#goldShine)"
                  strokeWidth="0.5"
                  className="animate-gentle-pulse"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              ))}

              {/* Floral vine patterns - top */}
              <path
                d="M100 20 Q120 40 100 60 Q80 40 100 20"
                fill="none"
                stroke="hsl(45, 80%, 55%)"
                strokeWidth="1"
                className="animate-vine-sway"
              />
              <path
                d="M60 30 Q80 50 70 70 M140 30 Q120 50 130 70"
                fill="none"
                stroke="hsl(45, 60%, 45%)"
                strokeWidth="0.5"
              />

              {/* Floral vine patterns - bottom */}
              <path
                d="M100 280 Q120 260 100 240 Q80 260 100 280"
                fill="none"
                stroke="hsl(45, 80%, 55%)"
                strokeWidth="1"
                className="animate-vine-sway"
              />
              <path
                d="M60 270 Q80 250 70 230 M140 270 Q120 250 130 230"
                fill="none"
                stroke="hsl(45, 60%, 45%)"
                strokeWidth="0.5"
              />

              {/* Side flourishes */}
              <path
                d="M20 100 Q40 120 30 150 Q40 180 20 200"
                fill="none"
                stroke="hsl(45, 70%, 50%)"
                strokeWidth="0.75"
                className="animate-vine-sway"
                style={{ animationDelay: "1s" }}
              />
              <path
                d="M180 100 Q160 120 170 150 Q160 180 180 200"
                fill="none"
                stroke="hsl(45, 70%, 50%)"
                strokeWidth="0.75"
                className="animate-vine-sway"
                style={{ animationDelay: "1.5s" }}
              />

              {/* Iris/lily motifs at corners */}
              <g className="animate-float" style={{ animationDelay: "0.5s" }}>
                <ellipse cx="40" cy="50" rx="8" ry="15" fill="hsl(280, 40%, 35%)" fillOpacity="0.4" />
                <ellipse cx="40" cy="50" rx="4" ry="10" fill="hsl(45, 80%, 55%)" fillOpacity="0.3" />
              </g>
              <g className="animate-float" style={{ animationDelay: "1s" }}>
                <ellipse cx="160" cy="50" rx="8" ry="15" fill="hsl(160, 45%, 30%)" fillOpacity="0.4" />
                <ellipse cx="160" cy="50" rx="4" ry="10" fill="hsl(45, 80%, 55%)" fillOpacity="0.3" />
              </g>
              <g className="animate-float" style={{ animationDelay: "1.5s" }}>
                <ellipse cx="40" cy="250" rx="8" ry="15" fill="hsl(220, 60%, 35%)" fillOpacity="0.4" />
                <ellipse cx="40" cy="250" rx="4" ry="10" fill="hsl(45, 80%, 55%)" fillOpacity="0.3" />
              </g>
              <g className="animate-float" style={{ animationDelay: "2s" }}>
                <ellipse cx="160" cy="250" rx="8" ry="15" fill="hsl(350, 50%, 30%)" fillOpacity="0.4" />
                <ellipse cx="160" cy="250" rx="4" ry="10" fill="hsl(45, 80%, 55%)" fillOpacity="0.3" />
              </g>
            </svg>
          </div>

          {/* Quantum superposition silhouettes */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-48">
              {/* Overlapping ghostly figures suggesting uncertainty */}
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 animate-superposition-fade"
                  style={{
                    animationDelay: `${i * 1}s`,
                    transform: `translateX(${(i - 1) * 8}px) rotate(${(i - 1) * 3}deg)`,
                  }}
                >
                  <div className="w-full h-full rounded-lg bg-gradient-to-b from-gold/5 via-gold/10 to-gold/5 blur-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Central symbol - quantum eye */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border border-gold/60 flex items-center justify-center animate-gentle-pulse">
                <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gold/50" />
                </div>
              </div>
              {/* Radiating lines */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-6 bg-gradient-to-t from-gold/40 to-transparent"
                  style={{
                    top: "50%",
                    left: "50%",
                    transformOrigin: "center center",
                    transform: `translate(-50%, -100%) rotate(${i * 45}deg) translateY(-24px)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Corner ornaments */}
        {["top-2 left-2", "top-2 right-2 rotate-90", "bottom-2 left-2 -rotate-90", "bottom-2 right-2 rotate-180"].map(
          (pos, i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8`}>
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <path
                  d="M2 2 L12 2 Q8 8 2 12 Z"
                  fill="none"
                  stroke="hsl(45, 80%, 55%)"
                  strokeWidth="1"
                />
                <circle cx="6" cy="6" r="2" fill="hsl(45, 80%, 55%)" fillOpacity="0.5" />
              </svg>
            </div>
          )
        )}
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/40 rounded-full animate-float-particles"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CardBack;
