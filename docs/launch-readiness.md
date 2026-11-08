# Launch readiness checklist

## Current application capabilities
- Public course landing page and lesson catalog.
- PostgreSQL/Prisma-backed published lesson content.
- Better Auth email/password registration, login, and logout.
- Authenticated lesson completion and quiz-attempt persistence.
- Server-side quiz answer validation; public lesson responses omit answer keys.
- Learner dashboard showing saved progress.
- Android Expo client can load the lesson catalog and read lesson content from the web API.

## Initial administrator access

New registrations receive the `LEARNER` role and cannot assign themselves administrator permissions. After the first trusted operator account is created, promote it manually in a controlled database session:

```sql
UPDATE "User" SET "role" = 'ADMIN' WHERE "email" = 'admin@example.com';
```

Replace the address with the exact verified operator email. Do not expose a public role-change endpoint.

## Required environment
- `DATABASE_URL`: PostgreSQL connection string.
- `BETTER_AUTH_SECRET`: unique high-entropy secret, at least 32 characters. Generate with `openssl rand -base64 32`.
- `BETTER_AUTH_URL`: canonical public HTTPS URL of the deployed web app.
- `EXPO_PUBLIC_API_URL`: canonical API origin used by the Android app.

Never commit real secrets or production database URLs.

## Database setup
1. Install dependencies with `pnpm install`.
2. Generate Prisma Client with `pnpm db:generate`.
3. Review the schema change adding Better Auth tables and the learner-to-user relation.
4. Apply the migration in the intended environment with `pnpm db:migrate`.
5. Seed the sample course with `pnpm db:seed`.
6. Verify `GET /api/health` returns `200` and `database: connected`.

Do not run migrations against a production database until the target database and backup are confirmed.

## Verification before public launch
- CI passes web/mobile TypeScript checks and Next.js production build.
- Test registration, login, logout, and duplicate-email behavior.
- Test anonymous progress writes return 401.
- Test learner A cannot read or modify learner B's progress.
- Test quiz answer keys are absent from public lesson API responses.
- Test answer attempts and lesson completion survive logout/login.
- Test mobile catalog and lesson reader on a physical Android phone.
- Configure HTTPS, domain, environment secrets, database backups, and error monitoring.
- Add administrator role provisioning and protected content-management screens.
- Complete mobile authentication and mobile progress synchronization.
- Add more original, reviewed lessons across the planned proficiency levels.

## Not yet included
- Administrator CMS and role management.
- Mobile account sign-in and progress synchronization.
- Password reset and verified-email delivery.
- Audio assets, speech recording, and AI tutor provider.
- Full Pre-A1 through C2 content library.
- Production hosting and a public domain.

No paid AI provider or paid infrastructure is configured by this branch.
