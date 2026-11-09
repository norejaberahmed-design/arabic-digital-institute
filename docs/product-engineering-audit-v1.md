# Product and Engineering Audit — 9 November 2026

**Repository:** `norejaberahmed-design/arabic-digital-institute`  
**Reviewed baseline:** `main` after PR #10 merge (`dcf67e758db4f1c4a73b8b6224e6ae6c3250796f`)  
**Purpose:** Establish an evidence-based path from preview prototype to a trustworthy, competitive Arabic-learning product.

## Executive decision

The project has a useful full-stack foundation and a clear educational direction. It is **not production-ready** and should not yet be marketed as a complete AI-powered language institute.

The immediate release blocker is data durability: the Prisma schema and Better Auth adapter use SQLite, while parts of the product documentation still describe PostgreSQL. The current Render Blueprint does not attach a persistent disk or provision a durable database. A SQLite file under an ephemeral filesystem must be treated as disposable preview data.

Do not solve this by blindly changing providers or running destructive migrations. First choose and document the durable database target, create a backup/restore plan, then implement and test a non-destructive migration path.

## Evidence reviewed

The review inspected the repository tree and the current source for:
- web and mobile app entry points, lesson catalog and lesson player;
- authentication configuration and web/native auth clients;
- learner progress, lesson, admin and account API routes;
- Prisma schema, database package and seed logic;
- GitHub Actions workflow and smoke test;
- Render Blueprint and current service/deployment metadata;
- curriculum, academic, AI, architecture, privacy, terms and launch-readiness documentation.

The repository currently contains 59 tracked files. The stack in source is Next.js 15.5.29, React 19, Expo SDK 58 / React Native 0.88, Better Auth 1.7, Prisma 6.19, and SQLite. PR #10 passed CI and was merged. Its Render deployment was still building at the time of this review; do not describe the new release as live until Render confirms it.

## Current strengths

1. **Clear initial audience and language policy:** English-speaking beginners, broadly understood contemporary Arabic, progressive reduction of English support, and limited beginner diacritics.
2. **Real full-stack foundation:** web catalog, lesson detail, Better Auth accounts, learner profile, server-checked attempts, progress dashboard, account deletion, and role-checked admin API.
3. **Answer-key protection:** public lesson responses remove top-level answer keys; attempts are checked on the server.
4. **Account isolation baseline:** progress queries are scoped to the authenticated learner; the CI smoke test creates two learners and checks isolation.
5. **Android direction:** Expo app has account, lesson catalog, lesson reading, secure session storage, progress and account deletion flows.
6. **Responsible AI scope:** the product documentation correctly specifies a mock provider first, grounded AI, review gates, and no paid provider without approval.
7. **Original curriculum:** the seed includes 16 unique Pre-A1 lesson slugs after the first-conversation sessions were added.

## Findings by severity

### P0 — Must resolve before real learner data or commercial launch

**P0.1 — Persistence and database configuration are inconsistent**
- Source of truth: `packages/database/prisma/schema.prisma` declares `provider = "sqlite"`.
- `apps/web/lib/auth.ts` configures Better Auth's Prisma adapter as SQLite.
- `README.md` and the former launch guide described PostgreSQL/Neon as if it were the current implementation.
- `render.yaml` creates a free web service but no persistent disk or database service.
- The current startup command runs `db:push` and `db:seed` on each start.
- Consequence: ephemeral preview data can disappear on restart/redeploy, and a PostgreSQL URL cannot safely be substituted into a SQLite-generated Prisma client.

**Required action:** keep preview data clearly labelled as temporary; select a durable database; align Prisma provider, auth adapter, environment variables, migration history, docs, and CI in one reviewed change. Take and verify a backup before any data migration. Never run schema push or seed automatically against production on every process start.

**P0.2 — Release evidence is incomplete**
- GitHub CI covers schema validation, Prisma generation, SQLite sync/seed, TypeScript checks, Expo compatibility/export, Next build, and a smoke test.
- It does not prove Android behavior on physical devices, production database durability, email delivery, backup restore, or deployment health after the latest commit.
- Render deployment for the merged first-conversation release was still in progress at audit time.

**Required action:** require a successful deploy, HTTP health check, real account journey, cross-account isolation test, restart/restore test, and Android physical-device test before public launch.

### P1 — High priority before onboarding external learners

**P1.1 — Authentication lifecycle is incomplete**
- Email/password registration and login exist.
- Password reset and verified-email delivery are not implemented.
- No user-facing recovery path is documented.

**Required action:** implement verified email and password recovery with expiring, single-use tokens, rate limits, anti-enumeration responses, and end-to-end tests.

**P1.2 — Progress is not yet a robust learning record**
- The learner can mark a lesson complete without satisfying required learning outcomes.
- Position saving exists in the API but the current web lesson player does not consistently restore/save a lesson position.
- There is no spaced-repetition schedule, mastery model, or longitudinal skill evidence yet.

**Required action:** define required vs optional activities per lesson, mastery rules, resumable progress, review scheduling, and assessment records. Completion must reflect learning evidence, not merely a button click.

**P1.3 — Admin publishing needs editorial governance**
- The admin API checks the user's database role.
- The interface supports creating a lesson and toggling publication state.
- There is no complete author → review → approval workflow, content version history, reviewer attribution, or privileged-action audit trail.
- The API's content validator does not currently accept all lesson section types used by the product (for example `letter-studio` and `text-input`).

**Required action:** define supported content schemas centrally; add schema validation and preview; implement draft/review/approved/published transitions; record who changed what and when.

**P1.4 — API abuse and security hardening**
- Input bounds and authenticated checks exist on important endpoints.
- The reviewed API routes do not show a shared rate-limiting layer.
- There is no documented security-header, dependency-update, vulnerability triage, or incident-response policy.
- Admin content changes and account deletion need auditable operational controls.

**Required action:** add rate limits to auth and write endpoints; validate request schemas centrally; test origin/CSRF behavior for cookie-authenticated mutations; add security headers, dependency scanning, audit events, and operational runbooks.

**P1.5 — Android and web feature parity is incomplete**
- Native lesson rendering handles dialogue, vocabulary and multiple-choice.
- It does not yet render the web letter studio and Arabic text-input builder.
- The Android app must be tested on a physical Android phone, including session restore and background/resume behavior.

**Required action:** define parity by feature, implement the highest-value learning interactions natively, and publish an Android preview build only after physical-device QA.

### P2 — Competitive learning quality

**P2.1 — Audio quality**
- The web app currently relies on browser speech synthesis for Arabic playback; voice availability and quality vary by device.
- Speech recognition compares a transcript with a target phrase. It is not expert phonetic assessment.
- Native-speaker audio, speaker provenance, dialect/register labels, and audio QA are not yet a complete content pipeline.

**Required action:** commission or obtain properly licensed native-speaker recordings, store transcript and provenance metadata, support replay/slow playback, and keep transcript recognition distinct from pronunciation scoring.

**P2.2 — AI tutor is planned, not implemented**
- Current docs describe tutor, conversation partner, coach and adaptive practice as planned capabilities.
- No production AI provider or complete tutor experience is connected.

**Required action:** first build a deterministic, curriculum-grounded mock tutor and evaluation suite. Only later consider a provider adapter, cost controls, privacy disclosure, and explicit approval for any paid API.

**P2.3 — The curriculum needs evidence, not only coverage**
- The CEFR progression is a planning reference, not accreditation.
- The current first-conversation sequence is a useful prototype but needs expert Arabic review, audio review and beginner pilot testing.
- The first-conversation phrases include a simplified masculine-address transliteration for `ما اسمك؟`; this must be labelled as a common reading, not a universal spoken form.

**Required action:** maintain objective-to-activity mapping, answer/rubric review, language-review signoff, accessibility review, and small beginner pilots. Track completion and retention alongside demonstrated skill.

### P3 — Product maturity and growth

- Add onboarding and a placement diagnostic that does not assume zero knowledge.
- Add a learner goal (travel, family, work, study) and adapt scenarios without changing the shared Arabic foundation.
- Add review queue, learning streaks only if they support healthy habits, weekly progress summaries, and clear next steps.
- Add accessibility QA (screen readers, reduced motion, contrast, captions, text alternatives).
- Add product analytics with privacy-minimizing events, consent and retention limits.
- Add support contact, deletion/export process, service status, and clear beta labeling.
- Add a pricing experiment only after retention and learning outcomes show real value; do not add paid infrastructure before the business case is demonstrated.

## Competitor benchmark and implications

This is a product-pattern benchmark based on public official product pages, not a claim that we have reverse-engineered proprietary systems.

| Competitor | Publicly described strengths | ADI implication |
|---|---|---|
| Duolingo Arabic | Short lessons, habit loops, gamified progression, four skills and personalization | Build short sessions and healthy return loops, but optimize for useful Arabic communication rather than points alone |
| Busuu | Expert-built CEFR courses, bite-sized lessons, checkpoints, AI grammar support and community corrections | Need clear can-do outcomes, checkpoint assessments, and a future reviewed feedback/community layer |
| Mango Languages | Conversation-first lessons, native-speaker audio, phrase building, cultural notes and spaced review | Make authentic dialogue and high-quality human audio central, not optional decoration |
| Memrise | Arabic learning, AI tutor/conversation practice, level-matched video and expert-created lessons | A future ADI tutor must be grounded, measurable, transparent and useful—not just an open-ended chatbot |
| AlifBee | Arabic-focused multi-level curriculum, alphabet and writing instruction, four skills, AI personalization, adaptive tests and spaced review | A serious direct competitor; ADI must differentiate through better beginner sequencing, transparent skill evidence, careful language policy and reliable AI grounding |
| Kaleela | MSA plus multiple regional dialect courses, alphabet instruction, audio, pronunciation practice and CEFR-guided exercises | Regional dialect choice is a market expectation; ADI can start with shared Arabic but should make dialect comparison a deliberate later pathway |
| Arabic Unlocked | Guided levels, alphabet and short vowels, flashcards/audio, scenario vocabulary, spaced repetition and progress motivation | Strong script-to-reading progression and review are table stakes, not unique features |

Official references:
- Duolingo Arabic: https://en.duolingo.com/course/ar/en
- Busuu course method: https://help.busuu.com/hc/en-us/articles/15936615354641-What-is-Busuu
- Busuu CEFR course structure: https://www.busuu.com/en/it-works/courses
- Mango Arabic (MSA): https://www.mangolanguages.com/available-languages/modern-standard-arabic-msa
- Mango learning method: https://www.mangolanguages.com/how-it-works
- Memrise Arabic: https://www.memrise.com/en-us/learn-arabic
- AlifBee Arabic learning: https://www.alifbee.com/en/
- AlifBee AI learning updates: https://blog.alifbee.com/news-alifbee-new-ai-features-arabic-learning/
- Kaleela course overview: https://kaleela.com/en/about-us/
- Arabic Unlocked: https://arabicunlocked.com/

## Recommended differentiation

Do not try to out-Duolingo Duolingo at gamification or out-Memrise Memrise at generic AI chat. ADI should own a clearer niche:

1. **Arabic literacy made approachable:** explain letter joining, direction, sound contrasts, and vowel marks progressively.
2. **One coherent Arabic foundation:** broadly understood contemporary Arabic, with regional variants clearly labelled and compared when useful.
3. **Conversation and script taught together—but not confused:** allow a learner to speak a useful phrase before they have decoded every letter, while explicitly teaching the script strand.
4. **Transparent AI teacher:** explains, hints and role-plays only within approved content; shows uncertainty and never pretends transcript matching is accent scoring.
5. **Mobile-first bilingual learning:** English scaffolding fades based on demonstrated comprehension, not a fixed timer.
6. **Evidence of progress:** show what a learner can actually do in listening, speaking, reading and writing.

## Delivery plan

### Gate 0 — Stabilize and tell the truth
- Keep the preview clearly marked as a preview.
- Correct stale docs and verify the current Render deployment.
- Expand smoke tests to assert all three first-conversation lessons are seeded and answer keys remain private.
- Decide the durable database target without touching production data.

### Gate 1 — Reliable full-stack core
- Durable database + migration + backup/restore.
- Authentication recovery and email verification.
- Progress resume and mastery-based completion.
- API rate limits, centralized validation, audit log.
- CI coverage for account, admin, lesson, isolation and deletion journeys.

### Gate 2 — Teaching quality
- Expert-reviewed Pre-A1 unit and native-speaker audio.
- Real role-play activity and writing input on web and Android.
- Review scheduler and learner progress evidence.
- Beginner pilot with revisions.

### Gate 3 — Differentiating intelligence
- Deterministic tutor prototype and golden evaluation cases.
- Adaptive practice from observed errors.
- Provider-neutral AI integration only after approval and cost/privacy review.

### Gate 4 — Public launch
- Physical Android QA, performance/accessibility/security review.
- Verified backup restore, monitoring, support and privacy/legal review.
- Clear beta/production status, pricing test, and launch plan.

## Release scorecard (audit baseline)

| Area | Status |
|---|---|
| Product direction | Defined |
| Web learner foundation | Implemented prototype |
| Android foundation | Implemented; physical-device verification pending |
| Authentication | Partial |
| Lesson delivery | Implemented for supported activity types |
| Progress / mastery | Partial |
| Admin authoring | Basic; governance incomplete |
| AI tutor | Planned, not implemented |
| Native-speaker audio | Not complete |
| Durable production data | Blocked |
| Production operations | Blocked |
| Commercial launch readiness | Not ready |

## Non-negotiable engineering rules

- No replacement project; evolve the existing repository.
- No destructive database reset or unreviewed migration.
- No production secrets in source code or chat.
- No paid service/API without explicit approval.
- No claim of AI, 3D, accreditation, speech scoring, persistence, or production readiness unless the implementation and evidence support it.
- Every feature ships through a small PR with tests, review, deployment verification, and a rollback path.
