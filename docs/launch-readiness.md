# Launch readiness checklist

## Current application capabilities
- Public course landing page and published lesson catalog with twelve original Pre-A1 lessons.
- Role-protected administrator content authoring and publishing screen/API.
- Privacy and terms pages plus authenticated account deletion.
- PostgreSQL/Prisma-backed published lesson content.
- Better Auth email/password registration, login, and logout.
- Authenticated lesson completion and quiz-attempt persistence.
- Server-side quiz answer validation; public lesson responses omit answer keys.
- Learner dashboard showing saved progress.
- Android Expo SDK 58 client supports native registration/sign-in with secure session storage, lesson reading, quiz attempts, completion sync, learner progress dashboard, account deletion, and device-native Arabic pronunciation playback.

## Initial administrator access

New registrations receive the `LEARNER` role and cannot assign themselves administrator permissions. After the first trusted operator account is created, promote it manually in a controlled database session:

```sql
UPDATE "User" SET "role" = 'ADMIN' WHERE "email" = 'admin@example.com';
```

Replace the address with the exact verified operator email. Do not expose a public role-change endpoint.

## Required environment
- `DATABASE_URL`: pooled PostgreSQL connection string for runtime requests.
- `DIRECT_URL`: direct, non-pooled PostgreSQL connection string used by Prisma migrations. For Neon, use its pooled URL for `DATABASE_URL` and direct URL for `DIRECT_URL`.
- `BETTER_AUTH_SECRET`: unique high-entropy secret, at least 32 characters. Generate with `openssl rand -base64 32`.
- `BETTER_AUTH_URL`: canonical public HTTPS URL of the deployed web app.
- `EXPO_PUBLIC_API_URL`: canonical API origin used by the Android app.

Never commit real secrets or production database URLs.

## Preview deployment

1. Create a Neon PostgreSQL project in Frankfurt on the Free plan.
2. Set the pooled connection string as `DATABASE_URL` and the direct connection string as `DIRECT_URL`.
3. Connect the GitHub repository to Render and create a Blueprint from the root `render.yaml` on the preview branch.
4. Review the proposed service. The Blueprint requests one Free web service in Frankfurt; it does not create a Render Postgres database. Render generates `BETTER_AUTH_SECRET`; enter the two Neon connection strings as secret values.
5. The build applies Prisma migrations; the first successful deploy seeds the course.
6. After the web service is live, run `eas build --platform android --profile preview` from the Expo/EAS account to create an installable APK.

This is a public preview configuration, not production hosting. The free Render service sleeps after 15 minutes idle and can take about a minute to wake. Use a paid always-on service and production-grade database/backups before a commercial launch.

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
