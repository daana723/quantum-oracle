/** Rich interpretation data for SEO card detail pages */

export interface CardInterpretation {
  slug: string;
  uprightTitle: string;
  uprightDescription: string;
  shadowTitle: string;
  shadowDescription: string;
  reflectionPrompts: string[];
  affirmation: string;
  journeyNarrative: string; // Extended poetic passage
  relatedCardIds: number[]; // For internal linking
}

export const cardInterpretations: Record<number, CardInterpretation> = {
  0: {
    slug: "the-fool",
    uprightTitle: "The Leap of Faith",
    uprightDescription: "The Fool stands at the edge of everything known, gazing into possibility. This is the energy of pure potential — before experience has shaped expectation, before failure has taught caution. You are invited to step forward without knowing where the ground will meet your foot. Trust is not certainty; it is the willingness to move before certainty arrives.",
    shadowTitle: "The Paralysis of Possibility",
    shadowDescription: "When The Fool's energy turns inward, it becomes the fear of beginning. Too many paths can paralyze as effectively as none. Recklessness masquerades as courage, or excessive caution wears the mask of wisdom. Ask yourself: am I protecting something real, or guarding a prison I've mistaken for a sanctuary?",
    reflectionPrompts: [
      "What would you begin if you knew you could not fail?",
      "Where in your life have you been standing at the edge, waiting for permission to leap?",
      "What innocence have you lost that might be worth reclaiming?",
    ],
    affirmation: "I trust the unknown as a space of creation, not destruction.",
    journeyNarrative: "In the quantum field, The Fool represents the moment before observation — when all possibilities exist simultaneously. Every great journey, every invention, every love story began with someone choosing to step into uncertainty. The cliff is not a threat; it is a threshold. The small dog at The Fool's heels is instinct — not warning against the step, but eager to accompany it. The white rose held aloft is purity of intention: not naiveté, but the radical act of beginning with an open heart.",
    relatedCardIds: [21, 1, 13], // World, Magician, Death
  },
  1: {
    slug: "the-magician",
    uprightTitle: "The Conscious Creator",
    uprightDescription: "Every tool lies before you. The Magician channels cosmic intelligence through focused will — one hand raised to receive, one pointed to manifest. This is not magic as fantasy, but magic as alignment: when intention, resources, and timing converge, reality reshapes itself around your vision.",
    shadowTitle: "The Trickster's Mirror",
    shadowDescription: "Scattered attention dissipates power. The Magician reversed may indicate manipulation — of others or of oneself. Are you using your gifts in service of truth, or constructing elaborate illusions? Power without integrity becomes its own prison.",
    reflectionPrompts: [
      "What resources do you already possess that remain unrecognized?",
      "Where are you channeling your creative energy — and where is it leaking?",
      "What would you create if you fully believed in your ability?",
    ],
    affirmation: "I am the bridge between vision and reality.",
    journeyNarrative: "The Magician stands at the nexus of above and below, channeling the infinite through the finite. The four elemental tools upon the table — cup, pentacle, sword, wand — represent not just resources but dimensions of being: emotion, body, mind, spirit. When aligned, they create a circuit of manifestation. Mercury, the planetary ruler, speaks of communication between realms — the language of transformation itself.",
    relatedCardIds: [0, 2, 10], // Fool, High Priestess, Wheel
  },
  2: {
    slug: "the-high-priestess",
    uprightTitle: "The Keeper of Hidden Knowledge",
    uprightDescription: "Between the pillars of duality, she holds the scrolls of what cannot be spoken aloud. The High Priestess governs the liminal space where knowing precedes understanding. Your intuition is not guessing — it is a form of perception that operates beyond the rational mind's frequency.",
    shadowTitle: "The Silence That Conceals",
    shadowDescription: "When inner knowing is ignored too long, it withdraws. The reversed Priestess may indicate disconnection from intuition, or secrets kept that corrode from within. The veil exists to be parted, not to permanently divide you from your own depths.",
    reflectionPrompts: [
      "What do you already know that you haven't yet admitted to yourself?",
      "When did you last create true silence — not absence of noise, but presence of listening?",
      "What cycles in your life mirror the moon's phases?",
    ],
    affirmation: "I trust the wisdom that arrives in silence.",
    journeyNarrative: "The Moon at The High Priestess's feet marks her as guardian of cyclical wisdom — the kind that cannot be hurried or forced. She sits between Boaz and Jachin, the pillars of severity and mercy, holding the tension of opposites without resolving them. This is her power: the ability to dwell in mystery without demanding answers. In quantum terms, she is the wave function itself — all possibilities held in superposition, awaiting the right moment of observation.",
    relatedCardIds: [1, 18, 9], // Magician, Moon, Hermit
  },
  3: {
    slug: "the-empress",
    uprightTitle: "The Living Garden",
    uprightDescription: "Creation flows through The Empress as naturally as water finding its course. She does not force growth; she creates conditions for it. Abundance here is not accumulation but overflow — the natural result of tending what matters with patience and presence. Your creative power asks to be expressed.",
    shadowTitle: "The Depleted Wellspring",
    shadowDescription: "The garden untended grows wild or withers. The Empress reversed speaks of creative blockage, neglected self-care, or nurturing that has become smothering. When the giver empties completely, the giving becomes a wound rather than a gift.",
    reflectionPrompts: [
      "What in your life is ready to bloom if given attention?",
      "How do you nurture yourself with the same devotion you offer others?",
      "Where do you experience abundance, and where do you experience scarcity?",
    ],
    affirmation: "I create by allowing, not by forcing.",
    journeyNarrative: "Venus rules The Empress, and her domain is the sensory world made sacred. The wheat fields ripening, the waterfall flowing, the cushioned throne — these are not symbols of luxury but of the earth's generosity when met with care. She reminds us that creation is not solely intellectual; it is bodily, sensual, rooted in the physical world. To create, one must first be willing to receive.",
    relatedCardIds: [4, 6, 17], // Emperor, Lovers, Star
  },
  4: {
    slug: "the-emperor",
    uprightTitle: "The Architect of Order",
    uprightDescription: "From chaos, The Emperor carves structure. His throne is stone because what he builds is meant to endure. Authority here is not domination but responsibility — the willingness to make decisions and stand by their consequences. What foundation are you laying?",
    shadowTitle: "The Tyrant Within",
    shadowDescription: "Control that once served has become compulsion. The reversed Emperor may indicate rigidity, authoritarianism, or the fear that drives excessive control. Even self-discipline can become self-tyranny. Structure should serve life, not imprison it.",
    reflectionPrompts: [
      "Where do you need more structure, and where do you need more flexibility?",
      "What are you building that will outlast this moment?",
      "How do you wield authority — over others, and over yourself?",
    ],
    affirmation: "I build with purpose and lead with integrity.",
    journeyNarrative: "Mars and Aries fuel The Emperor — cardinal fire directed through disciplined will. The four rams on his throne speak of persistence, determination, and the courage to establish order where none existed. His red robes are passion channeled into action. Behind him, the barren mountains represent what has been conquered, and the river flowing below speaks of emotion held but not denied. True authority arises from self-mastery, not from dominion over others.",
    relatedCardIds: [3, 7, 11], // Empress, Chariot, Justice
  },
  5: {
    slug: "the-hierophant",
    uprightTitle: "The Bridge Between Worlds",
    uprightDescription: "Ancient wisdom passed through generations arrives at your door. The Hierophant holds the keys to knowledge that predates your questions. Tradition, teaching, and spiritual lineage offer pathways — not as chains, but as bridges built by those who walked before you.",
    shadowTitle: "The Cage of Dogma",
    shadowDescription: "When tradition becomes law and questioning becomes heresy, The Hierophant's wisdom calcifies. The reversed position asks: are you following a path because it serves your growth, or because leaving it frightens you? Not all inherited beliefs deserve inheritance.",
    reflectionPrompts: [
      "Which traditions in your life serve your growth, and which have become hollow rituals?",
      "What teacher or teaching has shaped you most profoundly?",
      "Where might you need to become your own spiritual authority?",
    ],
    affirmation: "I honor tradition while trusting my own unfolding truth.",
    journeyNarrative: "Taurus grounds The Hierophant in the material world, even as he reaches toward the divine. The crossed keys represent the balance between revelation and concealment — some truths must be earned. His blessing gesture connects heaven and earth through human mediation. The two acolytes represent the dual nature of learning: receiving wisdom and questioning it. Both are necessary.",
    relatedCardIds: [2, 9, 20], // High Priestess, Hermit, Judgement
  },
  6: {
    slug: "the-lovers",
    uprightTitle: "The Sacred Choice",
    uprightDescription: "Beyond romance, The Lovers speaks of alignment — the moment when your values, desires, and actions converge. The angel above blesses not a relationship but a choice made from wholeness rather than need. True union begins within.",
    shadowTitle: "The Divided Heart",
    shadowDescription: "Conflicting desires tear at the fabric of decision. The reversed Lovers may indicate values misalignment, relationship discord, or the inability to commit because both paths hold genuine appeal. Sometimes the choice is not between good and bad, but between two goods.",
    reflectionPrompts: [
      "What choice before you requires not compromise but commitment?",
      "Where do your deepest values and your daily actions align — or conflict?",
      "What would wholeness look like in your most important relationship?",
    ],
    affirmation: "I choose from alignment, not from fear of loss.",
    journeyNarrative: "Gemini's duality finds resolution in The Lovers — not through eliminating one half, but through integration. The Tree of Knowledge behind Eve and the Tree of Life behind Adam represent the eternal dance between experience and innocence, wisdom and wonder. The angel Raphael, healer of God, blesses the union because healing is what genuine choice creates. Every authentic commitment closes certain doors to open others more fully.",
    relatedCardIds: [3, 15, 14], // Empress, Devil, Temperance
  },
  7: {
    slug: "the-chariot",
    uprightTitle: "The Victory of Will",
    uprightDescription: "The sphinxes pull in opposite directions — black and white, conscious and unconscious, desire and duty. The charioteer's triumph is not in eliminating opposition but in harnessing it. Your contradictions can become your propulsion.",
    shadowTitle: "The Stalled Advance",
    shadowDescription: "When inner conflicts remain unresolved, the chariot stalls. The reversed position suggests scattered willpower, lack of direction, or aggression mistaken for determination. Before demanding movement, ensure you know where you're going — and why.",
    reflectionPrompts: [
      "What opposing forces within you could be harnessed rather than fought?",
      "Where in your life do you need to take the reins?",
      "Is your current momentum carrying you toward your true destination?",
    ],
    affirmation: "I move forward by integrating, not by conquering.",
    journeyNarrative: "Cancer's protective shell meets martial determination in The Chariot. The canopy of stars above the charioteer connects earthly will to cosmic purpose. The city behind represents what has been accomplished; the open road ahead, what awaits. This card speaks of the moment after decision, when commitment becomes motion. The sphinxes — guardians of mystery — submit not to force but to clarity of purpose.",
    relatedCardIds: [4, 8, 21], // Emperor, Strength, World
  },
  8: {
    slug: "strength",
    uprightTitle: "The Gentle Power",
    uprightDescription: "The lion submits not to force but to presence. True strength is not the ability to overpower, but the patience to remain open when closing would be easier. The infinity symbol above her head speaks of endurance beyond what muscles can achieve.",
    shadowTitle: "The Misapplied Force",
    shadowDescription: "When gentleness is needed and force is applied, or when boundaries are needed and submission is offered — Strength reversed. Self-doubt may masquerade as humility, or aggression as courage. The question is always proportionality.",
    reflectionPrompts: [
      "Where do you apply force when gentleness would be more effective?",
      "What 'lion' within you awaits compassionate acknowledgment rather than conquest?",
      "How do you distinguish between true patience and mere endurance?",
    ],
    affirmation: "My greatest power lies in my capacity for compassion.",
    journeyNarrative: "Leo's fire burns in Strength, but not as destruction — as warmth. The woman does not wrestle the lion; she opens its mouth with bare hands and infinite tenderness. This is the most intimate of all the Major Arcana scenes: the moment where the wild self and the conscious self meet in mutual recognition. The garland of flowers binding them speaks of joy, not obligation. The beast is tamed not by chains but by love.",
    relatedCardIds: [7, 9, 14], // Chariot, Hermit, Temperance
  },
  9: {
    slug: "the-hermit",
    uprightTitle: "The Inner Lamp",
    uprightDescription: "At the mountain's peak, The Hermit lifts his lantern — not to illuminate the whole path, but only the next step. Solitude here is not loneliness but sovereignty. The answers you seek are not hidden from you; they are hidden within you.",
    shadowTitle: "The Exile of Fear",
    shadowDescription: "Withdrawal becomes avoidance, contemplation becomes rumination. The reversed Hermit may be hiding from life rather than illuminating it. Solitude serves only when it is chosen, and only when it eventually opens back toward connection.",
    reflectionPrompts: [
      "What truth might emerge if you sat in complete silence for an hour?",
      "Is your solitude a sanctuary or a hiding place?",
      "What inner guidance have you been ignoring because it asks something difficult?",
    ],
    affirmation: "In stillness, I find the wisdom that movement obscures.",
    journeyNarrative: "Virgo's discernment sharpens to a single point in The Hermit — the light of focused awareness. Mercury's influence here is not communicative but contemplative: the mind turned inward. The mountain represents the spiritual ascent that requires leaving the valley of consensus. His staff is not a weapon but a measure — of depth, of distance traveled, of the space between who he was and who he has become.",
    relatedCardIds: [2, 12, 18], // High Priestess, Hanged Man, Moon
  },
  10: {
    slug: "wheel-of-fortune",
    uprightTitle: "The Eternal Turning",
    uprightDescription: "The wheel does not ask permission to turn. Cycles of fortune, seasons of life, the rhythm of expansion and contraction — these are not punishments or rewards but the fundamental pattern of existence. Your position on the wheel is temporary; your relationship to change is permanent.",
    shadowTitle: "The Resistance to Cycles",
    shadowDescription: "Clinging to the upswing or despairing at the descent — both miss the wheel's teaching. Reversed, this card speaks of fighting natural cycles, trying to freeze what must flow, or feeling victimized by change that is actually evolution.",
    reflectionPrompts: [
      "What cycle in your life is completing, and what is beginning?",
      "How do you typically respond when circumstances shift beyond your control?",
      "What would change if you viewed setbacks as turns of the wheel rather than failures?",
    ],
    affirmation: "I move with the rhythms of life rather than against them.",
    journeyNarrative: "Jupiter's expansiveness meets the wheel's inevitability. The four fixed signs at the corners — Aquarius, Scorpio, Leo, Taurus — represent the stability that persists even within constant change. The sphinx at the top holds the sword of discernment; the serpent descends with old knowledge; the jackal-headed figure rises with new understanding. This is the card of karma understood not as punishment but as pattern.",
    relatedCardIds: [13, 21, 20], // Death, World, Judgement
  },
  11: {
    slug: "justice",
    uprightTitle: "The Unflinching Mirror",
    uprightDescription: "Justice sees clearly because she chooses not to look away. The scales balance cause and effect with mathematical precision. This is not punishment but accountability — the recognition that every action generates consequence, and that truth, however uncomfortable, is the foundation of integrity.",
    shadowTitle: "The Scales Unbalanced",
    shadowDescription: "When justice is reversed, dishonesty corrodes — either from others or from within. Perhaps accountability is being avoided, or harsh judgment is being applied where compassion is needed. The sword cuts both ways; discernment is needed to wield it wisely.",
    reflectionPrompts: [
      "Where in your life do cause and effect need honest acknowledgment?",
      "What truth are you avoiding because its consequences feel too heavy?",
      "How do you balance justice with mercy in your dealings with yourself?",
    ],
    affirmation: "I face truth clearly and act with integrity.",
    journeyNarrative: "Libra seeks balance, and Justice provides the mechanism. Unlike blind Justice of civil law, this Justice sees — eyes open, fully aware. The sword in her right hand is reason; the scales in her left, intuition. The purple veil behind her separates the visible from the hidden, the conscious from the unconscious. True justice requires access to both.",
    relatedCardIds: [4, 20, 8], // Emperor, Judgement, Strength
  },
  12: {
    slug: "the-hanged-man",
    uprightTitle: "The Willing Surrender",
    uprightDescription: "Suspended between worlds, The Hanged Man discovers what struggle could never reveal. This is not defeat but chosen pause — the recognition that some truths are visible only from an inverted perspective. What seems like sacrifice may be the ultimate investment.",
    shadowTitle: "The Stagnant Martyrdom",
    shadowDescription: "When surrender becomes stagnation, and sacrifice becomes identity, The Hanged Man's gift curdles. The reversed position asks: are you genuinely waiting for clarity, or using patience as an excuse for inaction?",
    reflectionPrompts: [
      "What might you see if you completely reversed your current perspective?",
      "Where are you being called to surrender control — and what prevents you?",
      "What sacrifice are you making, and is it truly serving transformation?",
    ],
    affirmation: "I release my grip to receive what grasping cannot hold.",
    journeyNarrative: "Neptune dissolves boundaries, and The Hanged Man embraces this dissolution willingly. The world-tree from which he hangs connects all realms; his bound foot is voluntary limitation. The golden halo around his head reveals that enlightenment often arrives through surrender rather than conquest. Water is his element — the ability to flow around obstacles rather than crash against them.",
    relatedCardIds: [13, 9, 20], // Death, Hermit, Judgement
  },
  13: {
    slug: "death",
    uprightTitle: "The Great Transformation",
    uprightDescription: "Death rides slowly — there is no escape and no need for one. What ends here has completed its purpose. The rising sun on the horizon promises that every ending is simultaneously a beginning. This is not loss; it is the composting of the old into fertile ground for the new.",
    shadowTitle: "The Refusal to Release",
    shadowDescription: "Clinging to what has died — relationships, identities, beliefs — prevents the new from being born. The reversed Death card speaks of stagnation through resistance, the refusal to grieve and thereby the inability to move forward.",
    reflectionPrompts: [
      "What in your life has already ended that you haven't yet acknowledged?",
      "What transformation frightens you — and what might lie beyond the fear?",
      "If you released what no longer serves you, what space would open?",
    ],
    affirmation: "I honor endings as sacred beginnings in disguise.",
    journeyNarrative: "Scorpio's transformative intensity finds its highest expression in Death — not as destruction but as alchemy. Pluto, lord of the underworld, governs not annihilation but metamorphosis. The white rose on Death's banner symbolizes purity and the beauty that emerges from decay. The fallen king, the standing bishop, the kneeling maiden, the innocent child — death comes to all, regardless of status, and in that democracy lies its most profound teaching.",
    relatedCardIds: [0, 16, 10], // Fool, Tower, Wheel
  },
  14: {
    slug: "temperance",
    uprightTitle: "The Alchemical Blend",
    uprightDescription: "Between extremes flows the path of Temperance — not as compromise but as synthesis. The angel pours between vessels, creating something neither cup could hold alone. Patience here is not passive waiting but active integration, the slow work of harmonizing opposing forces.",
    shadowTitle: "The Imbalanced Equation",
    shadowDescription: "When Temperance is reversed, excess dominates in one direction or another. Impatience, overindulgence, or the refusal to blend opposing truths creates disharmony. The middle path requires constant adjustment — it is not a destination but a practice.",
    reflectionPrompts: [
      "What opposing forces in your life are asking to be blended rather than chosen between?",
      "Where do you practice patience, and where has patience become procrastination?",
      "What would moderation look like in your greatest area of excess?",
    ],
    affirmation: "I find power in balance and wisdom in patience.",
    journeyNarrative: "Sagittarius aims for truth, and Temperance finds it in the blend. Jupiter expands what the angel integrates. One foot in water (emotion, intuition), one on land (logic, structure) — this is the card of those who refuse false binaries. The sun on the horizon marks the path of purpose; the irises at the water's edge are messages from the divine. Alchemy is not magic; it is the patient work of transformation.",
    relatedCardIds: [6, 8, 21], // Lovers, Strength, World
  },
  15: {
    slug: "the-devil",
    uprightTitle: "The Shadow's Invitation",
    uprightDescription: "The chains rest loosely upon the figures — look closely, and you'll see they could slip free at any moment. The Devil reveals not external bondage but self-imposed limitation. What patterns, addictions, or fears do you continue to feed? Naming the shadow is the first step toward reclaiming its power.",
    shadowTitle: "The Breaking of Chains",
    shadowDescription: "When The Devil reverses, liberation begins — or deeper bondage takes hold. The shadow confronted may become an ally, but the shadow denied grows stronger in darkness. This is the crossroads between awakening and descent.",
    reflectionPrompts: [
      "What pattern in your life feels both imprisoning and comfortable?",
      "What shadow aspect of yourself are you afraid to acknowledge?",
      "If the chains are loose, what keeps you from removing them?",
    ],
    affirmation: "I acknowledge my shadows as teachers, not as masters.",
    journeyNarrative: "Capricorn's ambition meets Saturn's limitation in The Devil — the material world mistaken for the whole of reality. The inverted pentagram above the horned figure represents spirit submerged beneath matter. Yet this is not evil; it is unconsciousness. The fruit-tipped tail on Eve and the flame-tipped tail on Adam echo the Tree of Knowledge and the Tree of Life from The Lovers — what was chosen freely there has become compulsive here. The teaching is clear: awareness transforms bondage into choice.",
    relatedCardIds: [6, 16, 18], // Lovers, Tower, Moon
  },
  16: {
    slug: "the-tower",
    uprightTitle: "The Lightning of Truth",
    uprightDescription: "What was built on false foundation cannot stand forever. The Tower's destruction is not punishment but revelation — lightning illuminates what darkness concealed. This may feel catastrophic in the moment, but the rubble becomes the raw material for something authentic.",
    shadowTitle: "The Crumbling Avoidance",
    shadowDescription: "When The Tower is resisted, the destruction is prolonged rather than prevented. The reversed position may indicate fear of necessary upheaval, or a slow, grinding collapse that extends suffering. Sometimes it is better to demolish by choice than to wait for lightning.",
    reflectionPrompts: [
      "What structure in your life rests on a foundation you know to be false?",
      "What truth, if fully acknowledged, would change everything?",
      "How might destruction become an act of liberation?",
    ],
    affirmation: "I welcome truth even when it dismantles what I've built.",
    journeyNarrative: "Mars strikes The Tower with explosive force — not to destroy but to liberate. The crown blown from the tower's peak represents ego structures and false beliefs that have been elevated too high. The 22 flames — one for each Major Arcana card — suggest that all archetypal wisdom is present in this moment of crisis. The figures falling are not dying; they are being freed from a prison they had mistaken for a palace.",
    relatedCardIds: [13, 15, 17], // Death, Devil, Star
  },
  17: {
    slug: "the-star",
    uprightTitle: "The Healing Light",
    uprightDescription: "After The Tower's destruction, The Star appears — naked, undefended, pouring water upon the earth and into the pool. Hope here is not optimism but something deeper: the quiet certainty that renewal follows destruction, that the stars shine brightest after the darkest nights.",
    shadowTitle: "The Distant Glimmer",
    shadowDescription: "When The Star reverses, hope feels distant and faith wavers. The connection to inspiration and renewal is blocked — perhaps by despair, cynicism, or the refusal to be vulnerable again after being hurt. Yet the stars remain; it is the clouds that are temporary.",
    reflectionPrompts: [
      "What gives you hope even in your darkest moments?",
      "Where can you pour your energy to nourish both yourself and the world?",
      "What vulnerability have you been avoiding that might lead to healing?",
    ],
    affirmation: "I trust the light that remains even when I cannot see it.",
    journeyNarrative: "Aquarius pours forth The Star's healing waters — one stream to the earth (material renewal), one to the pool (emotional and spiritual restoration). Uranus governs sudden insight, and The Star is the insight that follows The Tower's crisis: that destruction clears the ground for genuine growth. The eight-pointed star above — the Star of Venus — speaks of beauty that survives all devastation. The ibis in the tree is Thoth, the scribe of divine truth, recording what the heart already knows.",
    relatedCardIds: [16, 18, 19], // Tower, Moon, Sun
  },
  18: {
    slug: "the-moon",
    uprightTitle: "The Landscape of Dreams",
    uprightDescription: "Lunar light deceives and reveals in equal measure. The path between the twin towers winds into darkness that must be traversed, not illuminated. The Moon governs the territory of dreams, fears, and the subconscious — where what is true and what is projected become indistinguishable.",
    shadowTitle: "The Fog of Self-Deception",
    shadowDescription: "When The Moon reverses, illusions begin to dissolve — or deepen. Confusion may clear, revealing what was hidden, or denial may intensify. The moon's shadows lose their power when brought into consciousness, but first they must be acknowledged.",
    reflectionPrompts: [
      "What fears recur in your dreams or anxious moments?",
      "Where in your life are you seeing what you want to see rather than what is?",
      "What message might your subconscious be trying to send you?",
    ],
    affirmation: "I navigate uncertainty with courage, trusting what I cannot yet see clearly.",
    journeyNarrative: "Pisces dissolves all boundaries in The Moon — between real and imagined, between self and other, between fear and intuition. Neptune rules this watery landscape where the crayfish of deep unconscious rises from the pool, where the domesticated dog and the wild wolf both howl at the same moon. The twin towers mark the gateway to the unknown — what lies beyond cannot be mapped, only experienced. This is the card of the creative, the mystic, and anyone brave enough to face their own depths.",
    relatedCardIds: [2, 17, 19], // High Priestess, Star, Sun
  },
  19: {
    slug: "the-sun",
    uprightTitle: "The Radiant Return",
    uprightDescription: "After the moon's confusion, The Sun blazes with unmistakable clarity. The child rides forth on the white horse — innocence not as ignorance, but as the state beyond complexity. Joy here is not the absence of difficulty but the presence of authentic vitality.",
    shadowTitle: "The Eclipsed Joy",
    shadowDescription: "Even the sun can be obscured. The reversed Sun may indicate joy that is forced or superficial, success that feels hollow, or the inability to receive the warmth that is genuinely offered. Sometimes we stand in our own shadow, blocking the light.",
    reflectionPrompts: [
      "When did you last experience uncomplicated joy?",
      "What self-imposed clouds block the warmth that's available to you?",
      "How would your life change if you allowed yourself to be as radiant as you are?",
    ],
    affirmation: "I receive joy as my birthright, not as something that must be earned.",
    journeyNarrative: "The Sun itself rules this card — no planetary intermediary, just direct radiance. The sunflowers turn to follow the light, embodying the simple wisdom of orientation toward warmth. The child's open arms receive without grasping. The red banner is vitality unfurled. This is the card of consciousness fully illuminated — not perfect, but present. After The Moon's journey through shadow, The Sun declares that clarity is possible, that warmth exists, that life celebrates itself.",
    relatedCardIds: [18, 17, 0], // Moon, Star, Fool
  },
  20: {
    slug: "judgement",
    uprightTitle: "The Awakening Call",
    uprightDescription: "The trumpet sounds across all realms, and the dead rise — not for condemnation but for recognition. Judgement asks: can you see your life clearly? Can you answer the call that comes from beyond personality, beyond comfort, beyond the identity you've constructed? This is resurrection as remembering.",
    shadowTitle: "The Unanswered Summons",
    shadowDescription: "When Judgement reverses, the call goes unheeded. Self-judgement replaces divine perspective, or the fear of reckoning prevents the awakening that is offered. What resurrection awaits your consent?",
    reflectionPrompts: [
      "What is calling you that you've been refusing to hear?",
      "If you evaluated your life honestly, what would you celebrate? What would you change?",
      "What part of yourself awaits resurrection?",
    ],
    affirmation: "I answer the call of my deepest truth without reservation.",
    journeyNarrative: "Pluto governs Judgement as it governs Death — but where Death is the ending, Judgement is the accounting. The angel Gabriel's trumpet penetrates all barriers, all defenses, all pretenses. The figures rising from their coffins are not zombies but beings remembering their wholeness. The mountains of finality in the background say: there is no going back. The water they stand in speaks of the emotional courage required to face oneself fully. This card is the moment before The World — the last threshold.",
    relatedCardIds: [13, 21, 10], // Death, World, Wheel
  },
  21: {
    slug: "the-world",
    uprightTitle: "The Completed Dance",
    uprightDescription: "The dancer floats within the wreath of accomplishment, holding the wands of achieved mastery. A cycle completes — not as ending but as the platform from which the next great spiral begins. You have arrived at integration: all elements balanced, all journeys honored, all selves acknowledged.",
    shadowTitle: "The Unfinished Circle",
    shadowDescription: "When The World reverses, completion is delayed or feared. Loose ends remain untied, or the threshold of the next cycle feels overwhelming. Perhaps you hesitate because finishing means beginning again, and the unknown awaits.",
    reflectionPrompts: [
      "What cycle in your life feels ready for completion?",
      "What have you integrated that once seemed irreconcilable?",
      "If this chapter closed tomorrow, would you feel complete?",
    ],
    affirmation: "I celebrate completion as the doorway to new beginning.",
    journeyNarrative: "Saturn provides The World's structure — the boundary that defines completion. The wreath of victory is also the zero of The Fool's new beginning: the ouroboros, the circle completing itself. The four fixed signs — eagle, lion, bull, angel — represent the mastery of all elements and all dimensions of being. The dancer's free movement within form is the ultimate statement: liberation not from structure, but through it. This is the quantum state of consciousness that contains all others.",
    relatedCardIds: [0, 10, 14], // Fool, Wheel, Temperance
  },
};

/** Get slug from card name */
export function cardNameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/** Find card by slug */
export function findCardBySlug(slug: string): { card: typeof import("@/data/tarotCards").majorArcana[0]; interpretation: CardInterpretation } | null {
  const entry = Object.entries(cardInterpretations).find(([, interp]) => interp.slug === slug);
  if (!entry) return null;
  const cardId = parseInt(entry[0]);
  const { majorArcana } = require("@/data/tarotCards");
  const card = majorArcana.find((c: any) => c.id === cardId);
  if (!card) return null;
  return { card, interpretation: entry[1] };
}
