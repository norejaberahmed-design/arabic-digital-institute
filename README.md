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
- Current preview data: SQLite and Prisma. A durable production database is a release blocker; do not substitute a PostgreSQL URL until the schema and auth adapter are migrated together.
- Quality: unit, integration, API-contract, and end-to-end tests.

Technology choices are subject to repository and compatibility review before implementation.

## Safety and privacy principles

- Enforce authentication and authorization on the server.
- Isolate learner data between accounts.
- Collect voice recordings only with explicit learner consent.
- Explain retention and deletion behavior for learner data and recordings.
- Keep secrets out of source control.
- Do not reset or destructively migrate production data without explicit approval.

## Current implementation status

- Public mobile-first web landing page and published-lesson catalog.
- Sixteen original Pre-A1 lessons, including a first-conversation pathway, seeded through Prisma into the current SQLite preview database.
- Email/password learner account flow using Better Auth.
- Authenticated learner progress and activity-attempt API; answer keys are checked server-side.
- Learner dashboard for saved lesson completion.
- Role-protected admin lesson authoring and publishing screen/API.
- Privacy notice, beta terms, and authenticated account deletion with cascading removal of learner progress.
- Expo Android app on Expo SDK 58 / Android API 36 with live lesson catalog, lesson reader, native sign-in/sign-up, secure session storage, quiz attempts, completion sync, learner dashboard, and account deletion (requires `EXPO_PUBLIC_API_URL`).
- CI workflow for type checks and production build.

This is an active launch candidate, not yet a public production release. Remaining release gates: select and implement a durable database with backup/restore, verify deployment health and data persistence, verify Android on a physical device, implement password recovery/email verification, improve audio/speaking, and validate the first unit with beginner learners. The administrator console and native learner sign-in/progress flows are implemented in the current main branch. The AI tutor is planned, not yet implemented.

## Scope disclaimer

The institute must not claim accreditation, official endorsement, or equivalence to an external qualification unless that status is independently obtained and verified.
