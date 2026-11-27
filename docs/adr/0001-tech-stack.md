# ADR 0001: TypeScript stack - React Native (Expo) + Node (Fastify)

**Status:** Accepted, November 2026

## Context

The spec targets Android first, a web client in phase 3 on the same API, and recommends ts-fsrs (TypeScript) for spaced repetition. Offline mode means FSRS must run on the phone as well as anywhere the server needs it.

## Decision

- Mobile: React Native with Expo, Android build first.
- Server: Node with Fastify and Postgres.
- Shared pure-TypeScript package (`packages/core`) for FSRS, the daily queue, streak and XP rules, used by the phone, the server and the future web app.
- pnpm workspaces monorepo.

## Consequences

- One language and one test toolchain across the project; domain logic is written and tested once.
- The phase 3 web app can reuse `packages/core` and the generated API client.
- Expo limits some native modules; anything missing is added through Expo config plugins or a development build.
- Flutter and native Kotlin were rejected: neither can share ts-fsrs or logic with a TypeScript web client.
