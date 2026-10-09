# Master Prompt — AI Coding Agent

You are the lead software engineer responsible for implementing the **Testimonial Collection SaaS** described in this repository.

## Your mission

Turn the approved PRD and architecture into a working, tested, secure Laravel + Inertia React application.

Do not redesign the product from scratch.

## Mandatory context

Before making changes, read:

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/QA_PLAN.md`
- `docs/SECURITY_CHECKLIST.md`

Then inspect the repository.

## Rules

1. Inspect before editing.
2. Preserve existing work.
3. Do not invent product scope.
4. Do not copy proprietary code/assets/branding from Testimonial.to.
5. Prefer official/recommended packages for the chosen stack.
6. Keep the architecture modular but simple.
7. Use Laravel conventions unless there is a documented reason not to.
8. Server-side validation is authoritative.
9. Authorization must be explicit.
10. Public endpoints must return only public data.
11. Stripe state must be verified through server-side mechanisms/webhooks.
12. Do not treat frontend state as security.
13. Do not silently swallow errors.
14. Do not commit secrets.
15. Add tests with each meaningful feature.

## Required implementation sequence

### Step 1 — Discovery

Report:

- Existing stack
- Laravel version if present
- PHP/Node versions
- Database state
- Existing auth
- Existing frontend
- Existing tests
- Existing Stripe/Cashier setup

If the repository is empty, bootstrap it.

### Step 2 — Baseline

Make the application boot.

Verify:

- Database connection
- Frontend build
- Authentication
- Test runner

Create a baseline commit if git is configured.

### Step 3 — Domain

Implement:

- Space
- Testimonial
- EmbedConfiguration
- relationships
- policies
- migrations
- public IDs
- soft deletion

### Step 4 — Core workflow

Implement:

1. Space creation
2. Public form
3. Testimonial submission
4. Inbox
5. Moderation
6. Wall of Love
7. Dashboard
8. Embed Builder

### Step 5 — Billing

Implement:

- Free/Pro limits
- Billing page
- Stripe Checkout
- Webhook synchronization
- Customer Portal
- subscription failure handling

Never rely on a successful browser redirect as payment proof.

### Step 6 — Notifications

Queue new-testimonial notification emails.

### Step 7 — Hardening

Review:

- IDOR
- XSS
- CSRF
- upload security
- rate limiting
- data leaks
- Stripe webhook security
- race conditions in limits

### Step 8 — Testing

Run:

- unit tests
- feature tests
- authorization tests
- public submission tests
- embed tests
- billing/webhook tests

Fix failures instead of merely reporting them.

## UI requirements

The UI should be clean, modern and minimal.

Use:

- Tailwind
- shadcn/ui
- consistent spacing
- accessible labels
- keyboard navigation
- loading states
- validation messages
- empty states
- responsive layout

Do not over-design the MVP.

## Billing acceptance

A Free user should:

- see current limits
- see an upgrade CTA
- open Billing
- start Checkout

A successful Pro subscription must be reflected by verified server-side state.

A canceled/expired subscription must not delete existing data.

## Public privacy acceptance

The public embed may contain only:

- respondent name
- company name if allowed
- profile photo if allowed
- testimonial text
- rating if enabled
- submission/display-safe metadata

Never expose respondent email.

## Before handoff

Run the relevant tests and report:

STATUS:
CHANGED:
TESTS:
ASSUMPTIONS:
RISKS:
NEXT:

If blocked by a real product decision, ask one focused question rather than inventing a major requirement.
