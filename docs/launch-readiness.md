# Launch Readiness — Preview Status

**Last reviewed:** 9 November 2026  
**Current status:** Preview / not approved for commercial launch.

## Implemented in the repository

- Mobile-first Arabic learning web experience and published Pre-A1 lesson catalog.
- Sixteen original Pre-A1 lesson slugs in the current seed, including the three-session first-conversation pathway.
- Better Auth email/password sign-up, sign-in and sign-out.
- Authenticated learner profile, lesson attempts and progress endpoints.
- Server-side answer checking; public lesson API responses omit section answer keys.
- Learner dashboard and authenticated account deletion.
- Role-checked admin lesson creation and publication controls.
- Expo SDK 58 / React Native Android app with account, lesson catalog, lesson reader, secure session storage and progress flows.
- GitHub Actions verifies Prisma schema generation, SQLite seed, web/mobile TypeScript, Expo Android export, Next production build and an integration smoke test.

## Critical truth about data persistence

The current Prisma schema at `packages/database/prisma/schema.prisma` uses **SQLite**. Better Auth's Prisma adapter is configured with provider `sqlite`. The Render Blueprint creates a free Node web service and does not attach a persistent disk or provision a database.

The preview currently uses a SQLite file path. Files on an ephemeral service filesystem can be lost when the service is replaced or restarted. Therefore:
- Do not collect real learner records or promise durable progress on this preview.
- Do not put a PostgreSQL connection string into the current SQLite-generated application.
- Do not run `db:push` or seed automatically against a future production database at every process start.
- Do not migrate or reset data until the target, backup, restore test and migration plan are approved.

A durable production database is a **P0 launch blocker**. The next engineering decision is to select a supported durable database and migrate Prisma schema, auth adapter, migrations, environment configuration, CI, and documentation together. The decision must include a free-tier/cost review and explicit approval before enabling any paid plan.

## Current environment

The web preview is hosted on Render:
- URL: https://adi-arabic-institute-preview-fzjr.onrender.com
- Service: `adi-arabic-institute-preview-fzjr`
- Region: Frankfurt
- Plan: Free
- Blueprint branch: `main`

The Render free service may sleep when idle. This is acceptable for a development preview, not for a commercial service-level commitment.

## Required environment variables

- `DATABASE_URL`: currently a SQLite URL for preview only. This must be changed only as part of the reviewed durable-database migration.
- `BETTER_AUTH_SECRET`: unique random secret, at least 32 characters.
- `BETTER_AUTH_URL`: canonical HTTPS origin of the web service.
- `EXPO_PUBLIC_API_URL`: HTTPS API origin compiled into the Android client.

Never commit real secrets or production database URLs. Do not expose secret values in issue comments, logs, screenshots or chat.

## Verified release evidence

- PR #10, which adds the three first-conversation lessons, passed GitHub Actions and was merged to `main`.
- Render reports deployment `dep-dbovqqqvcj2c73f1s8ag` for commit `dcf67e758db4f1c4a73b8b6224e6ae6c3250796f` as `live` (9 November 2026, 17:09 UTC). This is a live preview deployment, not production readiness; its database remains SQLite at `file:/tmp/adi.db` on an ephemeral filesystem.
- The CI smoke test covers health, published lessons, answer-key privacy, authentication, attempts, saved progress, cross-account isolation, learner denial from admin APIs and account deletion.
- The expanded smoke test now also checks the three first-conversation lesson slugs and sample answer submissions; its result must pass in the audit PR before it is treated as verified.

## Before real learner onboarding

### P0 — Data and deployment
- [ ] Choose durable database with cost and region review.
- [ ] Align Prisma schema, Better Auth adapter, environment, migrations and CI.
- [ ] Create backup and successfully restore it in a test environment.
- [ ] Confirm current Render deploy is live and health endpoint returns 200.
- [ ] Verify progress survives deploy/restart and a fresh sign-in.
- [ ] Add a rollback plan; do not destructively reset any database.

### P1 — Account and platform security
- [ ] Password reset and verified-email flow.
- [ ] Rate limiting for sign-in, sign-up and write APIs.
- [ ] Central request/content validation.
- [ ] CSRF/origin behavior tested for cookie-authenticated writes.
- [ ] Security headers and dependency scanning.
- [ ] Admin review/publish workflow and privileged-action audit trail.
- [ ] Account export/deletion and retention policy reviewed.

### P1 — Learning quality
- [ ] Arabic language reviewer signs off on all published content.
- [ ] Native-speaker audio rights and provenance recorded.
- [ ] Web and Android support the required activity types.
- [ ] Progress resume works after interruption and sign-in.
- [ ] Completion reflects required learning evidence, not only a button press.
- [ ] First unit tested with absolute beginners and revised from observations.

### P2 — Commercial readiness
- [ ] Physical Android device QA and Play Store preparation.
- [ ] Accessibility, performance and security review.
- [ ] Error monitoring, support contact and service-status process.
- [ ] Privacy and terms reviewed for the actual operating entity and launch regions.
- [ ] Evidence-based pricing test only after learner value and retention are demonstrated.

## Not yet implemented / do not advertise as available

- Production AI tutor or AI conversation partner.
- AI-generated adaptive curriculum.
- Expert phonetic pronunciation scoring.
- Complete native-speaker audio library.
- Full Pre-A1 through C2 course library.
- Accredited CEFR certification or official institutional endorsement.
- Production-grade uptime, backup/restore and durable student data.

## Safe preview use

Use the preview for internal demonstrations and non-sensitive testing only. Tell testers that it is a beta preview and that progress may not be durable. Never request sensitive personal information. The privacy notice and terms remain provisional until reviewed for the real operator and hosting/data providers.
