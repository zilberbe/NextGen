# Development Plan: Personal Study App

**November 2026**

How the app in [functional-spec-personal-study-app.md](functional-spec-personal-study-app.md) gets built: stack, architecture, milestones and the engineering practices every change follows. Key decisions are recorded as ADRs in [docs/adr](adr/).

## Stack

| Layer | Choice |
|---|---|
| Language | TypeScript everywhere (phone, server, shared logic, later web) |
| Mobile | React Native with Expo, Android first |
| Local database | SQLite on the device, the source of truth for the learning core |
| Shared logic | `packages/core`: ts-fsrs scheduling, daily queue, streak and XP rules, domain types |
| API contract | OpenAPI file in `packages/api-contract`; client and server types generated from it |
| Server | Node + Fastify + Postgres |
| AI | One provider interface on the server; provider is swappable |
| Monorepo | pnpm workspaces |

See [ADR 0001](adr/0001-tech-stack.md).

## Architecture in one paragraph

The phone works fully offline: SQLite holds profile, subjects, sets, cards, FSRS state, reviews, quizzes and stats, and FSRS runs on the device ([ADR 0002](adr/0002-offline-first.md)). Every local write also appends to a change queue that syncs with the server when the network is available. The server stores the synced copy (backup and future web client) and runs everything that needs the network: text extraction from photos and PDFs ([ADR 0003](adr/0003-text-extraction.md)) and AI generation. The server authenticates the single device and never sends identifying details to the LLM ([ADR 0004](adr/0004-auth-and-privacy.md)).

```
apps/
  mobile/          Expo app (Android)
  server/          Fastify API
packages/
  core/            FSRS, queue, streak, XP, domain types (pure, heavily unit-tested)
  api-contract/    OpenAPI spec + generated types
e2e/               Maestro flows, one per user flow, EN + HE
docs/              spec, plan, ADRs
```

## Milestones

Work order follows the student's answers: practice tests and summaries are her daily drivers, so they come before flashcards. Each milestone ends with its user flows covered by E2E tests.

| # | Milestone | Scope | Done when |
|---|---|---|---|
| M0 | Foundations | Monorepo, TS/lint/format, CI, PR review workflow, Maestro on an emulator in CI, OpenAPI skeleton, fake LLM provider | An empty app launches in CI and a sample E2E flow passes |
| M1 | Onboarding & i18n | Opening screen (language, name, grade), profile screen, EN/HE with full RTL, local DB + migrations | Flow 7 step 1 and profile edit pass E2E in EN and HE |
| M2 | Import & summaries | Camera multi-page capture with crop/retake, gallery, PDF; server text extraction; AI summary; preview/edit screen | Flow 1 steps 1-5 and Flow 4 pass E2E (with fake LLM) |
| M3 | Practice tests | Multiple choice and true/false generation, immediate feedback, score screen with weak topics, "add weak points as flashcards" | Flow 1 steps 6-8 and Flow 5 pass E2E |
| M4 | Flashcards & FSRS | Manual cards with images, sets and tags, AI flashcard generation, daily queue, review session, "Keep studying" | Flows 2 and 3 pass E2E; queue < 1 s with 5,000 cards |
| M5 | Progress | Streak with record, XP, stats screen, study-day calendar | Flow 6 passes E2E; streak rules fully unit-tested |
| M6 | Sync & backup | Change-queue sync, conflict handling, export/backup and restore | Offline-then-online E2E passes; restore round-trip test passes |
| M7 | Release | Performance pass, accessibility pass, Play Console internal test track | The student uses it for a week of real study |

Phase 2 and 3 features from the spec are out of scope until M7 is done.

## Engineering practices

### Every change is reviewed

- Nothing is pushed directly to `main`. All work goes through a pull request from a short-lived branch.
- Every PR gets an automated review (Claude `/code-review`, or the Claude GitHub Action) and the owner's approval before merge.
- `main` is protected: CI must be green, branch up to date, no force pushes.
- PRs stay small: one vertical slice or one concern. The PR template asks for what changed, how it was tested, and screenshots in EN and HE for UI changes.

### Testing

| Level | Tool | Covers | Runs |
|---|---|---|---|
| Unit | Vitest | `packages/core`: FSRS wrapper, queue building, streak/XP (time zones, day boundaries, DST), sync merge rules | Every PR |
| Component | React Native Testing Library | Screens and components, RTL layout, i18n keys | Every PR |
| API | Vitest + Fastify inject, Postgres in CI | Endpoints, validation against the OpenAPI contract | Every PR |
| E2E | Maestro on an Android emulator | Every user flow in the spec, in English and Hebrew | Every PR |
| AI quality | Small eval set of sample materials | Real LLM output: correctness, grade-8 level, Hebrew quality | Manually / nightly, not in PR CI |

- **Fake LLM by default.** Tests use recorded AI responses, so they are deterministic, free and work offline. Only the eval set calls a real model.
- **Migration tests.** Every local DB migration is tested by upgrading from each previous schema version with data in it. An app update must never lose data.
- **Backup round-trip test.** Export, wipe, import, compare.
- **Performance budget test.** Seed 5,000 cards; the daily queue must build in under 1 second.
- **Bugs get a regression test** before the fix.

### Privacy (the user is a minor)

- No analytics or third-party crash-reporting SDKs unless explicitly decided in an ADR.
- Only study material and the school grade go to the LLM. A test asserts that outgoing LLM requests contain no name or profile fields.
- Secrets (LLM key, DB credentials) live only on the server, in environment variables, never in the repo or the app bundle. Secret scanning is on.

### i18n, RTL and accessibility

- No hardcoded UI strings: a lint rule enforces translation keys; EN and HE key sets must match (checked in CI).
- UI PRs include EN and HE screenshots; E2E runs in both languages.
- Test with large system font scale; contrast checked against WCAG AA.

### Hygiene

- TypeScript `strict`, ESLint, Prettier; all enforced in CI.
- Conventional commit messages (`feat:`, `fix:`, `docs:` ...).
- Dependabot for dependency updates (`.github/dependabot.yml`). Expo and React Native packages are grouped into one PR; Expo SDK major upgrades are done by hand with `npx expo install --fix`.
- Significant decisions get a short ADR in `docs/adr`.

## Prerequisites on the dev machine

- Node 26 LTS and pnpm (`npm install -g pnpm`; it switches itself to the version pinned in `packageManager`). Node 25 and later no longer bundle corepack.
- Android Studio with an Android SDK and an emulator image, plus JDK 17
- Maestro CLI for running E2E locally (CI runs it regardless)
- Docker (optional) for a local Postgres; CI provides its own

## Open items

- Verify Hebrew support before choosing a text-extraction approach (see [ADR 0003](adr/0003-text-extraction.md)).
- Choose the LLM provider and hosting for the server before M2.
