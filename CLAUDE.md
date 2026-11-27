# NextGen - Personal Study App

Exam-prep app for a single student (grade 8). Android first, Hebrew + English with full RTL, offline-first.

- Spec: `docs/functional-spec-personal-study-app.md` - the source of truth. If this file and the spec disagree, the spec wins. Ask before changing the spec, the data model or the API shape.
- Plan and practices: `docs/development-plan.md`
- Decisions: `docs/adr/` - read the relevant ADR before changing architecture; add a new ADR for significant decisions

## Stack

TypeScript everywhere. pnpm workspaces: `apps/mobile` (React Native + Expo), `apps/server` (Fastify + Postgres), `packages/core` (FSRS, queue, streak, XP - pure functions), `packages/api-contract` (OpenAPI). E2E: Maestro flows in `e2e/`.

## Rules

- Never commit to `main`. Work on a branch, open a PR; every PR is reviewed and CI must pass.
- Commit messages use Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `tech:`). No Co-Authored-By trailer.
- The phone's SQLite DB is the source of truth for learning data (ADR 0002). Domain logic belongs in `packages/core`, not in screens or route handlers.
- Every new behavior gets tests at the right level (see the testing table in the plan). Each user flow has a Maestro E2E flow, run in EN and HE.
- Streak/XP/FSRS/sync code needs unit tests for day boundaries, time zones and DST. Losing a streak to a bug is a severe failure.
- Every local DB schema change ships with a migration and a migration test.
- No hardcoded UI strings: use i18n keys and add both `en` and `he` translations. Use logical layout props (`start`/`end`), never `left`/`right`.
- Privacy: the user is a minor. Never send her name or profile fields to the LLM - only material text/images and the grade. No analytics or tracking SDKs. No secrets in the repo or app bundle.
- Every AI generation call includes the school grade. Never drop it from a prompt.
- Spaced repetition uses `ts-fsrs`. Do not write your own scheduling algorithm.
- Tests use the fake LLM provider; only the eval set calls a real model.

## Scope

- Follow the build order in the plan. Do not start Phase 2 or Phase 3 items until asked.
- Out of scope: community or set sharing, ready-made content, AI podcasts, subscriptions, payments, ads.
- Do not copy content, sets or questions from Vaia/StudySmarter. All content comes from her own material or manual entry.
- No parent/admin screen. The student manages everything herself (she has her own profile screen: name and grade).

## Working style

- Small steps: one feature or fix at a time. Say what you are about to do before doing it.
- Plan first for anything touching more than a couple of files, and wait for a go-ahead on the plan.
- Don't add a dependency without saying why.
- When the spec is unclear, ask. Do not guess.

## How to run

Fill in during M0 scaffolding and keep current whenever commands change.

- Install: TBD
- Run app (Android emulator/device): TBD
- Run server: TBD
- Run tests: TBD
- Lint/format: TBD
