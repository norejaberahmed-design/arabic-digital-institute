# Arabic Digital Institute

A mobile-first digital institute for teaching contemporary, widely understood Arabic to non-native speakers.

## Product direction

- Start with English-speaking learners and an Android-first experience.
- Teach contemporary standard Arabic in practical, everyday contexts.
- Build listening, speaking, reading, and writing together.
- Keep beginner Arabic text generally unvowelled, with simple Latin-letter pronunciation support.
- Introduce regional dialect variants as clearly labelled extensions, not as the initial core curriculum.
- Use original or properly licensed learning content.

## Learning model

The curriculum is mapped progressively from Pre-A1 through C2, using CEFR as a reference and practical communication tasks as the organizing principle.

Lessons combine context, listening, useful expressions, interactive practice, reading, writing, speaking, feedback, spaced review, and short assessments.

## AI learning capabilities

The planned AI layer includes a tutor, conversation partner, learning coach, adaptive practice, bounded activity generation, and progress insights. AI outputs must remain aligned with approved lesson objectives and curriculum content.

The initial implementation must support a mock AI provider so development and testing do not require paid API usage. Provider integrations and paid services require explicit approval.

## Planned platform

- Learner mobile app: React Native, Expo, and TypeScript.
- Administration web app: Next.js and TypeScript.
- Backend: typed service/API layer.
- Data: PostgreSQL and Prisma.
- Quality: unit, integration, API-contract, and end-to-end tests.

Technology choices are subject to repository and compatibility review before implementation.

## Safety and privacy principles

- Enforce authentication and authorization on the server.
- Isolate learner data between accounts.
- Collect voice recordings only with explicit learner consent.
- Explain retention and deletion behavior for learner data and recordings.
- Keep secrets out of source control.
- Do not reset or destructively migrate production data without explicit approval.

## Development status

This repository is being initialized. Architecture, curriculum, product requirements, and implementation milestones will be documented before expanding the application.

## Scope disclaimer

The institute must not claim accreditation, official endorsement, or equivalence to an external qualification unless that status is independently obtained and verified.
