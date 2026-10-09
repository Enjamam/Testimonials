# Implementation Plan

## Phase 0 — Repository Discovery

Agent actions:

1. Inspect repository.
2. Identify whether Laravel already exists.
3. Check PHP, Composer, Node, npm/pnpm versions.
4. Check database configuration.
5. Inspect existing routes/models/migrations.
6. Do not overwrite existing work.
7. Record findings in `docs/IMPLEMENTATION_STATUS.md`.

## Phase 1 — Bootstrap

If empty:

1. Create Laravel application.
2. Configure MySQL.
3. Configure Inertia + React.
4. Configure Tailwind + shadcn/ui.
5. Configure authentication.
6. Configure Pest.
7. Configure Stripe/Cashier.
8. Configure queues.
9. Run baseline tests.
10. Commit baseline.

Acceptance:

- Application boots
- Authentication works
- MySQL connection works
- Frontend compiles
- Test suite passes

## Phase 2 — Database and Domain

Create:

- Space migration/model
- Testimonial migration/model
- EmbedConfiguration migration/model
- Required relationships
- Soft delete for testimonials
- Appropriate indexes
- Public ID generation
- Field configuration validation

Tests:

- Relationships
- Casts
- Soft deletion
- Unique constraints
- Public ID behavior

## Phase 3 — Authorization

Implement:

- SpacePolicy
- TestimonialPolicy
- EmbedConfigurationPolicy

Tests:

- Owner can access own data
- User cannot access another user's data
- Public endpoints expose only public data

## Phase 4 — Space Management

Build:

- Space list
- Create Space
- Edit Space
- Configuration form
- Theme selector
- Field toggles
- Success page

Tests:

- Valid creation
- Invalid input
- Duplicate slug
- Field configuration rules
- Free-plan limit

## Phase 5 — Public Collection

Build:

- Public Space route
- Responsive form
- Rating control
- Consent
- Optional fields
- Profile photo upload
- Submission endpoint
- Friendly success page

Security:

- CSRF where applicable
- Rate limiting
- Validation
- Sanitization
- Upload restrictions
- Spam mitigation

Tests:

- Successful submission
- Missing required field
- Rating disabled/enabled
- Optional field behavior
- Invalid image
- Rate limit
- XSS payload
- Consent false
- Limit reached

## Phase 6 — Inbox

Build:

- Testimonial list
- Testimonial card
- Favorite
- Wall of Love
- Hide/unhide
- Edit
- Soft delete

Tests:

- Ordering
- Visibility rules
- Authorization
- Soft delete
- Edit validation

## Phase 7 — Dashboard

Build:

- Stats cards
- Date range selector
- Collection chart
- Usage indicators
- Free-plan upgrade banner

Tests:

- Accurate totals
- Date grouping
- Empty states
- Usage calculations

## Phase 8 — Embed Builder

Build:

- Configuration page
- Live preview
- Masonry
- Carousel
- Display toggles
- Copy embed code

Build public embed runtime separately from authenticated dashboard.

Tests:

- Only eligible testimonials appear
- Private fields never appear
- Hidden/deleted/unconsented records excluded
- Item limit works
- Configuration works

## Phase 9 — Billing

Build:

- Billing page
- Free/Pro cards
- Checkout creation
- Success/cancel handling
- Customer Portal
- Webhook endpoint
- Subscription synchronization

Tests:

- Checkout session creation
- Unauthorized checkout attempt
- Webhook signature
- Duplicate webhook
- Subscription created/updated/deleted
- Payment failed
- Limit changes after subscription state change

## Phase 10 — Notifications

Build queued new-testimonial email.

Tests:

- Job dispatched
- Email contains expected fields
- Email is not sent before testimonial persistence
- Failed mail is retryable

## Phase 11 — Security Hardening

Run:

- Authorization review
- XSS review
- CSRF review
- Mass-assignment review
- File upload review
- Rate-limit review
- Stripe webhook review
- Public endpoint data-leak review
- SQL/query review

## Phase 12 — QA and Release

1. Run unit tests.
2. Run feature tests.
3. Run static analysis/formatters if configured.
4. Run frontend build.
5. Run smoke test.
6. Verify queue worker.
7. Verify Stripe test mode.
8. Verify public embed on a separate HTML page.
9. Verify production environment variables.
10. Produce release checklist.

## Agent stop rules

An agent must stop and ask for clarification when:

- A product decision is genuinely ambiguous and affects data/API behavior.
- A requested change conflicts with the PRD.
- A destructive migration is required.
- Production secrets are requested.
- Billing behavior cannot be safely inferred.
- A dependency/package choice has materially changed from the documented architecture.

Otherwise, make the smallest reasonable implementation and document the assumption.
