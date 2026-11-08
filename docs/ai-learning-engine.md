# AI Learning Engine

## Capabilities
- **Tutor:** explain lesson content in learner-appropriate English and Arabic.
- **Conversation partner:** run text role-plays and, when supported and consented to, voice conversations.
- **Coach:** identify recurring errors and recommend focused practice.
- **Adaptive practice:** select activities based on demonstrated learner needs while preserving curriculum objectives.
- **Activity assistance:** generate draft activities constrained by approved lesson content.
- **Progress insights:** summarize strengths, gaps, and suggested next steps.

## Curriculum grounding
The AI must receive structured lesson objectives, approved vocabulary, language focus, level, and allowed response patterns. It must not invent official curriculum requirements or silently introduce out-of-scope grammar and vocabulary.

## Safety and quality
- Separate generated suggestions from reviewed, published lesson content.
- Validate generated activities against schemas and curriculum constraints.
- Provide deterministic fallback activities when AI is unavailable.
- Avoid presenting uncertain language judgments as absolute.
- Escalate ambiguous dialect or cultural questions with clear qualification.
- Do not claim a learner has achieved a proficiency level based on a single AI interaction.

## Provider strategy
Begin with a mock provider for development and tests. Keep provider interfaces replaceable. No paid API, subscription, or external AI service may be enabled without explicit approval.

## Voice and privacy
Voice recording must be opt-in. Explain purpose, processing, retention, and deletion. Store only what is necessary, enforce account-level access, and provide a non-recording alternative.
