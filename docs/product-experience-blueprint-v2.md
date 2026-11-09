# ADI Product Experience Blueprint v2

## Product promise
A beautiful, calm, mobile-first Arabic-learning institute for English-speaking beginners. The product should help learners use Arabic—not merely memorize letter names or collect points.

## Learning standards and boundaries
- Use the Council of Europe's CEFR Companion Volume as a design reference, including Pre-A1 and separate reception, production, interaction and phonological competence. Do not claim formal CEFR accreditation or equivalence.
- Use ACTFL Proficiency Guidelines 2024 as a complementary design reference for real-world listening, speaking, reading and writing. Do not reproduce protected descriptor text or imply certification.
- Design around measurable learner outcomes and real-world tasks.
- Assess the four skills separately. A quiz score or speech transcript is not proof of communicative or phonetic mastery.
- Write original Arabic learning content; do not copy proprietary course sequences or exercise banks.

## Product design principles
1. Calm, simple, colorful and consistent; color supports navigation and memory but never carries meaning alone.
2. Mobile-first, one-handed, responsive, accessible, RTL-correct and readable on mid-range Android devices.
3. Every screen has one primary learning action and a clear next step.
4. Beginner instructions use concise English support with unvowelled Arabic examples unless vowel marks are the lesson objective.
5. Each letter lesson includes isolated, initial, medial and final forms; connection behavior; sound target; articulation guidance; meaningful examples; recognition and writing practice.
6. Audio is a first-class learning asset: use consented, attributed, quality-reviewed recordings from qualified native Arabic speakers. Never use browser TTS or generic machine voices as the authoritative pronunciation model.
7. AI supports explanation and adaptive practice but may not invent linguistic facts or mark pronunciation correct without validated phonetic evidence.
8. Use gentle progress feedback and spaced retrieval, not manipulative streak pressure.

## Competitor-inspired capabilities (original implementation)
- Short, low-friction practice loops and gentle progress feedback (inspired by Duolingo's engagement model).
- Structured adult learning path and practical dialogues (inspired by Babbel).
- Contextual native-speaker listening and pronunciation work (inspired by Memrise/Pimsleur).
- Skill-specific progress and review (guided by CEFR/ACTFL principles).
- Arabic-specific letter joining, script direction, sound contrasts, and register/dialect explanations.
- Do not copy competitor UI, branding, wording, artwork, audio, or proprietary content.

## Learning architecture
### Pre-A1
- Script orientation and right-to-left literacy.
- 28 letters and their four positional forms, including six non-connecting letters.
- Short-vowel awareness introduced intentionally rather than overwhelming the first lesson.
- Controlled decoding, handwriting, and high-frequency expressions.
- First real exchange with listening, speaking, reading and writing evidence.

### A1 onward
- Everyday communicative missions: introductions, family, time, food, places, shopping, transport and daily routines.
- Spiral vocabulary and structures; retrieve previously learned language.
- Move from recognition to supported recall to independent communication.

## Pronunciation quality system
- Maintain an audio asset registry with exact target text, dialect/register, speaker consent, speaker provenance, recording date, reviewer, quality status, license/usage rights and file checksum.
- Record isolated phonemes, syllables and words in context, with normal and carefully checked slowed versions.
- Review audio with at least one qualified Arabic phonetics/teaching reviewer; use a second reviewer for difficult contrasts.
- Never synthesize a sound when the reference recording is missing.
- Separate ASR transcript matching from phoneme-level pronunciation scoring.
- Do not show numeric pronunciation scores until the speech model has been validated against human-rated learner recordings across relevant accents and devices.
- For Arabic, explicitly train difficult English-speaker contrasts such as ح/ه, ع/ء, خ/ه, ص/س, ط/ت, ق/ك and interdentals ث/ذ/ظ.

## Letter studio acceptance criteria
- All 28 letters displayed in a responsive searchable grid.
- Four forms shown correctly for each letter.
- Six non-connecting letters identified: ا د ذ ر ز و.
- Clear note that color is a visual aid, not a phonetic classification.
- Every activity has keyboard/touch accessibility and clear feedback.
- Audio controls appear only when reviewed audio assets exist.
- Arabic language review required before the lesson is labelled production-ready.

## Release quality gates
1. Curriculum author and Arabic language reviewer approve the lesson.
2. English instructions are edited for beginner comprehension.
3. Native-speaker audio has documented consent, rights and review.
4. Activities work on mobile and desktop with keyboard and touch.
5. Correct/incorrect paths and progress persistence are tested.
6. Accessibility, RTL, contrast, reduced motion and Android performance are checked.
7. Pilot learners can complete the unit and demonstrate the target outcomes.
8. Product copy accurately describes implemented capabilities.

## Roadmap
- Stage 1: visual system, alphabet explorer, letter joining, accessible practice.
- Stage 2: verified human audio and sound contrast studio.
- Stage 3: complete Pre-A1 unit and first conversation path.
- Stage 4: learner skill profile, review scheduling and progress evidence.
- Stage 5: AI tutor and speech assessment only after provider, cost, privacy and validation approval.
- Stage 6: A1 curriculum, teacher review workflow and public beta.
