// Reflection prose for the 56 Minor Arcana. Ready for an optional full-deck mode;
// readings stay Major-Arcana-only until that mode is switched on.
import { minorArcana, type MinorSuit } from "./minorArcanaCards";

export interface MinorProse {
  keywords: string[];
  meaning: string;
  reversedMeaning: string;
}

type Entry = [string[], string, string];

export const suitElements: Record<MinorSuit, { element: 'fire' | 'water' | 'air' | 'earth'; focus: string }> = {
  wands: { element: 'fire', focus: 'momentum, will and creative spark' },
  cups: { element: 'water', focus: 'feelings, connection and inner truth' },
  swords: { element: 'air', focus: 'thoughts, clarity and cutting through loops' },
  pentacles: { element: 'earth', focus: 'tangible steps, body, money and home' },
};

const prose: Record<MinorSuit, Entry[]> = {
  wands: [
    [["spark", "inspiration", "beginning"], "A small flame offers itself. You need not know where it leads—only that it warms you. Pick it up while the interest is alive.", "The spark flickers but has not caught. Is it fatigue, or the fear of starting badly? A tiny first move can rekindle it."],
    [["planning", "choice", "horizon"], "You stand with the world in your hand, weighing two paths. Planning is useful—until it becomes a hiding place.", "Plans multiply while action waits. Choose the smaller, nearer door and walk through it."],
    [["expansion", "foresight", "waiting"], "Your ships have sailed; now watch the horizon. What you set in motion is already travelling.", "Waiting turns to worry. Check on one thing you launched rather than imagining every outcome."],
    [["celebration", "home", "stability"], "A threshold worth celebrating. Pause and honour how far you have come before rushing onward.", "Celebration feels out of reach. Even a quiet acknowledgement counts as a garland."],
    [["friction", "competition", "noise"], "Many voices, many sticks clashing. Not every conflict is yours to win—some are just noise.", "Inner arguments exhaust you. Name the loudest voice and ask if it truly belongs to you."],
    [["recognition", "progress", "confidence"], "A small victory deserves to be seen. Let yourself receive the laurel.", "Waiting for applause stalls you. Your progress is real even if unnoticed."],
    [["boundaries", "standing firm", "conviction"], "Hold your ground with gentle firmness. You are allowed to protect what matters.", "Defending everything at once drains you. Choose the one boundary that matters today."],
    [["speed", "movement", "messages"], "Things are moving swiftly. Ride the current; reply to the message, take the step.", "Too many things in flight. Ground one before launching another."],
    [["resilience", "persistence", "guardedness"], "Weary but still standing. The last stretch asks for rest, not surrender.", "Vigilance has become exhaustion. Lowering your guard for a moment is safe."],
    [["burden", "responsibility", "overload"], "You carry ten staves at once. What could be set down, delegated, or simply left for tomorrow?", "The load is too heavy to keep pretending. Releasing one stave is not failure."],
    [["curiosity", "exploration", "enthusiasm"], "A curious messenger arrives. Follow interest without demanding it become a career.", "Ideas scatter like sparks. Write one down and let the rest drift."],
    [["adventure", "boldness", "impulse"], "Charge forward with passion. Energy is high—direct it.", "Rushing creates chaos. Slow the horse enough to see the road."],
    [["warmth", "confidence", "magnetism"], "Radiant and self-assured, you light the room. Trust your warmth.", "Your fire is turned inward or dimmed. Reconnect with what once excited you."],
    [["vision", "leadership", "bold action"], "You see the whole map. Lead with vision, and let others carry details.", "Big visions without first steps. Translate the dream into one next action."],
  ],
  cups: [
    [["new feeling", "openness", "love"], "A cup overflows with fresh feeling. Let yourself receive without earning it first.", "The cup feels empty or closed. Gentleness toward yourself refills it."],
    [["union", "partnership", "mutual respect"], "Two cups meet in balance. Connection asks only honesty and presence.", "Something feels uneven. Name the need you have not voiced."],
    [["friendship", "joy", "community"], "Raise a glass with kindred spirits. Joy shared is joy grown.", "Social energy runs low. Choose one safe person instead of the crowd."],
    [["contemplation", "apathy", "reassessment"], "An offered cup goes unnoticed while you turn inward. Rest is valid—just glance up now and then.", "Withdrawal ends; curiosity returns. Accept one small offering."],
    [["grief", "loss", "regret"], "Three cups spilled, two still standing. Grieve fully—then turn to what remains.", "Healing begins. You are allowed to look at what was not lost."],
    [["nostalgia", "innocence", "memory"], "Sweet memories return like flowers in a cup. Draw comfort, not a cage, from the past.", "Living backward. What would your younger self want for you now?"],
    [["options", "fantasy", "illusion"], "Seven cups of dazzling choices—some are mist. Which one could you actually hold?", "The fog clears. Choose one cup and let the others go."],
    [["walking away", "seeking", "release"], "Leaving what no longer nourishes takes courage. You may walk toward something truer.", "Fear of leaving or aimless drifting. Clarify what you are walking toward."],
    [["contentment", "wishes", "satisfaction"], "A wish fulfilled, or close. Let satisfaction land in your body.", "Satisfaction feels hollow. Check whether the wish was truly yours."],
    [["harmony", "family", "fulfilment"], "A rainbow over home. Emotional belonging is possible and present.", "Harmony feels strained. Small repairs matter more than perfect peace."],
    [["intuition", "sensitivity", "creative offer"], "A playful message surfaces from the heart. Notice the odd little idea.", "Feelings feel too big. Sensitivity is information, not weakness."],
    [["romance", "idealism", "following the heart"], "A gentle knight follows feeling. Let your heart lead one step.", "Daydreams replace action. Bring one dream into the present."],
    [["compassion", "calm", "emotional depth"], "She holds feeling with steady hands. You can care without drowning.", "Absorbing others' emotions. Your feelings deserve the same tenderness."],
    [["balance", "emotional mastery", "diplomacy"], "Calm amid the waves. Steadiness is a skill you already own.", "Suppression masquerading as calm. Let one feeling be felt."],
  ],
  swords: [
    [["clarity", "truth", "breakthrough"], "A single blade cuts through fog. One honest thought can end a long loop.", "Thoughts tangle. Write them down—paper is a sword too."],
    [["stalemate", "indecision", "blindfold"], "Two choices, eyes covered, heart guarded. A decision delayed is still a decision—gently choose.", "The blindfold slips. You already know more than you allow yourself."],
    [["heartache", "sorrow", "truth that hurts"], "A painful truth pierces. Let it hurt without letting it define you.", "Healing slowly. Release the replaying of the wound."],
    [["rest", "recovery", "stillness"], "The knight lies still. Rest is not laziness; it is repair.", "Restlessness after rest. Ease back in gradually."],
    [["conflict", "pride", "hollow victory"], "Winning at all costs leaves you alone. Is this battle worth it?", "Making peace becomes possible. Let the swords lie."],
    [["transition", "moving on", "calmer waters"], "Crossing to quieter shores. You carry your swords, but the water calms.", "Resisting transition. What would make the crossing feel safe?"],
    [["strategy", "secrecy", "self-protection"], "Slipping away with what you need. Choose your battles cleverly.", "Hiding from yourself. Honesty may be the lighter path."],
    [["feeling trapped", "self-limiting belief", "mental loop"], "Bound and surrounded—yet the blades do not touch you. The way out is a thought away.", "The ropes loosen. Name the belief and step out."],
    [["anxiety", "sleeplessness", "worry"], "Night thoughts magnify everything. Morning shrinks them back to size.", "Worry eases. Reach out—you need not hold the night alone."],
    [["ending", "rock bottom", "release"], "The worst is over; dawn rises behind the blades. Endings make room.", "Rising slowly. Recovery is not linear—and that is fine."],
    [["curiosity", "vigilance", "new ideas"], "A watchful mind seeks truth. Ask your sharp questions.", "Overthinking every gust. Let some winds pass."],
    [["drive", "directness", "haste"], "Charging ahead with conviction. Speed serves a clear aim.", "Rushing without a plan. Pause and aim before you charge."],
    [["discernment", "independence", "clear boundaries"], "She sees clearly and speaks plainly. Clarity is a form of kindness.", "Coldness or harsh self-judgment. Soften the blade on yourself."],
    [["authority", "logic", "fair judgment"], "Reason governs the throne. Decide by principle, not panic.", "Rigid thinking. Allow heart into the verdict."],
  ],
  pentacles: [
    [["opportunity", "grounding", "seed"], "A golden coin offered from the clouds. A practical beginning—small and real.", "The opportunity feels unreachable. Shrink it to a step you can take today."],
    [["juggling", "adaptability", "balance"], "Two coins in motion. Flexibility keeps you afloat—just do not add a third.", "Dropping balls. Simplify the juggle."],
    [["collaboration", "craft", "learning"], "Building together. Your skill matters, and so does asking for help.", "Working alone, unheard. Invite one collaborator."],
    [["security", "holding on", "control"], "Clutching coins tightly. Security is good; rigidity is costly.", "Loosening grip. Generosity, even to yourself, opens doors."],
    [["hardship", "exclusion", "scarcity"], "Cold outside the lit window. Help may be closer than it seems.", "Recovery from lack. Accept support without shame."],
    [["generosity", "giving", "receiving"], "Coins flow between hands. Both giving and receiving are honourable.", "Imbalance in exchange. Check who gives more."],
    [["patience", "assessment", "long-term view"], "Leaning on the hoe, watching growth. Good things take seasons.", "Impatience with slow results. Growth is happening underground."],
    [["diligence", "mastery", "repetition"], "Carving coin after coin. Focused repetition builds mastery.", "Perfectionism stalls craft. Done is a form of excellence."],
    [["self-sufficiency", "abundance", "refinement"], "Alone in a flourishing garden. Enjoy what you have cultivated.", "Overworking for independence. Let yourself rest in your garden."],
    [["legacy", "family", "lasting wealth"], "Abundance across generations. What you build can shelter many.", "Old family patterns weigh in. Keep what serves; let the rest go."],
    [["study", "manifestation", "new skill"], "A student gazes at a coin. Learn something practical and real.", "Learning without applying. Use one thing you already know."],
    [["reliability", "routine", "steady progress"], "Slow and steady ploughs the field. Routines are your quiet allies.", "Stuck in routine. Change one small habit."],
    [["nurturing", "practicality", "comfort"], "She tends the hearth and the garden. Care for your body and space.", "Neglecting your own needs while caring for others. Nourish yourself first."],
    [["abundance", "security", "wise stewardship"], "Seated amid plenty. Steady wisdom grows lasting security.", "Measuring worth by output. You are more than what you produce."],
  ],
};

export function getMinorProse(id: string): MinorProse | undefined {
  const card = minorArcana.find((c) => c.id === id);
  if (!card) return undefined;
  const index = minorArcana.filter((c) => c.suit === card.suit).indexOf(card);
  const [keywords, meaning, reversedMeaning] = prose[card.suit][index];
  return { keywords, meaning, reversedMeaning };
}
