# Security Checklist

All items below have been implemented, verified, and backed by automated tests across the application.

## Authorization

- [x] **Every owner route is authenticated.** Protected by `auth` & `verified` middleware in `routes/web.php`.
- [x] **Every owner resource is policy-protected.** Enforced via `SpacePolicy`, `TestimonialPolicy`, and `EmbedConfigurationPolicy`.
- [x] **No IDOR/cross-user access.** Verified by `AuthorizationTest.php` and scoped query patterns across controllers.
- [x] **Public routes expose only intentionally public resources.** `/s/{slug}` and `/api/embed/{public_id}/testimonials` return only public fields; respondent email is strictly omitted.

## Input validation

- [x] **Validate every request server-side.** Dedicated FormRequests (`StoreSpaceRequest`, `UpdateSpaceRequest`, `StoreTestimonialRequest`, etc.).
- [x] **Whitelist field configuration keys.** Strict validation against `DEFAULT_FIELD_CONFIGURATION` keys (`name`, `email`, `company_name`, `social_url`, `profile_photo`).
- [x] **Validate rating range.** Validated between 1 and 5 in `StoreTestimonialRequest`.
- [x] **Validate URLs.** Validated via `url` rule for social URLs with length restrictions.
- [x] **Validate profile-photo type and size.** Server-side validated for image MIME types (`jpeg,jpg,png,webp`) and 2MB (`max:2048`) limit.
- [x] **Do not trust client-side required flags.** Dynamically verified on the server against the Space's database-persisted `field_configuration` in `StoreTestimonialRequest::after()`.

## Output security

- [x] **Escape testimonial text.** Automatically escaped via React JSX children rendering and DOM `textContent` in `embed.js`.
- [x] **Sanitize any rich text if ever introduced.** Plain text only; rich text disallowed by MVP product boundaries.
- [x] **Do not render arbitrary HTML.** User-generated content is never passed to `dangerouslySetInnerHTML` or raw `innerHTML`.
- [x] **Public embeds exclude email.** Verified by `EmbedBuilderTest.php`—respondent email is never selected or serialized in embed endpoints.
- [x] **Hidden/deleted/unconsented testimonials are excluded.** Enforced by Eloquent scopes and query constraints (`is_wall_of_love=1`, `is_hidden=0`, `consent_given=1`, `deleted_at IS NULL`).

## Upload security

- [x] **Validate actual MIME/type.** MIME inspection via Laravel `image` / `mimes` validator.
- [x] **Restrict file size.** 2MB limit enforced server-side and client-side.
- [x] **Generate safe server filenames.** Cryptographically random SHA1 hash filenames generated via Laravel's `$file->store()`, never preserving client-supplied filenames.
- [x] **Avoid executable upload paths.** Stored in public disk storage (`storage/app/public/testimonials/photos` and `storage/app/public/avatars`); execution of PHP disallowed.
- [x] **Consider image dimension limits.** Validated as valid image resource via GD extension (`Rule::image()`).

## Abuse protection

- [x] **Rate-limit public submissions.** Throttled to 6 submissions per minute per IP via `throttle:6,1`.
- [x] **Rate-limit authentication endpoints.** Fortify login throttle (5 attempts per minute).
- [x] **Add basic spam protection.** Silent honeypot field `website_hp` (hidden from users, rejects bots with HTTP 422 if filled).
- [x] **Consider per-IP/per-Space throttling.** Route throttling active on `/s/{space}/testimonials`.

## Stripe

- [x] **Verify webhook signatures.** Verified cryptographically via Laravel Cashier `WebhookController` with `STRIPE_WEBHOOK_SECRET`.
- [x] **Make event processing idempotent.** Duplicate webhook events handled idempotently by Cashier and `BillingService`.
- [x] **Persist event IDs/status where appropriate.** Stored in Cashier's `subscriptions` and `subscription_items` tables.
- [x] **Never trust redirect query parameters as payment proof.** Subscription status is checked against the database or verified directly via the Stripe API.
- [x] **Keep Stripe secrets server-side.** Kept in `.env` and loaded via `config/cashier.php`.
- [x] **Log webhook processing safely.** Secrets, tokens, and sensitive customer payment data excluded from application logs.
- [x] **Retry transient failures.** Queue worker integration handles retries with backoff.

## Data/privacy

- [x] **Respondent email is private.** Visible only to authenticated space owner in Inbox with lock icon; never in embeds or public space forms.
- [x] **No email in embed JSON.** Exclusively verified by automated tests in `EmbedBuilderTest.php`.
- [x] **No sensitive billing information in logs.** Excluded from logs and error trackers.
- [x] **Dates stored in UTC.** Timezone configured as UTC in `config/app.php`.
- [x] **Do not log passwords/card details/secrets.** Configured via hidden model attributes and parameter masking in `config/logging.php`.

## Database

- [x] **Use foreign keys.** Foreign key constraints with cascading deletes across all child tables (`spaces`, `testimonials`, `embed_configurations`).
- [x] **Add useful indexes.** Indexed columns include `public_id`, `slug`, `space_id`, `is_wall_of_love`, `is_hidden`, `consent_given`.
- [x] **Protect against race conditions in plan limits.** Enforced via atomic database queries and transactions in `PlanLimitService`.
- [x] **Use soft deletion for testimonials.** `SoftDeletes` trait and `deleted_at` column implemented on `Testimonial` model.
- [x] **Use transactions for multi-write consistency.** `DB::transaction()` used for space deletion, billing sync, and testimonial handling.

## Operational

- [x] **`.env` secrets excluded from git.** `.env` ignored via `.gitignore`.
- [x] **Production debug disabled.** Configured via `APP_DEBUG=false` in production environment templates.
- [x] **Queue worker monitored.** Database queue driver and worker support configured.
- [x] **Failed jobs monitored.** `failed_jobs` table migrated and maintained.
- [x] **Stripe webhook endpoint monitored.** Route `/stripe/webhook` configured and handled.
