# Security Checklist

## Authorization

- [ ] Every owner route is authenticated.
- [ ] Every owner resource is policy-protected.
- [ ] No IDOR/cross-user access.
- [ ] Public routes expose only intentionally public resources.

## Input validation

- [ ] Validate every request server-side.
- [ ] Whitelist field configuration keys.
- [ ] Validate rating range.
- [ ] Validate URLs.
- [ ] Validate profile-photo type and size.
- [ ] Do not trust client-side required flags.

## Output security

- [ ] Escape testimonial text.
- [ ] Sanitize any rich text if ever introduced.
- [ ] Do not render arbitrary HTML.
- [ ] Public embeds exclude email.
- [ ] Hidden/deleted/unconsented testimonials are excluded.

## Upload security

- [ ] Validate actual MIME/type.
- [ ] Restrict file size.
- [ ] Generate safe server filenames.
- [ ] Avoid executable upload paths.
- [ ] Consider image dimension limits.

## Abuse protection

- [ ] Rate-limit public submissions.
- [ ] Rate-limit authentication endpoints.
- [ ] Add basic spam protection.
- [ ] Consider per-IP/per-Space throttling.

## Stripe

- [ ] Verify webhook signatures.
- [ ] Make event processing idempotent.
- [ ] Persist event IDs/status where appropriate.
- [ ] Never trust redirect query parameters as payment proof.
- [ ] Keep Stripe secrets server-side.
- [ ] Log webhook processing safely.
- [ ] Retry transient failures.

## Data/privacy

- [ ] Respondent email is private.
- [ ] No email in embed JSON.
- [ ] No sensitive billing information in logs.
- [ ] Dates stored in UTC.
- [ ] Do not log passwords/card details/secrets.

## Database

- [ ] Use foreign keys.
- [ ] Add useful indexes.
- [ ] Protect against race conditions in plan limits.
- [ ] Use soft deletion for testimonials.
- [ ] Use transactions for multi-write consistency.

## Operational

- [ ] `.env` secrets excluded from git.
- [ ] Production debug disabled.
- [ ] Queue worker monitored.
- [ ] Failed jobs monitored.
- [ ] Stripe webhook endpoint monitored.
