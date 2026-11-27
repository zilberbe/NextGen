# M0: Foundations

**November 2026** · Part of the [development plan](../development-plan.md)

## Goal

Set up the repository, tooling and pipelines so that every later milestone starts from a working, tested and reviewed baseline. M0 ships no user features.

**Done when:** an empty app launches on an Android emulator in CI and a sample Maestro E2E flow passes, in both English and Hebrew, on every pull request to `main`.

## Prerequisites (dev machine)

- [x] Node 26 LTS installed (replaces Node 16) and pnpm installed globally; pnpm switches itself to the version in the `packageManager` field
- [ ] Android Studio with an Android SDK, an emulator image (API 34, x86_64) and JDK 17
- [ ] Maestro CLI installed and running against the local emulator
- [ ] Docker for a local Postgres (optional)

## Work breakdown

Each section below is roughly one pull request, in the suggested order. Each one goes through the normal PR flow: branch, automated review, CI green, merge.

### 1. Monorepo skeleton

- [x] Root `package.json` with `packageManager` pinned to a pnpm version, `engines.node` set to `>=26`
- [x] `pnpm-workspace.yaml` listing `apps/*` and `packages/*`
- [x] `.nvmrc` set to 26 (read by nvm and `actions/setup-node`, so no separate `.node-version`)
- [x] `.gitignore`, `.gitattributes` (LF line endings, since the repo is edited on Windows), `.editorconfig`
- [x] Root scripts: `lint`, `format`, `format:check`, `typecheck`, `test`, which run across all workspaces
- [x] Short `README.md`: what the project is, prerequisites, how to install, run and test

**Acceptance:** `pnpm install` and `pnpm typecheck` succeed from a clean clone.

### 2. TypeScript, lint and format

- [ ] Shared `tsconfig.base.json` with `strict: true`, and a `tsconfig.json` in each workspace that extends it
- [ ] ESLint (flat config) with the TypeScript, React and React Native rules
- [ ] Lint rule that bans `left`/`right` style props (`marginLeft`, `paddingRight`, `left:` and so on) in favor of `start`/`end`
- [ ] Prettier config; ESLint and Prettier do not fight each other (`eslint-config-prettier`)
- [ ] Optional: a pre-commit hook (lint-staged) for formatting only. CI is the real gate.

**Acceptance:** `pnpm lint` and `pnpm format:check` pass, and a file with `marginLeft` fails lint.

### 3. `packages/core` scaffold

- [ ] Package with Vitest set up and a `src/index.ts` that exports domain types only (no logic yet)
- [ ] Add `ts-fsrs` as a dependency and write one smoke test that schedules a card, to prove the library builds and runs in this setup
- [ ] Time helpers placeholder with a first test that pins the time zone (`Asia/Jerusalem`) and crosses a DST change. This sets the pattern for the M5 streak tests.

**Acceptance:** `pnpm --filter core test` passes and the package is importable from `apps/mobile` and `apps/server`.

### 4. `packages/api-contract` skeleton

- [ ] `openapi.yaml` (OpenAPI 3.1) with `GET /health` and the device-token security scheme from [ADR 0004](../adr/0004-auth-and-privacy.md) declared, but not used by any endpoint yet
- [ ] Type generation (`openapi-typescript`) into a generated file that is committed or built, decided once and written down
- [ ] Contract lint (Redocly or Spectral) as a script
- [ ] CI check that the generated types are up to date with the spec

**Acceptance:** changing `openapi.yaml` without regenerating fails CI.

### 5. `apps/server` skeleton

- [ ] Fastify app with `GET /health`, typed from `packages/api-contract`
- [ ] Config read from environment variables only; a committed `.env.example` holds names and no values
- [ ] Logger configured to drop request bodies ([ADR 0004](../adr/0004-auth-and-privacy.md))
- [ ] Postgres connection and a migration tool (for example `node-pg-migrate`) with one empty initial migration
- [ ] **LLM provider interface** with a **fake provider** that returns recorded responses from fixture files. The real provider is not written in M0.
- [ ] **Privacy guard test:** a test that runs a request through the provider interface and asserts the outgoing payload has no name or profile fields. In M0 it runs against the fake provider and is a placeholder for the real check.
- [ ] API tests with Vitest and `fastify.inject`, plus one test that validates `/health` against the OpenAPI contract

**Acceptance:** `pnpm --filter server test` passes against a Postgres instance, both locally and in CI.

### 6. `apps/mobile` skeleton

- [ ] Expo app (latest SDK, TypeScript template), Android only for now
- [ ] One placeholder screen that shows the app name from a translation key, so the i18n pipe exists from day one
- [ ] i18n library set up with `en.json` and `he.json`, and RTL switching when Hebrew is selected (`I18nManager`). Only the placeholder string is translated; the full i18n work is M1.
- [ ] Script and CI check that the `en` and `he` key sets match
- [ ] `testID`s on the placeholder screen for Maestro
- [ ] React Native Testing Library set up with one component test
- [ ] Local Android build without EAS (`expo prebuild` + Gradle `assembleRelease` or a debug build), so CI can build an APK without cloud credentials
- [ ] Debug-only way to start in Hebrew (launch argument or deep link) so E2E can run both languages

**Acceptance:** `pnpm --filter mobile android` runs the app on the local emulator, in English and in Hebrew with RTL.

### 7. Sample Maestro flow

- [ ] `e2e/` folder with a shared config and one flow, `app-launches.yaml`: launch the app, assert the placeholder screen is visible
- [ ] The flow runs twice, once per language, by passing the language as a parameter, and asserts the translated text in each
- [ ] A small README in `e2e/` on how to run the flows locally

**Acceptance:** `maestro test e2e/` passes locally in both languages.

### 8. CI pipeline

GitHub Actions workflow in `.github/workflows/ci.yml`, triggered on `pull_request` to `main` and `push` to `main`.

- [ ] **checks** job: install with pnpm cache, then `lint`, `format:check`, `typecheck`, the i18n key check and the contract freshness check
- [ ] **unit** job: Vitest for `packages/core` and component tests for `apps/mobile`
- [ ] **api** job: server tests with a Postgres service container
- [ ] **e2e** job: build the APK, boot an Android emulator (`reactivecircus/android-emulator-runner` with KVM enabled), install the app, run Maestro in EN and HE, and upload screenshots and logs as artifacts when it fails
- [ ] Cache Gradle and the AVD snapshot so the E2E job stays within a reasonable time (aim for under 15 minutes)
- [ ] `concurrency` setting that cancels older runs on the same PR
- [ ] Pin actions to versions; Dependabot already updates them

**Acceptance:** a PR with a deliberately broken test shows a red check, and the fix turns it green.

### 9. Review workflow and repo protection

- [ ] PR template (`.github/pull_request_template.md`), already written
- [ ] Dependabot config (`.github/dependabot.yml`), already written. Consider also ignoring majors for `react-native`, `react` and `expo-*`, since SDK upgrades are done by hand.
- [ ] Automated review on PRs: decide between running `/code-review` by hand and the Claude GitHub Action. If the Action is chosen, its API key goes in repository secrets only.
- [ ] Ruleset on `main`: require a pull request, require the CI status checks, require the branch to be up to date, block force pushes and deletions. Set this up after CI has run once, so the checks appear in the list.
- [ ] Required approvals: GitHub does not let you approve your own PR, so either leave approvals off or allow yourself to bypass them
- [ ] Turn on secret scanning and push protection
- [ ] Optional: a `CODEOWNERS` file

**Acceptance:** a direct push to `main` is rejected, and a PR with failing CI cannot be merged.

## Out of scope for M0

- Any user-facing screen beyond the placeholder (onboarding is M1)
- Local SQLite database and migrations (M1)
- Real LLM provider, text extraction and AI generation (M2)
- Device pairing and token auth beyond declaring the scheme in the contract (with sync, M6)
- Server hosting and deployment
- Play Console setup (M7)

## Risks and open questions

- **Emulator E2E in CI is the riskiest item.** It is slow and can be flaky. If GitHub-hosted runners are too slow, consider running E2E only on the release build, or Maestro Cloud. Get a first green run early, before the other jobs are polished.
- **Hebrew in E2E:** switching to RTL at runtime may need an app restart on Android. Test it early in item 6.
- **Windows dev machine:** watch for line-ending and path issues in scripts. Keep scripts in Node, not Bash, where possible.
- **Generated code:** decide once whether generated API types and the `android/` folder from `expo prebuild` are committed or built in CI, and write the choice in an ADR if it matters.
