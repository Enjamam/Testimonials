# Product Requirements Document: Testimonial Collection SaaS

## 1. Product Overview

Build a minimal SaaS application that allows businesses to create public testimonial collection pages called **Spaces**, collect testimonials without requiring respondent accounts, manage submissions, publish selected testimonials through embeds, and upgrade from a Free plan to Pro through Stripe.

The product should prioritize fast onboarding, simplicity, strong authorization, secure public submission, and a clean interface.

## 2. Goals

- Let a business owner create a testimonial Space in minutes.
- Make the public submission experience frictionless.
- Give owners a simple moderation Inbox.
- Allow selected testimonials to be embedded externally.
- Enforce plan limits reliably on the server.
- Synchronize Stripe subscription state through verified webhooks.
- Ship a focused, production-ready MVP rather than a broad feature set.

## 3. Non-goals

See Section 16. Do not add excluded features without an explicit product decision.

## 4. Recommended Technology Stack

| Area | Choice |
|---|---|
| Backend | Laravel |
| Frontend | Inertia.js + React |
| UI | Tailwind CSS + shadcn/ui |
| Database | MySQL |
| Authentication | Laravel authentication |
| Billing | Stripe + Laravel Cashier |
| Charts | Recharts or equivalent |
| Async jobs | Laravel Queues |
| Testing | Pest |
| Deployment | Laravel-compatible infrastructure |

The implementation agent must verify the currently recommended official packages/installation path before bootstrapping.

## 5. User Roles

### Account Owner

Authenticated user who can:

- Create/manage Spaces
- View/manage testimonials
- Configure embeds
- Manage billing/subscription

### Respondent

Unauthenticated public visitor who:

- Opens a Space public URL
- Submits a testimonial
- Provides configured respondent data
- Grants/denies public-display consent

## 6. Authentication

Users must be able to:

- Register with name, email and password
- Login/logout
- Reset password
- Verify email

Only authenticated users can access the dashboard.

## 7. Space Management

### 7.1 Create Space

Fields:

- Internal name
- Public title
- Public subtitle
- Testimonial request/"ask"
- Unique URL slug
- Rating enabled/disabled
- Theme
- Respondent field configuration

### 7.2 Respondent Fields

| Field | Default | Required |
|---|---|---|
| Name | Enabled | Always |
| Email | Enabled | Always |
| Company name | Disabled | Configurable |
| Social profile URL | Disabled | Configurable |
| Profile photo | Disabled | Configurable |

Initial release:

- Predefined fields only
- Fixed field order
- One social profile URL
- JPG/PNG/WebP profile images

### 7.3 Themes

Provide:

- Minimal Light
- Minimal Dark
- Soft Color

### 7.4 Creation Success

After Space creation show:

- Success state
- Public collection URL
- Copy-link action
- Visit public page
- Return to dashboard

## 8. Public Testimonial Submission

No authentication required.

Display:

- Space title
- Subtitle
- Request
- Configured respondent fields
- Testimonial text
- Optional 1–5 star rating
- Consent checkbox

### Consent

Respondent must explicitly permit public display/sharing.

Only consented testimonials can appear in public embeds.

### Validation

- Name required
- Email required
- Testimonial required
- Rating required only when enabled
- Additional fields follow Space configuration
- Server-side validation is authoritative
- Sanitize unsafe HTML/script content
- Rate-limit submissions
- Add basic spam protection

### Confirmation

Show:

> Your kind words have officially made someone's day.

An optional predefined celebratory asset may be shown. Do not require account creation.

## 9. Dashboard

Show:

- Total Spaces
- Total testimonials
- Unique respondents
- Testimonials in selected period
- Current plan
- Current usage

Collection chart:

- Last 7 days
- Last 30 days
- Last 90 days

Group submissions by day.

Free users:

- Persistent but dismissible upgrade banner
- Current limits
- Pro benefits
- Link to Billing

## 10. Space Inbox

Each Space has an Inbox.

### Testimonial card

Display:

- Respondent name
- Email
- Company
- Profile photo
- Testimonial
- Rating when enabled
- Submission date
- Consent status
- Visibility status

### Actions

- Favorite
- Add to Wall of Love
- Hide
- Edit
- Soft-delete

Favorite changes ordering only. It does not publish.

### Public visibility

Eligible only when:

- consent_given = true
- is_wall_of_love = true
- is_hidden = false
- deleted_at is null

## 11. Embed Builder

Layouts:

- Masonry
- Carousel

Options:

- Layout
- Light/dark
- Animation
- Background color
- Item limit
- Show/hide rating
- Show/hide profile photo
- Show/hide company name

Live preview updates immediately.

Generate a copyable embed snippet.

The embed must never expose private respondent information.

## 12. Subscription Plans

### Free

- 3 Spaces
- 100 testimonials per Space

### Pro

- $9.99/month
- 25 Spaces
- 1,000 testimonials per Space

Annual billing is out of scope.

### Enforcement

Enforce on server side.

When limits are reached:

- Block the operation
- Explain why
- Offer upgrade path
- Never silently discard user input

Cancellation/expiry:

- Preserve existing data
- Prevent creation above Free limits
- Existing over-limit Spaces remain accessible
- Over-limit Spaces stop accepting new submissions
- Do not auto-delete data

## 13. Billing

Billing page:

- Free/Pro plans
- Current plan
- Usage
- Status
- Upgrade
- Manage billing

### Upgrade

1. User chooses Pro.
2. Server creates Stripe Checkout Session.
3. User completes payment on Stripe.
4. Stripe redirects to application.
5. Server verifies subscription state.
6. Subscription is persisted/synchronized.
7. Success message appears.

Never trust a successful redirect as payment proof.

### Webhooks

Handle:

- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.paid
- invoice.payment_failed

Requirements:

- Signature verification
- Idempotency
- Logging
- Retry safety

Use Stripe Customer Portal for billing management.

## 14. Data Model

### User

- id
- name
- email
- password
- email_verified_at
- Stripe customer fields
- timestamps

### Space

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

### Testimonial

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

### Embed Configuration

- id
- space_id
- layout
- dark_mode
- animation_enabled
- background_color
- item_limit
- display_options
- timestamps

Use Laravel Cashier's standard subscription schema.

## 15. Security and Authorization

- Scope all owner queries by authenticated user.
- Use policies/gates.
- Use non-sequential public IDs.
- Validate all input server-side.
- Escape rendered testimonial content.
- Sanitize editable content.
- Validate image MIME/type and size.
- Rate-limit auth and public submissions.
- Verify Stripe webhook signatures.
- Keep email private.
- Store dates in UTC.
- Never expose database IDs when a public identifier is sufficient.

## 16. Notifications

When a testimonial is submitted, queue an email to the Space owner containing:

- Space name
- Respondent name
- Short testimonial preview
- Inbox link

Notification preferences are out of scope.

## 17. States

Implement clear UI for:

- Empty dashboard
- No testimonials
- No Wall of Love testimonials
- Space limit reached
- Testimonial limit reached
- Public Space unavailable
- Invalid/failed submission
- Stripe checkout failure
- Subscription payment failure
- Loading
- Validation errors
- Unauthorized access
- Deleted/hidden testimonial

## 18. Out of Scope

- Video testimonials
- Audio testimonials
- Custom respondent fields
- Teams
- Multiple users per workspace
- Custom domains
- Public API
- Zapier/integrations
- Imports
- Social publishing
- AI testimonial editing
- Multiple paid tiers
- Annual billing
- Fully custom themes
- Localization

## 19. Definition of Done

The release is complete when:

1. User registration works.
2. Authenticated user can create a Space.
3. Space generates a public form.
4. Unauthenticated respondent can submit.
5. Owner can review/edit/favorite/hide/publish/delete.
6. Wall of Love works.
7. Masonry and Carousel embeds work.
8. Dashboard statistics are accurate.
9. Free limits are enforced.
10. Stripe Checkout upgrade works.
11. Stripe webhooks synchronize subscription state.
12. Automated feature tests cover core workflows.
13. Authorization, validation, rate limiting, output escaping and webhook verification are implemented.
14. Empty/error/limit states are covered.
15. No private respondent information leaks through public embeds.
