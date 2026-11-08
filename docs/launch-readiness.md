# Launch readiness checklist

## Current application capabilities
- Public course landing page and published lesson catalog with ten original Pre-A1 lessons.
- Role-protected administrator content authoring and publishing screen/API.
- Privacy and terms pages plus authenticated account deletion.
- PostgreSQL/Prisma-backed published lesson content.
- Better Auth email/password registration, login, and logout.
- Authenticated lesson completion and quiz-attempt persistence.
- Server-side quiz answer validation; public lesson responses omit answer keys.
- Learner dashboard showing saved progress.
- Android Expo SDK 58 client supports native registration/sign-in with secure session storage, lesson reading, quiz attempts, completion sync, learner progress dashboard, and account deletion.

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
5. Seed all seven proficiency levels and ten original Pre-A1 lessons with `pnpm db:seed`.
6. Verify `GET /api/health` returns `200` and `database: connected`.

Do not run migrations against a production database until the target database and backup are confirmed.

## Verification before public launch
- CI passes web/mobile TypeScript checks and Next.js production build.
- Test registration, login, logout, and duplicate-email behavior.
- Test anonymous progress writes return 401.
- Test learner A cannot read or modify learner B's progress.
- Test quiz answer keys are absent from public lesson API responses.
- Test answer attempts and lesson completion survive logout/login.
- Test the Android catalog, native sign-in, cookie restoration, quiz attempts, progress dashboard, and account deletion on a physical device.
- Configure HTTPS, domain, environment secrets, database backups, and error monitoring.
- Promote the first administrator using the controlled SQL step above.
- Test administrator content creation, draft review, publishing, and role restrictions.
- Add more original, reviewed lessons across the planned proficiency levels.

## Not yet included
- Password reset and verified-email delivery.
- Audio assets, speech recording, and AI tutor provider.
- Full Pre-A1 through C2 content library.
- Production hosting and a public domain.

No paid AI provider or paid infrastructure is configured by this branch.
