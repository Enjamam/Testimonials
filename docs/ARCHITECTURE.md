# Architecture — Testimonial Collection SaaS

## 1. Architecture Style

Use a modular Laravel monolith with Inertia.js/React.

Do not introduce microservices for the MVP.

High-level:

```text
Browser
  |
  +-- Authenticated Inertia/React App
  |       |
  |       +-- Dashboard
  |       +-- Spaces
  |       +-- Inbox
  |       +-- Embed Builder
  |       +-- Billing
  |
  +-- Public Space
  |       |
  |       +-- Testimonial Form
  |       +-- Submission endpoint
  |
  +-- Public Embed
          |
          +-- Embed JS
          +-- Public embed endpoint

Laravel
  |
  +-- Controllers / Form Requests
  +-- Policies
  +-- Domain/Application Services
  +-- Eloquent Models
  +-- Jobs / Notifications
  +-- Stripe/Cashier
  +-- Public Embed API
  |
MySQL
```

## 2. Recommended Boundaries

### Presentation

- Inertia pages
- React components
- shadcn/ui
- Tailwind
- Form state
- Live preview

### HTTP

- Auth routes
- Dashboard routes
- Space routes
- Inbox routes
- Embed routes
- Billing routes
- Public Space routes
- Public submission route
- Stripe webhook route

### Application services

Prefer explicit services for behavior that crosses multiple models or external systems:

- `SpaceService`
- `TestimonialService`
- `EmbedService`
- `PlanLimitService`
- `BillingService`
- `StripeWebhookService`
- `PublicEmbedService`

Do not create service classes merely to wrap one Eloquent call.

### Authorization

Use policies:

- SpacePolicy
- TestimonialPolicy
- EmbedConfigurationPolicy

Public endpoints should expose only explicitly public data.

## 3. Data relationships

```text
User
 ├── hasMany Spaces
 └── hasOne/hasMany Cashier subscription records

Space
 ├── belongsTo User
 ├── hasMany Testimonials
 └── hasOne EmbedConfiguration

Testimonial
 └── belongsTo Space

EmbedConfiguration
 └── belongsTo Space
```

## 4. Public identifiers

Use a separate public identifier for Spaces.

Never expose sequential internal IDs in public URLs if avoidable.

Example:

```text
/dashboard/spaces/{space}
```

for authenticated owner routes, protected by policy.

Public Collection:

```text
/s/{slug}
```

(Primary human-readable branded URL, with `Space::resolveRouteBindingQuery` providing seamless dual-resolution fallback for `/s/{public_id}`).

Embed:

```text
/embed/{slug} or /embed/{public_id}
```

Export & Moderation:

```text
/spaces/{space}/export (Streamed CSV download, UTF-8 BOM, Gate protected)
```

## 5. Field configuration

Store predefined field configuration as JSON.

Example conceptual structure:

```json
{
  "name": {"enabled": true, "required": true},
  "email": {"enabled": true, "required": true},
  "company_name": {"enabled": false, "required": false},
  "social_url": {"enabled": false, "required": false},
  "profile_photo": {"enabled": false, "required": false}
}
```

Validate allowed keys server-side.

Never accept arbitrary field names from the public form.

## 6. Plan enforcement

Centralize limits:

```text
PlanLimitService
  |
  +-- canCreateSpace(user)
  +-- canAcceptTestimonial(space)
  +-- maxSpaces(user)
  +-- maxTestimonials(space)
```

Do not scatter numeric limits through controllers/components.

The database operation must be protected against race conditions. Two simultaneous submissions must not bypass the plan limit.

## 7. Stripe

Stripe/Cashier is authoritative for billing events, while local subscription state is a synchronized projection used by the application.

Rules:

- Checkout creation happens server-side.
- Webhook signature is verified.
- Webhook handlers are idempotent.
- Event processing is logged.
- Duplicate events are safe.
- Failed webhook jobs can retry.
- Redirect success is never sufficient by itself.

## 8. Public embed

The public embed endpoint returns only display-safe fields.

Never return:

- Email
- Internal IDs where unnecessary
- Billing data
- Owner data
- Hidden testimonials
- Unconsented testimonials
- Deleted testimonials

Suggested flow:

```text
External website
  -> embed.js
  -> fetch public embed configuration/data
  -> render Masonry/Carousel
  -> optional iframe isolation
  -> resize to content
```

The embed should remain usable without exposing the internal application UI.

## 9. Image handling

Profile photos:

- Accept JPG/PNG/WebP
- Validate MIME and actual file contents
- Limit size
- Generate safe storage names
- Never trust original filename
- Serve safely
- Consider image dimension limits

## 10. Queues

Queue:

- New testimonial notification email
- Stripe-related non-critical follow-up work
- Other expensive/non-blocking work

Do not make the public submission request wait for email delivery.

The testimonial should be persisted before the notification job is dispatched.

## 11. Transactions

Use database transactions for multi-write operations where consistency matters.

Examples:

- Creating a Space plus related configuration
- Updating multiple testimonial state flags
- Subscription state transitions when multiple local records must change

Avoid long-running transactions around external network calls.

## 12. Error handling

Return predictable validation errors for form submissions.

Public submission errors should be user-friendly but must not leak internal exception details.

Stripe/webhook failures should be logged with correlation information.

## 13. Observability

Minimum:

- Application logs
- Stripe webhook logs
- Failed jobs
- Submission failure logs
- Authentication/security events where appropriate

Use structured context:

- user_id
- space_id
- testimonial_id
- stripe_event_id
- request/correlation ID

Never log passwords, card details, Stripe secrets, or respondent email unnecessarily.

## 14. Frontend architecture

Organize React components by feature:

```text
resources/js/
  components/
    ui/
  features/
    dashboard/
    spaces/
    testimonials/
    embeds/
    billing/
    public-space/
  layouts/
  pages/
  lib/
```

Keep domain-specific UI near its feature.

Avoid one giant dashboard component.

## 15. Testing architecture

Pest:

- Unit tests for limit/business logic
- Feature tests for routes/workflows
- Authorization tests
- Public submission tests
- Stripe webhook tests
- Embed visibility tests
- Validation/security tests

Browser/E2E tests can be added if the chosen environment supports them, but core server-side behavior must not depend exclusively on browser tests.
