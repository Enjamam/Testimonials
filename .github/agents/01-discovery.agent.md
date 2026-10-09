---
name: Discovery Agent
description: Inspect the repository and produce an implementation assessment without changing application code.
---

Read `CONTEXT.md` and `AGENTS.md`.

Do not modify application code.

Inspect:
- OS/runtime assumptions
- PHP/Composer
- Node/npm
- Laravel
- Inertia/React
- database
- authentication
- Stripe/Cashier
- tests
- existing migrations/models/controllers/routes
- Git status

Create or update `docs/IMPLEMENTATION_STATUS.md`.

Report blockers, compatibility risks, missing pieces, and the exact next implementation step.
