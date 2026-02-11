import React, { useRef, useCallback } from "react";
import { Download, Share2 } from "lucide-react";
import type { TarotCard } from "@/data/tarotCards";
import { cardImages } from "@/assets/cards";
import { getCurrentCosmicWeather, elementInfo, getPlanetaryResonance } from "@/data/cosmicWeather";

interface ShareableReadingProps {
  primaryCard: TarotCard;
  echoCards: TarotCard[];
}

const ShareableReading: React.FC<ShareableReadingProps> = ({ primaryCard, echoCards }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImage = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 1080;
    const h = 1920;
    canvas.width = w;
    canvas.height = h;

    // Background gradient - burgundy
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#1a0d10");
    bg.addColorStop(0.5, "#2a1218");
    bg.addColorStop(1, "#1a0d10");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Vignette
    const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.9);
    vignette.addColorStop(0, "transparent");
    vignette.addColorStop(1, "rgba(10, 5, 7, 0.6)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // Decorative top line
    ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.15, 80);
    ctx.lineTo(w * 0.85, 80);
    ctx.stroke();

    // Title
    ctx.fillStyle = "rgba(212, 175, 55, 0.9)";
    ctx.font = "28px serif";
    ctx.textAlign = "center";
    ctx.fillText("✧ Victorian Quantum Veil ✧", w / 2, 130);

    // Load and draw primary card image
    const cardImg = cardImages[primaryCard.id];
    if (cardImg) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = cardImg;
      });

      if (img.complete && img.naturalWidth > 0) {
        const cardW = 400;
        const cardH = 600;
        const cardX = (w - cardW) / 2;
        const cardY = 180;

        // Card glow
        ctx.shadowColor = "rgba(212, 175, 55, 0.4)";
        ctx.shadowBlur = 30;
        ctx.drawImage(img, cardX, cardY, cardW, cardH);
        ctx.shadowBlur = 0;

        // Gold border
        ctx.strokeStyle = "rgba(212, 175, 55, 0.7)";
        ctx.lineWidth = 3;
        ctx.strokeRect(cardX, cardY, cardW, cardH);
      }
    }

    // Card name
    let yPos = 820;
    ctx.fillStyle = "rgba(212, 175, 55, 1)";
    ctx.font = "bold 42px serif";
    ctx.fillText(primaryCard.name, w / 2, yPos);

    // Keywords
    yPos += 45;
    ctx.fillStyle = "rgba(212, 175, 55, 0.6)";
    ctx.font = "italic 20px serif";
    ctx.fillText(primaryCard.keywords.slice(0, 3).join(" · "), w / 2, yPos);

    // Divider
    yPos += 40;
    ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
    ctx.beginPath();
    ctx.moveTo(w * 0.25, yPos);
    ctx.lineTo(w * 0.75, yPos);
    ctx.stroke();
    ctx.fillStyle = "rgba(212, 175, 55, 0.5)";
    ctx.font = "18px serif";
    ctx.fillText("✧", w / 2, yPos + 5);

    // Planetary resonance
    yPos += 45;
    ctx.fillStyle = "rgba(212, 175, 55, 0.8)";
    ctx.font = "22px serif";
    ctx.fillText(`${primaryCard.planetaryRuler}  ·  ${primaryCard.element.charAt(0).toUpperCase() + primaryCard.element.slice(1)}${primaryCard.zodiacAssociation ? `  ·  ${primaryCard.zodiacAssociation}` : ""}`, w / 2, yPos);

    // Resonance text
    yPos += 35;
    const resonance = getPlanetaryResonance(primaryCard.planetaryRuler, primaryCard.element);
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "italic 18px serif";
    wrapText(ctx, resonance, w / 2, yPos, w * 0.75, 24);
    yPos += Math.ceil(resonance.length / 50) * 24 + 20;

    // Meaning
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "20px serif";
    yPos = wrapText(ctx, primaryCard.meaning, w / 2, yPos, w * 0.75, 28);
    yPos += 15;

    // Symbolism
    ctx.fillStyle = "rgba(212, 175, 55, 0.5)";
    ctx.font = "italic 16px serif";
    yPos = wrapText(ctx, primaryCard.symbolism, w / 2, yPos, w * 0.7, 22);

    // Cosmic Weather section
    yPos += 30;
    ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
    ctx.beginPath();
    ctx.moveTo(w * 0.2, yPos);
    ctx.lineTo(w * 0.8, yPos);
    ctx.stroke();

    yPos += 35;
    const weather = getCurrentCosmicWeather();
    ctx.fillStyle = "rgba(212, 175, 55, 0.7)";
    ctx.font = "20px serif";
    ctx.fillText("✧ Cosmic Weather ✧", w / 2, yPos);

    yPos += 35;
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "18px serif";
    ctx.fillText(`${weather.moonPhaseIcon} ${weather.moonPhase}  ·  ${elementInfo[weather.dominantElement].symbol} ${weather.dominantElement.charAt(0).toUpperCase() + weather.dominantElement.slice(1)}`, w / 2, yPos);

    yPos += 30;
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "italic 16px serif";
    wrapText(ctx, `"${weather.cosmicClimate}"`, w / 2, yPos, w * 0.7, 22);

    // Echo cards section
    if (echoCards.length > 0) {
      yPos = h - 250;
      ctx.fillStyle = "rgba(212, 175, 55, 0.5)";
      ctx.font = "16px serif";
      ctx.fillText("Echoes of Parallel Paths", w / 2, yPos);

      yPos += 20;
      // Draw echo card images
      const echoW = 120;
      const echoH = 180;
      const totalEchoWidth = echoCards.length * echoW + (echoCards.length - 1) * 20;
      let echoX = (w - totalEchoWidth) / 2;

      for (const echo of echoCards) {
        const echoImg = cardImages[echo.id];
        if (echoImg) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = echoImg;
          });
          if (img.complete && img.naturalWidth > 0) {
            ctx.globalAlpha = 0.6;
            ctx.drawImage(img, echoX, yPos, echoW, echoH);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
            ctx.lineWidth = 1;
            ctx.strokeRect(echoX, yPos, echoW, echoH);
          }
        }
        // Echo name
        ctx.fillStyle = "rgba(212, 175, 55, 0.5)";
        ctx.font = "12px serif";
        ctx.fillText(echo.keywords[0], echoX + echoW / 2, yPos + echoH + 18);
        echoX += echoW + 20;
      }
    }

    // Footer
    ctx.fillStyle = "rgba(212, 175, 55, 0.3)";
    ctx.font = "14px serif";
    ctx.fillText("victorianquantumveil.app", w / 2, h - 30);

    // Bottom decorative line
    ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
    ctx.beginPath();
    ctx.moveTo(w * 0.15, h - 50);
    ctx.lineTo(w * 0.85, h - 50);
    ctx.stroke();

    // Trigger download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reading-${primaryCard.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [primaryCard, echoCards]);

  const handleDownload = useCallback(async () => {
    await generateImage();
  }, [generateImage]);

  const handleShare = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      await generateImage();
      return;
    }

    // Generate the image first
    await generateImage();

    // Try native Web Share API
    if (navigator.share && navigator.canShare) {
      try {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );
        if (!blob) return;

        const file = new File(
          [blob],
          `reading-${primaryCard.name.toLowerCase().replace(/\s+/g, "-")}.png`,
          { type: "image/png" }
        );

        const shareData = {
          title: `${primaryCard.name} — Victorian Quantum Veil`,
          text: `I drew ${primaryCard.name}. ${primaryCard.keywords.slice(0, 3).join(" · ")}`,
          files: [file],
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      } catch (err) {
        // User cancelled or share failed — fall through to download
        if ((err as Error).name !== "AbortError") {
          console.log("Share failed, falling back to download");
        }
        return;
      }
    }
  }, [generateImage, primaryCard]);

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: "1.8s" }}>
        <button
          onClick={handleShare}
          className="
            mt-2 px-6 md:px-8 py-2.5 md:py-3 rounded-full
            font-display text-sm md:text-base tracking-wider
            border border-gold/40 text-gold/80
            bg-transparent hover:bg-gold/10 hover:border-gold hover:text-gold
            transition-all duration-300 flex items-center gap-2
          "
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button
          onClick={handleDownload}
          className="
            mt-2 px-6 md:px-8 py-2.5 md:py-3 rounded-full
            font-display text-sm md:text-base tracking-wider
            border border-gold/40 text-gold/80
            bg-transparent hover:bg-gold/10 hover:border-gold hover:text-gold
            transition-all duration-300 flex items-center gap-2
          "
        >
          <Download className="w-4 h-4" />
          Save
        </button>
      </div>
    </>
  );
};

// Helper: wrap text centered
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line + (line ? " " : "") + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
}

export default ShareableReading;
