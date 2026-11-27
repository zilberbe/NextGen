# ADR 0004: Authentication and privacy for a single-user app

**Status:** Accepted, November 2026

## Context

There is one user, a minor, and no multi-user support. The server is still reachable from the internet and holds her data and the LLM API key.

## Decision

- **Auth:** the phone pairs with the server once using a setup code; the server issues a long-lived device token, stored in the phone's secure storage and sent on every request. Tokens can be revoked server-side. No accounts, no passwords, no email.
- **Secrets:** the LLM API key and database credentials live only in server environment variables. Never in the repo or the app bundle.
- **LLM requests:** contain only the study material and the school grade. Never the name or any other profile field. An automated test asserts this.
- **No tracking:** no analytics or third-party crash-reporting SDKs. Server logs exclude request bodies.
- **Transport:** HTTPS only.

## Consequences

- Adding a web client in phase 3 needs a second pairing path (for example a QR code shown on the phone).
- Losing the phone means re-pairing a new device; data is restored from the server copy.
