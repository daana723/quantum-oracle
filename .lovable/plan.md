

# Victorian Quantum Veil — Implementation Plan

## Overview
A mobile-first, single-card tarot oracle app combining Victorian Art Nouveau elegance with quantum mechanics metaphors. Users contemplate a mysterious hidden card, select or type an intention, then "collapse the wave function" to reveal a Major Arcana card alongside echoes of parallel possibilities.

---

## Design Vision

### Aesthetic
- **Color palette**: Deep cosmic blacks, rich golds, jewel tones (emerald, sapphire, burgundy)
- **Motifs**: Flowing Art Nouveau lines, floral vines, irises, lilies, peacock feathers
- **Typography**: Elegant serif fonts with Victorian character
- **Backgrounds**: Subtle nebula-like cosmic patterns with faint Art Nouveau overlays
- **Card frames**: Ornate borders with gold accents and organic flourishes

### Mood
Contemplative, mysterious, luxurious — no urgency, no gamification, no fortune-telling language

---

## Core Features (MVP)

### 1. Landing Experience
- Elegant splash with app title "Victorian Quantum Veil"
- Subtle ambient animation (floating particles, gentle glow)
- Smooth transition into the oracle screen

### 2. Intent Selection
- **Curated theme buttons**: Love, Career, Change, Self, Shadow, Clarity
- **Optional custom text field**: "Or whisper your own intention..."
- Intent subtly influences card probability weighting
- Beautiful button styling with hover/tap states

### 3. The Hidden Card
- Large, centered card showing ornate Victorian Art Nouveau back design
- Symmetrical floral mandala with gold accents
- Faint overlapping silhouettes suggesting quantum uncertainty
- Subtle animation: gentle pulsing glow, slow organic movement
- Instruction text: "Focus your intention… then touch to observe"

### 4. Quantum Collapse Animation
- On tap/click: Rippling wave function effect
- Soft blurring, overlapping card outlines fading in and out
- Multiple possibilities converging toward center
- Dramatic resolution into single revealed card

### 5. Primary Card Reveal
- Full Major Arcana card displayed in Art Nouveau frame
- Card name in elegant typography
- Poetic interpretation paragraph (non-predictive, reflective language)
- Subtle entrance animation

### 6. Superposition Echoes
- 2-3 smaller, semi-transparent cards below the main reveal
- Labeled "Echoes of parallel paths" or "What might have been"
- Each shows alternate card with brief variant interpretation
- Tap/hover to enlarge and read full meaning
- Visual treatment: faded, ethereal, slightly blurred

### 7. Actions & Persistence
- "New Observation" button to draw again
- Reading automatically saved to local browser storage
- Simple reading history accessible from a subtle menu
- Each saved reading shows: date, intention, primary card, echoes

---

## Technical Approach

### Placeholder Cards
- Elegant stylized placeholder images for all 22 Major Arcana
- Consistent Victorian Art Nouveau aesthetic
- Named to match standard tarot (The Fool, The Magician, etc.)
- Designed to be replaceable with custom uploads later

### Intent Probability System
- Base random selection from 22 cards
- Theme keywords map to related archetypes:
  - Love → Empress, Lovers, High Priestess
  - Career → Emperor, Chariot, Magician
  - Change → Death, Tower, Wheel of Fortune
  - etc.
- Subtle weighting, never deterministic

### Animations
- CSS keyframe animations for ambient effects
- JavaScript/React Spring for collapse sequence
- Smooth transitions between states
- Performance optimized for mobile

### Local Storage
- Browser localStorage for reading history
- Stores: timestamp, intention, drawn cards, interpretations
- Simple history view with ability to revisit past readings

---

## Page Structure

1. **Home/Oracle Screen**: Single screen containing intent input, hidden card, and reveal experience
2. **History Drawer**: Slide-out panel or modal showing saved readings
3. **About/Info**: Optional subtle link explaining the app's philosophy

---

## Future Enhancements (Post-MVP)
- Custom card image upload (22 Major Arcana)
- Sound effects (chime on collapse)
- Shareable reading summaries
- Minor Arcana expansion
- Cloud sync with user accounts
- Daily card notification option

