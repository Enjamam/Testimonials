# PROJECT CONTEXT — TESTIMONIAL COLLECTION SAAS

> **Canonical context file for all AI agents.**
>
> Every AI agent must read this file before doing any work.
> This file is the high-level source of truth for product intent, scope, requirements, constraints, architecture direction, security rules, and agent behavior.
>
> Detailed implementation guidance lives in:
> - `docs/PRD.md`
> - `docs/ARCHITECTURE.md`
> - `docs/IMPLEMENTATION_PLAN.md`
> - `docs/QA_PLAN.md`
> - `docs/SECURITY_CHECKLIST.md`
> - `docs/AGENTIC_WORKFLOW.md`

---

# 1. PRODUCT IDENTITY

## Product

A minimal SaaS for collecting, managing, moderating, and publicly displaying customer testimonials.

The product is conceptually similar to the *category* of products such as Testimonial.to, but implementation, code, branding, assets, copy, and UI must be original.

## Core concept

A business owner creates a **Space**.

Each Space has a public testimonial-collection page.

Customers/respondents can submit testimonials without creating an account.

The owner manages those submissions in an Inbox and can select testimonials for a public **Wall of Love**.

Selected testimonials can be shown on external websites through **Masonry** or **Carousel** embeds.

The application also contains Free/Pro subscription plans.

---

# 2. PRIMARY USER JOURNEY

```text
Register
   ↓
Login / Verify Email
   ↓
Dashboard
   ↓
Create Space
   ↓
Configure Space
   ↓
Get Public Collection URL
   ↓
Customer opens public page
   ↓
Customer submits testimonial
   ↓
Owner receives notification
   ↓
Testimonial appears in Inbox
   ↓
Owner reviews/moderates
   ↓
Add to Wall of Love
   ↓
Configure Embed
   ↓
Copy embed code
   ↓
Place embed on external website
```

---

# 3. TECHNOLOGY DIRECTION

Use a simple modular Laravel monolith.

## Required stack

- Backend: Laravel
- Frontend: Inertia.js + React
- Styling: Tailwind CSS
- Components: shadcn/ui
- Database: MySQL
- Authentication: Laravel authentication
- Billing: Stripe + Laravel Cashier
- Charts: Recharts or equivalent
- Async processing: Laravel Queues
- Testing: Pest

Do not introduce microservices for the MVP.

The implementation agent must verify current official/recommended installation methods and compatible package versions before bootstrapping.

---

# 4. AUTHENTICATION

Users must be able to:

- Register
- Login
- Logout
- Reset password
- Verify email

Registration requires:

- Name
- Email
- Password

Only authenticated users can access owner/dashboard features.

Public respondents do NOT need accounts.

---

# 5. USER / OWNER MODEL

A normal authenticated account owns its own Spaces.

For the MVP:

- One user owns their own Spaces
- No teams
- No organizations
- No multiple workspace members
- No role-management system

Every owner resource must be authorization-protected.

A user must never be able to access another user's Spaces, Testimonials, Embed Configurations, or Billing information.

---

# 6. SPACES

A Space represents one testimonial collection page.

## Space data

- Internal name
- Public title
- Public subtitle
- Testimonial request/"ask"
- Unique slug
- Separate public identifier
- Theme
- Rating enabled/disabled
- Respondent field configuration
- Owner

## Space creation

After creation show:

- Success state
- Public collection URL
- Copy URL
- Visit public page
- Return to dashboard

## Themes

Initial themes:

1. Minimal Light
2. Minimal Dark
3. Soft Color

Do not build a complex theme/customization system.

---

# 7. RESPONDENT FIELDS

The initial release supports only predefined fields.

## Always enabled + required

- Name
- Email

## Optional predefined fields

- Company Name
- Social Profile URL
- Profile Photo

Initial release rules:

- Fixed field order
- No custom respondent fields
- Social profile accepts one URL
- Profile image accepts JPG, PNG, WebP

The server must validate field configuration against an allowlist.

Never allow arbitrary field definitions from the browser.

---

# 8. PUBLIC TESTIMONIAL FORM

The public Space page requires no authentication.

Display:

- Space title
- Space subtitle
- Testimonial request
- Configured respondent fields
- Testimonial text
- Rating when enabled
- Consent checkbox

## Required rules

Always required:

- Name
- Email
- Testimonial

Conditionally required:

- Rating only when the Space has rating enabled
- Optional configured fields follow their configuration

## Consent

Respondent must explicitly agree to public display/sharing.

A testimonial must NOT become publicly visible unless consent is granted.

## Submission

Public submission must have:

- Server-side validation
- Rate limiting
- Basic spam protection
- Unsafe HTML/script sanitization or escaping
- Safe upload validation

Do not rely only on client-side validation.

## Success

After successful submission show a friendly confirmation.

Suggested message:

> Your kind words have officially made someone's day.

An optional predefined celebratory GIF/meme may be displayed.

No account creation is required.

---

# 9. TESTIMONIAL DATA

A testimonial contains conceptually:

- id
- space_id
- name
- email
- company_name
- social_url
- profile_photo_path
- testimonial
- rating
- consent_given
- is_favorite
- is_wall_of_love
- is_hidden
- submitted_at
- created_at
- updated_at
- deleted_at

Use soft deletion.

Dates are stored in UTC.

---

# 10. TESTIMONIAL INBOX

Every Space has an Inbox.

A testimonial card should show:

- Respondent name
- Email
- Company name when provided
- Profile photo when provided
- Testimonial
- Rating when enabled
- Submission date
- Consent status
- Visibility status

## Actions

Owner can:

- Favorite
- Add to Wall of Love
- Hide
- Unhide where supported
- Edit
- Soft-delete

Important:

**Favorite is only an ordering/preference state.**

Favorite does NOT automatically publish a testimonial.

---

# 11. WALL OF LOVE

A testimonial can publicly appear only when all conditions are satisfied:

```text
consent_given = true
AND
is_wall_of_love = true
AND
is_hidden = false
AND
deleted_at IS NULL
```

Anything else must be excluded.

---

# 12. PUBLIC EMBEDS

Each Space has an Embed Builder.

Supported layouts:

- Masonry
- Carousel

Configuration:

- Layout
- Light/dark mode
- Animation on/off
- Background color
- Number of testimonials
- Show/hide rating
- Show/hide profile photo
- Show/hide company name

Preview should update immediately.

Generate a copyable embed snippet.

Suggested concept:

```html
<div data-testimonial-space="SPACE_PUBLIC_ID"></div>
<script async src="https://example.com/embed.js"></script>
```

The exact implementation may use an iframe internally to isolate CSS.

## Public embed privacy

Never expose:

- Respondent email
- Owner account data
- Billing information
- Internal private state
- Hidden testimonials
- Deleted testimonials
- Unconsented testimonials

Public API/DTOs must use explicit allowlisted fields.

---

# 13. DASHBOARD

Dashboard should show:

- Total Spaces
- Total testimonials
- Unique respondents
- Testimonials collected in selected period
- Current plan
- Current usage

## Collection chart

Support:

- Last 7 days
- Last 30 days
- Last 90 days

Group testimonial submissions by day.

## Free-user banner

Free users see a persistent but dismissible upgrade banner showing:

- Current limits
- Pro benefits
- Link to Billing

---

# 14. SUBSCRIPTION PLANS

## FREE

- Maximum 3 Spaces
- Maximum 100 testimonials per Space
- Core collection features

## PRO

- $9.99/month
- Maximum 25 Spaces
- Maximum 1,000 testimonials per Space

Initial release does NOT include:

- Annual billing
- Multiple paid tiers

---

# 15. PLAN LIMIT ENFORCEMENT

Limits MUST be enforced server-side.

Do not rely on React/UI restrictions.

## When Space limit is reached

Prevent creation of additional Spaces.

Show a clear explanation and upgrade path.

## When testimonial limit is reached

Prevent further submissions for the affected Space.

Never silently discard a submitted testimonial.

## Race conditions

Two simultaneous submissions must not bypass the testimonial limit.

Plan-limit checks must be implemented in a concurrency-safe way.

Centralize plan logic, e.g.:

```text
PlanLimitService
  ├── canCreateSpace(user)
  ├── canAcceptTestimonial(space)
  ├── maxSpaces(user)
  └── maxTestimonials(space)
```

Do not scatter hard-coded plan numbers across controllers and React components.

---

# 16. SUBSCRIPTION EXPIRY / CANCELLATION

When Pro ends:

- Existing data remains
- Existing Spaces remain
- Data is NOT deleted
- New Spaces above Free limit cannot be created
- Spaces already above the Free testimonial limit may remain
- Over-limit Spaces must not accept additional testimonials until allowed again

Do not automatically purge user data.

---

# 17. STRIPE BILLING

Billing page displays:

- Free plan
- Pro plan
- Current plan
- Usage
- Subscription status
- Upgrade button
- Manage billing button

## Upgrade sequence

```text
User clicks Pro
   ↓
Server creates Stripe Checkout Session
   ↓
User pays on Stripe
   ↓
Stripe redirects back
   ↓
Stripe webhook confirms state
   ↓
Server synchronizes subscription
   ↓
Account is treated as Pro
```

A successful redirect MUST NOT by itself be treated as proof of payment.

## Required webhook events

Handle at minimum:

- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.paid
- invoice.payment_failed

## Webhook requirements

- Verify Stripe signature
- Idempotent processing
- Retry-safe
- Safe logging
- No secret exposure
- Duplicate events must not corrupt state

Use Stripe Customer Portal for billing management.

---

# 18. NOTIFICATIONS

When a testimonial is submitted, notify the Space owner by email.

Email includes:

- Space name
- Respondent name
- Short testimonial preview
- Inbox link

Email should be queued.

Do not make public submission wait for email delivery.

Persist the testimonial first, then dispatch the notification job.

Notification preferences are out of scope for MVP.

---

# 19. SECURITY REQUIREMENTS

## Authorization

- Authenticate all owner routes.
- Use Laravel policies/gates.
- Scope queries to the authenticated owner.
- Prevent cross-user access/IDOR.

## Public identifiers

Use separate public IDs that are not simply sequential database IDs.

## Input

Validate everything server-side.

## Output

Escape/sanitize rendered user content.

Never render arbitrary HTML from testimonial content.

## Uploads

Profile images:

- JPG/PNG/WebP
- Validate type/MIME
- Validate actual content where appropriate
- Size limit
- Safe filename generation
- Safe storage path

Never trust the original filename.

## Rate limiting

Protect:

- Login/authentication
- Public testimonial submission
- Other abuse-prone public routes

## Stripe

- Verify signatures
- Do not trust redirect state
- Make webhook processing idempotent

## Privacy

Never expose respondent email through public endpoints/embeds.

Do not log:

- passwords
- payment/card information
- Stripe secrets
- unnecessary private respondent data

---

# 20. EMPTY / ERROR / LIMIT STATES

Must support explicit UI states for:

- Empty dashboard
- No Spaces
- No testimonials
- No Wall of Love testimonials
- Space limit reached
- Testimonial limit reached
- Public Space unavailable
- Invalid submission
- Failed submission
- Stripe checkout failure
- Payment failure
- Loading
- Validation errors
- Unauthorized access
- Deleted/hidden testimonial

Do not leave users on unexplained blank screens.

---

# 21. OUT OF SCOPE

Do NOT implement these unless the product owner explicitly changes scope:

- Video testimonials
- Audio testimonials
- Custom respondent fields
- Teams
- Multiple workspace members
- Custom domains
- Public API
- Zapier
- Third-party integrations
- Testimonial importing
- Social publishing
- AI testimonial editing
- Multiple paid tiers
- Annual billing
- Fully customizable themes
- Localization

---

# 22. DATA MODEL

## User

- id
- name
- email
- password
- email_verified_at
- Stripe customer fields
- timestamps

## Space

- id
- user_id
- name
- title
- subtitle
- ask
- slug
- public_id
- theme
- rating_enabled
- field_configuration
- timestamps

## Testimonial

- id
- space_id
- name
- email
- company_name
- social_url
- profile_photo_path
- testimonial
- rating
- consent_given
- is_favorite
- is_wall_of_love
- is_hidden
- submitted_at
- timestamps
- deleted_at

## Embed Configuration

- id
- space_id
- layout
- dark_mode
- animation_enabled
- background_color
- item_limit
- display_options
- timestamps

Use standard Laravel Cashier subscription structures.

---

# 23. ARCHITECTURE

Prefer:

```text
Laravel
├── Controllers
├── Form Requests
├── Policies
├── Services
├── Models
├── Jobs
├── Notifications
└── Stripe/Cashier integration

Inertia
└── React
    ├── Dashboard
    ├── Spaces
    ├── Testimonials
    ├── Embeds
    ├── Billing
    └── Public Space
```

Suggested application services:

- SpaceService
- TestimonialService
- EmbedService
- PlanLimitService
- BillingService
- StripeWebhookService
- PublicEmbedService

Do not create unnecessary abstraction layers.

---

# 24. FRONTEND DIRECTION

Use:

- Tailwind CSS
- shadcn/ui
- Clean spacing
- Rounded modern components
- Accessible forms
- Responsive behavior
- Clear empty states
- Loading indicators
- Validation feedback
- Simple/minimal visual language

Do not over-design the MVP.

Security and business rules must remain server-side even when the UI hides unavailable actions.

---

# 25. TESTING REQUIREMENTS

Use Pest.

## Core tests

Authentication:

- registration
- login
- logout
- reset password
- verification

Space:

- creation
- validation
- ownership
- limits

Public submission:

- valid
- missing required fields
- rating enabled/disabled
- optional fields
- consent
- invalid image
- rate limiting
- spam/security cases
- limit reached

Inbox:

- favorite
- Wall of Love
- hide/unhide
- edit
- soft delete
- authorization

Embed:

- Masonry
- Carousel
- visibility rules
- configuration
- private-data protection

Billing:

- Checkout
- webhook signature
- webhook idempotency
- subscription activation
- subscription update
- cancellation
- payment failure
- limits after state changes

---

# 26. CRITICAL NEGATIVE TESTS

The implementation is not complete until these areas are tested:

- User A cannot access User B's Space
- User A cannot edit User B's testimonial
- Unconsented testimonials never appear publicly
- Hidden testimonials never appear publicly
- Deleted testimonials never appear publicly
- Respondent email never appears publicly
- Arbitrary HTML/script cannot execute
- Malicious image uploads are rejected
- Submission rate limiting works
- Forged Stripe webhooks are rejected
- Replayed Stripe webhooks are safe
- Fake checkout success cannot activate Pro
- Concurrent submissions cannot bypass plan limits

---

# 27. AGENT RULES

Every AI agent must:

1. Read this file first.
2. Read the relevant detailed docs before working.
3. Inspect the existing repository before changing anything.
4. Preserve existing functionality.
5. Avoid unnecessary refactors.
6. Stay inside product scope.
7. Never silently invent major requirements.
8. Keep security rules intact.
9. Add/update tests for meaningful behavior.
10. Update documentation when architecture changes.

## Agent completion format

Every agent must report:

```text
STATUS: COMPLETE | BLOCKED | NEEDS_DECISION

CHANGED:
- ...

TESTS:
- ...

ASSUMPTIONS:
- ...

RISKS:
- ...

NEXT:
- ...
```

---

# 28. AGENT ORDER

Recommended sequence:

```text
1. Product Agent
2. Architecture Agent
3. Bootstrap Agent
4. Backend/Domain Agent
5. Frontend Agent
6. Public Collection Agent
7. Inbox Agent
8. Dashboard Agent
9. Embed Agent
10. Billing Agent
11. Notification Agent
12. QA Agent
13. Security Agent
14. Release Agent
```

Agents may be combined when the implementation environment requires it, but the responsibilities should remain separated.

---

# 29. DEFINITION OF DONE

The MVP is considered complete only when:

- Registration works
- Authentication works
- User can create Spaces
- Public Space form works
- Unauthenticated respondent can submit
- Consent is enforced
- Owner can manage testimonials
- Wall of Love works
- Masonry embed works
- Carousel embed works
- Dashboard statistics are accurate
- Free limits are enforced
- Pro limits are enforced
- Stripe Checkout works in test mode
- Webhooks are verified and idempotent
- Cancellation/payment failure states work
- Notification email is queued
- Authorization is tested
- Public privacy boundary is tested
- Security checklist is completed
- P0 automated tests pass
- Production build succeeds
- No critical/high security issue remains

---

# 30. SOURCE-OF-TRUTH RULE

When documents conflict:

1. Product owner's explicit latest decision wins.
2. This `CONTEXT.md` is the canonical high-level project context.
3. `docs/PRD.md` is the detailed product specification.
4. `docs/ARCHITECTURE.md` is the implementation architecture.
5. `docs/IMPLEMENTATION_PLAN.md` controls sequencing.
6. `docs/QA_PLAN.md` controls validation scope.
7. `docs/SECURITY_CHECKLIST.md` controls security expectations.

If an agent detects a conflict that changes core behavior, it must not silently choose a major interpretation.

---

# 31. IMPORTANT PRODUCT PRINCIPLE

Build the smallest production-quality implementation that satisfies this context.

Do not optimize for maximum features.

Optimize for:

- Correctness
- Security
- Clear architecture
- Testability
- Maintainability
- Simple UX
- Reliable billing
- Strong public/private data separation
