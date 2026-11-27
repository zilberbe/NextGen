# NextGen

A personal exam-prep app for one grade 8 student. Android first, Hebrew and English with full RTL, offline-first. She adds her own study material, the app helps turn it into flashcards and quizzes, and spaced repetition (FSRS) schedules the reviews.

- Functional spec (source of truth): [docs/functional-spec-personal-study-app.md](docs/functional-spec-personal-study-app.md)
- Development plan and practices: [docs/development-plan.md](docs/development-plan.md)
- Architecture decisions: [docs/adr/](docs/adr/)
- Current milestone: [M0 Foundations](docs/milestones/m0-foundations.md)

## Repository layout

pnpm workspaces, TypeScript everywhere:

| Path                    | What it is                                               |
| ----------------------- | -------------------------------------------------------- |
| `apps/mobile`           | React Native + Expo app (Android)                        |
| `apps/server`           | Fastify API with Postgres                                |
| `packages/core`         | Domain logic as pure functions (FSRS, queue, streak, XP) |
| `packages/api-contract` | OpenAPI spec and generated types                         |
| `e2e/`                  | Maestro end-to-end flows, run in English and Hebrew      |

These are added during M0; until then the workspace is empty.

## Prerequisites

- Node 26 LTS (see `.nvmrc`)
- pnpm: `npm install -g pnpm`. It switches itself to the version pinned in the `packageManager` field of `package.json`.
- For the mobile app: Android Studio with an Android SDK, an API 34 x86_64 emulator image and JDK 17
- For E2E: the Maestro CLI
- Optional: Docker, for a local Postgres

## Install

```sh
pnpm install
```

## Run

To be filled in as the apps are added in M0.

## Test and check

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
```

Each script runs across all workspaces. `typecheck` and `test` first check that every workspace package defines both scripts, so no package can skip them.

## Contributing

Never commit to `main`: work on a branch and open a pull request. Every PR is reviewed and CI must pass. Commit messages use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `test:`, `tech:`).
