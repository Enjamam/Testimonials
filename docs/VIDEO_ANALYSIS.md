# Video Analysis — Agentic Engineering 13-03

## 1. What the video is doing

The video shows a voice-driven product-definition workflow in ChatGPT.

The user first gives a broad SaaS brief verbally. The brief is then refined into a short, actionable Markdown PRD intended to be handed to an AI coding agent.

The important pattern is:

> Human product intent → structured PRD → coding-agent handoff → implementation → verification

The video does not show the complete coding implementation. It mainly demonstrates turning an idea into an implementation-ready product document.

## 2. Product requested in the video

The requested product is a minimal testimonial-collection SaaS resembling the *concept* of Testimonial.to.

Core idea:

1. Anyone can create an account.
2. An authenticated owner reaches a dashboard.
3. The owner creates one or more Spaces.
4. Each Space has a public testimonial-collection page.
5. The owner configures what respondent information is collected.
6. A public respondent submits a testimonial without creating an account.
7. The owner manages testimonials in an Inbox.
8. Selected testimonials can be placed on a public Wall of Love.
9. A Space can expose testimonials through embeddable Masonry or Carousel widgets.
10. Free users have limits.
11. Users can upgrade to Pro through Stripe.
12. Stripe webhooks synchronize subscription state.
13. The dashboard shows usage/statistics and a free-plan upgrade banner.

## 3. Important product details captured from the video

### Authentication

- Registration with name, email and password
- Login/logout
- Password reset
- Email verification
- Dashboard restricted to authenticated users

### Spaces

A Space contains:

- Internal Space name
- Public title
- Public subtitle
- Testimonial request/"ask"
- Unique URL slug
- Rating enabled/disabled
- Theme
- Respondent field configuration

### Respondent fields

Always available:

- Name — enabled and required
- Email — enabled and required

Optional predefined fields:

- Company name
- Social profile URL
- Profile photo

For the initial release:

- Fixed/predefined field order
- No custom respondent fields
- Social profile accepts one URL
- Profile photos accept JPG, PNG or WebP

### Themes

At least:

- Minimal Light
- Minimal Dark
- Soft Color

### Public submission

Public Space pages require no authentication and display:

- Title
- Subtitle
- Testimonial request
- Configured respondent fields
- Testimonial text
- Optional 1–5 star rating
- Consent checkbox

Consent text communicates that the respondent permits the testimonial to be publicly displayed/shared.

Rules:

- Name required
- Email required
- Testimonial text required
- Rating required only if enabled
- Configured fields obey their required/optional setting
- Basic spam protection/rate limiting
- HTML/script sanitization

After submission:

- Friendly success message
- Optional predefined celebratory GIF/meme
- No account creation requirement

### Dashboard

Account-level statistics:

- Total Spaces
- Total testimonials
- Unique respondents
- Testimonials collected in selected period
- Current subscription plan
- Current plan usage

Collection graph:

- Last 7 days
- Last 30 days
- Last 90 days

Graph groups submissions by day.

Free users get a persistent but dismissible upgrade banner containing:

- Current limits
- Pro benefits
- Billing-page link

### Space Inbox

Each Space has an Inbox.

Each testimonial displays:

- Respondent name
- Email
- Company name if provided
- Profile photo if provided
- Testimonial text
- Rating if enabled
- Submission date
- Consent status
- Visibility status

Actions:

- Favorite
- Add to Wall of Love
- Hide
- Edit
- Soft-delete

Favorite only affects ordering; it does not publish a testimonial automatically.

### Public display rules

A testimonial can appear publicly only when:

- Consent was granted
- It is marked for Wall of Love
- It is not hidden
- It has not been deleted

Private respondent data such as email must never appear in public embeds.

### Embed Builder

Each Space has an Embed page.

Layouts:

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

The preview updates immediately.

Preferred embed concept:

```html
<div data-testimonial-space="SPACE_PUBLIC_ID"></div>
<script async src="https://example.com/embed.js"></script>
```

The embed script may use an iframe internally to isolate CSS and automatically resize its height.

### Plans

Free:

- Up to 3 Spaces
- Up to 100 testimonials per Space
- Core collection features

Pro:

- $9.99/month
- Up to 25 Spaces
- Up to 1,000 testimonials per Space

Initial release excludes annual billing and multiple paid tiers.

Limits must be enforced server-side.

When a limit is reached:

- Prevent new Space creation if the Space limit is reached
- Prevent further submissions for an affected Space if testimonial limit is reached
- Show a clear upgrade message
- Never silently discard submissions

If Pro expires/cancels:

- Existing data remains
- Existing Spaces remain
- New Spaces cannot exceed Free limits
- Spaces already above the Free testimonial limit stop accepting new submissions
- Data is not automatically deleted

### Billing

Billing page:

- Free plan
- Pro plan
- Current plan
- Usage
- Subscription status
- Upgrade button
- Manage billing button for subscribers

Upgrade flow:

1. Select Pro
2. Server creates Stripe Checkout session
3. User pays on Stripe
4. Stripe redirects back
5. Server verifies subscription state
6. Account becomes Pro
7. Success message shown

Never treat the redirect alone as proof of payment.

Required webhook events include:

- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.paid
- invoice.payment_failed

Webhook requirements:

- Signature verified
- Idempotent
- Logged
- Safe to retry

Stripe Customer Portal handles payment methods, invoices and cancellation.

### Core data model

User:

- id
- name
- email
- password
- email_verified_at
- Stripe customer fields
- timestamps

Space:

- id
- user_id
- name
- title
- subtitle
- ask
- theme
- rating_enabled
- field_configuration
- public_id
- timestamps

Testimonial:

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

Embed Configuration:

- id
- space_id
- layout
- dark_mode
- animation_enabled
- background_color
- item_limit
- display_options
- timestamps

Subscription data should use Laravel Cashier's standard structure.

### Security requirements

- Owner can access only their own Spaces/testimonials
- Public IDs are non-sequential/difficult to guess
- Server-side validation
- Output escaping
- Sanitization for editable testimonial content
- Restrict profile-photo MIME/type and size
- Rate-limit authentication/public submission
- Verify Stripe webhook signatures
- Never expose respondent email in embeds/public APIs
- Store dates in UTC

### Notifications

Email Space owner when a testimonial arrives.

Email includes:

- Space name
- Respondent name
- Short testimonial preview
- Link to Inbox

Notification preferences are out of scope.

### Empty/error/limit states

At minimum:

- No Spaces
- No testimonials
- No Wall of Love testimonials
- Space limit reached
- Testimonial limit reached
- Public Space unavailable
- Failed testimonial submission
- Failed Stripe checkout
- Failed subscription payment

### Out of scope

- Video testimonials
- Audio testimonials
- Custom respondent fields
- Team accounts
- Multiple users/workspaces
- Custom domains
- Public API
- Zapier/integrations
- Testimonial importing
- Social publishing
- AI testimonial editing
- Multiple paid plans
- Annual billing
- Fully customizable themes
- Localization

## 4. Definition of Done observed in the video

The PRD's final acceptance direction is:

1. User can register and create a Space.
2. Space generates a working public testimonial form.
3. Respondent can submit without authentication.
4. Owner can review, edit, favorite, hide, publish and delete testimonials.
5. Published testimonials render through Masonry and Carousel embeds.
6. Dashboard statistics and collection trends are accurate.
7. Free-plan limits are enforced.
8. User can upgrade through Stripe Checkout.
9. Stripe webhooks synchronize subscription state.
10. Core workflows have automated feature tests.
11. Authorization, validation, rate limiting and output escaping are implemented.

## 5. Agentic-engineering interpretation

The strongest reusable lesson from the video is not the specific app. It is the workflow:

- Keep the initial PRD short.
- Make it actionable.
- Convert vague spoken requirements into explicit acceptance criteria.
- Add missing operational/security details.
- Separate scope from out-of-scope items.
- Give coding agents a stable source of truth.
- Let specialized agents handle architecture, implementation, QA and security.
