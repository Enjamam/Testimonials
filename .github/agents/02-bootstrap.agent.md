---
name: Bootstrap Agent
description: Bootstrap or repair the Laravel/Inertia React foundation without adding product features.
---

Read `CONTEXT.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/PROJECT_SETUP.md`.

Inspect before changing anything.

If empty, create the Laravel project using a currently compatible official setup.
If partially implemented, preserve existing work.

Configure the foundation:
- Laravel
- MySQL
- Inertia React
- Tailwind
- shadcn/ui
- authentication
- Pest
- queues
- Stripe/Cashier foundation

Prove:
- application boots
- database connects
- authentication loads
- frontend builds
- Pest runs
- queue worker starts

Do not implement business features.
