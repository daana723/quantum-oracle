import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ThemeType } from "@/data/tarotCards";

interface IntentSelectorProps {
  selectedTheme: ThemeType | null;
  customIntent: string;
  onThemeSelect: (theme: ThemeType | null) => void;
  onCustomIntentChange: (value: string) => void;
  disabled?: boolean;
}

const themes: { id: ThemeType; label: string; icon: string }[] = [
  { id: "love", label: "Love", icon: "♡" },
  { id: "career", label: "Career", icon: "⚜" },
  { id: "change", label: "Change", icon: "⟳" },
  { id: "self", label: "Self", icon: "✧" },
  { id: "shadow", label: "Shadow", icon: "☽" },
  { id: "clarity", label: "Clarity", icon: "◇" },
];

const IntentSelector: React.FC<IntentSelectorProps> = ({
  selectedTheme,
  customIntent,
  onThemeSelect,
  onCustomIntentChange,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-md space-y-4 md:space-y-6">
      {/* Theme buttons */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {themes.map((theme) => (
          <Button
            key={theme.id}
            variant="outline"
            disabled={disabled}
            onClick={() => {
              if (selectedTheme === theme.id) {
                onThemeSelect(null);
              } else {
                onThemeSelect(theme.id);
                onCustomIntentChange("");
              }
            }}
            className={`
              font-display text-sm md:text-base px-3 md:px-4 py-2
              border-gold/40 bg-transparent
              transition-all duration-300
              ${
                selectedTheme === theme.id
                  ? "border-gold bg-gold/10 text-gold glow-gold"
                  : "text-gold/70 hover:border-gold/60 hover:text-gold hover:bg-gold/5"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <span className="mr-1.5 md:mr-2">{theme.icon}</span>
            {theme.label}
          </Button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 md:gap-4 px-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <span className="text-xs md:text-sm text-gold/50 font-body italic">or</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Custom intent input */}
      <div className="px-4">
        <Input
          type="text"
          placeholder="Whisper your own intention..."
          value={customIntent}
          onChange={(e) => {
            onCustomIntentChange(e.target.value);
            if (e.target.value) {
              onThemeSelect(null);
            }
          }}
          disabled={disabled}
          className={`
            w-full text-center font-body text-base md:text-lg
            bg-transparent border-gold/30 text-foreground
            placeholder:text-gold/40 placeholder:italic
            focus:border-gold focus:ring-gold/30
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />
      </div>
    </div>
  );
};

export default IntentSelector;
