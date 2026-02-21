import jsPDF from "jspdf";
import type { TarotCard } from "@/data/tarotCards";
import { getCurrentCosmicWeather, elementInfo, getPlanetaryResonance } from "@/data/cosmicWeather";
import { cardInterpretations } from "@/data/cardInterpretations";

export async function generateReadingPdf(
  primaryCard: TarotCard,
  echoCards: TarotCard[]
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const weather = getCurrentCosmicWeather();
  const resonance = getPlanetaryResonance(primaryCard.planetaryRuler, primaryCard.element);
  const interp = cardInterpretations[primaryCard.id];

  // Colors
  const gold: [number, number, number] = [212, 175, 55];
  const cream: [number, number, number] = [240, 230, 210];
  const dark: [number, number, number] = [40, 20, 25];
  const muted: [number, number, number] = [160, 140, 120];

  // Background
  doc.setFillColor(26, 13, 16);
  doc.rect(0, 0, w, 297, "F");

  // Header line
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.3);
  doc.line(30, 15, w - 30, 15);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...gold);
  doc.text("✧ Victorian Quantum Veil ✧", w / 2, 25, { align: "center" });

  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(...muted);
  doc.text("Tarot Reading Report", w / 2, 32, { align: "center" });

  // Date
  doc.setFontSize(8);
  doc.text(new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }), w / 2, 38, { align: "center" });

  // Card Name
  let y = 50;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...gold);
  doc.text(primaryCard.name, w / 2, y, { align: "center" });

  // Keywords
  y += 8;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(...cream);
  doc.text(primaryCard.keywords.join(" · "), w / 2, y, { align: "center" });

  // Planetary info
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  const elemSymbol = elementInfo[primaryCard.element]?.symbol || "";
  doc.text(
    `${primaryCard.planetaryRuler}  ·  ${elemSymbol} ${primaryCard.element}${primaryCard.zodiacAssociation ? `  ·  ${primaryCard.zodiacAssociation}` : ""}`,
    w / 2, y, { align: "center" }
  );

  // Divider
  y += 6;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.2);
  doc.line(40, y, w - 40, y);

  // Resonance
  y += 8;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(180, 160, 140);
  const resLines = doc.splitTextToSize(resonance, w - 50);
  doc.text(resLines, w / 2, y, { align: "center" });
  y += resLines.length * 4.5 + 4;

  // Meaning
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...cream);
  const meaningLines = doc.splitTextToSize(primaryCard.meaning, w - 40);
  doc.text(meaningLines, 20, y);
  y += meaningLines.length * 5 + 4;

  // Symbolism
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  const symLines = doc.splitTextToSize(primaryCard.symbolism, w - 40);
  doc.text(symLines, 20, y);
  y += symLines.length * 4.5 + 6;

  // Interpretation sections (if available)
  if (interp) {
    // Upright
    doc.setDrawColor(...gold);
    doc.line(40, y, w - 40, y);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...gold);
    doc.text(interp.uprightTitle, 20, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...cream);
    const upLines = doc.splitTextToSize(interp.uprightDescription, w - 40);
    doc.text(upLines, 20, y);
    y += upLines.length * 4.5 + 4;

    // Shadow
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(180, 140, 140);
    doc.text(`Shadow: ${interp.shadowTitle}`, 20, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(180, 160, 140);
    const shLines = doc.splitTextToSize(interp.shadowDescription, w - 40);
    doc.text(shLines, 20, y);
    y += shLines.length * 4.5 + 4;

    // Check page overflow
    if (y > 250) {
      doc.addPage();
      doc.setFillColor(26, 13, 16);
      doc.rect(0, 0, w, 297, "F");
      y = 20;
    }

    // Reflection Prompts
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...gold);
    doc.text("Questions for Reflection", 20, y);
    y += 6;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...cream);
    interp.reflectionPrompts.forEach((prompt) => {
      const pLines = doc.splitTextToSize(`✦ ${prompt}`, w - 45);
      doc.text(pLines, 25, y);
      y += pLines.length * 4.5 + 2;
    });
    y += 2;

    // Affirmation
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(...gold);
    doc.text(`"${interp.affirmation}"`, w / 2, y, { align: "center" });
    y += 8;
  }

  // Check page overflow
  if (y > 240) {
    doc.addPage();
    doc.setFillColor(26, 13, 16);
    doc.rect(0, 0, w, 297, "F");
    y = 20;
  }

  // Cosmic Weather
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.2);
  doc.line(40, y, w - 40, y);
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...gold);
  doc.text("✧ Cosmic Weather ✧", w / 2, y, { align: "center" });
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...cream);
  doc.text(
    `${weather.moonPhaseIcon} ${weather.moonPhase}  ·  ${elementInfo[weather.dominantElement]?.symbol || ""} ${weather.dominantElement}`,
    w / 2, y, { align: "center" }
  );
  y += 6;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  const climateLines = doc.splitTextToSize(`"${weather.cosmicClimate}"`, w - 60);
  doc.text(climateLines, w / 2, y, { align: "center" });
  y += climateLines.length * 4 + 6;

  // Echo Cards
  if (echoCards.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text("Echoes of Parallel Paths:", 20, y);
    y += 5;
    echoCards.forEach((echo) => {
      doc.setTextColor(...cream);
      doc.text(`• ${echo.name} — ${echo.keywords.slice(0, 3).join(", ")}`, 25, y);
      y += 5;
    });
  }

  // Footer
  doc.setDrawColor(...gold);
  doc.line(30, 285, w - 30, 285);
  doc.setFontSize(7);
  doc.setTextColor(...muted);
  doc.text("victorianquantumveil.app", w / 2, 291, { align: "center" });

  // Save
  doc.save(`reading-${primaryCard.name.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
