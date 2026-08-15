# Richer Revealed Readings: Per-Card Symbolism + Contextual Summary

## Goal
When a reading is revealed, every card gets its own expanded symbolism panel (not just the one card you tap), and the reading closes with an interpretive summary written for the question context you chose (Love, Career, Change, Self, Shadow, Clarity, or your own typed intent).

## What changes for the user

Single-card reading (`ReadingDisplay`)
- Primary card gains a "Symbolism & Signs" block: symbolism text, keywords, elemental/planetary resonance, and the upright/shadow framing already written for that card.
- Each echo card expands into the same structure instead of only a reversed-meaning line.
- New closing "What This Means for Your Question" panel keyed to the chosen intent.

Multi-card spreads (`SpreadReadingDisplay`)
- All positions render their own symbolism panel stacked below the layout (accordion-style, the tapped one open by default) rather than only the single selected card.
- Each panel is position-aware: "The Fool in Challenge" reads differently than "The Fool in Outcome".
- New "Interpretive Summary" panel below Elemental Synthesis that weaves the dominant cards, the arc, and the chosen intent into a few sentences.

## Content sources (no new data entry required)
Reuse what already exists:
- `tarotCards.ts` — `symbolism`, `keywords`, `themes`, `element`, `planetaryRuler`, `zodiacAssociation`
- `cardInterpretations.ts` — `uprightTitle/Description`, `shadowTitle/Description`, `reflectionPrompts`, `affirmation`
- `spreadMeanings.ts` — position labels, relational and synthesis logic
- `cosmicWeather.ts` — elemental/planetary resonance lines

## Technical approach

New file `src/data/contextualReading.ts`:
- `getPositionalSymbolism(card, positionLabel?)` — merges card symbolism with a position lens (templated per position label, generic fallback).
- `getIntentLens(card, intent)` — maps each theme (`love`, `career`, `change`, `self`, `shadow`, `clarity`) to a sentence drawn from the card's keywords and whether the card carries that theme in `themes`.
- `getContextualSummary({ cards, positions, intent, customIntent, spreadType })` — 3-5 sentence summary: dominant element/theme reading, the strongest intent-matching card named as the anchor, arc direction for multi-card spreads, and a closing reflective prompt taken from `cardInterpretations`.
- Custom free-text intent: matched to the closest built-in theme via keyword scan; if no match, the summary quotes the user's own wording and uses a theme-neutral template. All text stays reflective, never predictive.

New presentational component `src/components/oracle/CardSymbolismPanel.tsx` — reusable panel (card name, position label, symbolism, keyword chips, upright/shadow lines, `PlanetaryResonance`), used by both displays.

Wiring:
- `OracleScreen.tsx` passes `selectedTheme` and `customIntent` down to `ReadingDisplay` and `SpreadReadingDisplay` (both already receive cards; only new props added).
- `ReadingDisplay` and `SpreadReadingDisplay` render the panels and the summary; existing layout, animations, and buttons stay as they are.

Styling stays on existing tokens (gold accents, card/40 backgrounds, display/body fonts). Longer content is collapsible so mobile screens do not become an endless scroll.

## Out of scope
No backend, no changes to card drawing/entropy logic, no new card copy authored by hand.
