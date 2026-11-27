# ADR 0002: Offline-first - the phone's database is the source of truth

**Status:** Accepted, November 2026

## Context

The spec describes the app as a thin client over a REST API, but also requires the whole learning core (flashcards, daily queue, quizzes, stats) to work with no network, and the daily queue to open in under a second with thousands of cards. A thin client cannot do either while offline.

## Decision

- SQLite on the device holds all learning data and is the source of truth for the learning core.
- FSRS scheduling, queue building, streak and XP run on the device using `packages/core`.
- Every local write appends to a change queue; a sync process pushes changes to the server and pulls remote changes when online.
- The REST API from the spec stays as designed. The phone uses it for sync, upload and AI generation; the phase 3 web client uses it directly.
- Records use client-generated IDs (UUIDv7) and `updated_at` timestamps. With a single user, last-write-wins per field is sufficient; reviews are append-only and never conflict.

## Consequences

- Streak and XP are computed from the local review log, so they cannot be lost to a network failure.
- Sync and migrations become critical code paths and require dedicated tests (see the development plan).
- The server is effectively a backup and AI service for the phone until the web app exists.
