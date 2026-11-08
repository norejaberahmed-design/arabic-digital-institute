# Proposed Platform Architecture

## Product surfaces
- Learner application: React Native, Expo, and TypeScript; Android-first, with iOS support planned.
- Administration application: Next.js and TypeScript for curriculum, content, learner support, and operational controls.

## Backend boundaries
Use a typed API/service layer. Keep business rules outside UI components. Separate modules for identity, learner profiles, curriculum, lessons, activities, attempts, progress, review scheduling, AI orchestration, media metadata, and administration.

## Data
PostgreSQL is the planned primary relational database, with Prisma as the initial data-access layer. Define migrations deliberately; never reset or destructively replace existing data as a routine development step.

## Identity and authorization
Choose the authentication implementation after reviewing compatibility and security requirements. Enforce authorization on the server for every protected operation. Define roles and permissions for learners, instructors, content editors, and administrators.

## Tenant and account isolation
A learner may access only their own private profile, attempts, recordings, and progress. Administrative access must be role-limited and auditable. Tests must verify cross-account access is denied.

## Media
Store media metadata and provenance separately from lesson content. Use accessible audio controls, captions, and transcripts. Storage provider selection is deferred until cost, privacy, and operational constraints are reviewed.

## Quality
Require unit tests for domain rules, integration tests for persistence and authorization, API contract tests, and end-to-end tests for critical learner journeys.

## Operational constraints
- Keep secrets out of source control.
- Start with local/mock integrations where practical.
- No paid infrastructure or API usage without explicit approval.
- No production deployment, destructive migration, or data deletion without explicit approval.
- Document backup, restore, and incident procedures before production use.
