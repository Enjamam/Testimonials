# QA Plan

## Test strategy

Test at four levels:

1. Unit
2. Feature/API
3. Integration
4. Browser/E2E where useful

Core business rules must be tested server-side.

## P0 critical flows

### Authentication

- Register
- Verify email
- Login
- Logout
- Password reset

### Space

- Create Space
- Configure required fields
- Configure optional fields
- Public URL works
- Owner isolation

### Submission

- Valid submission
- Required-field validation
- Optional-field behavior
- Rating on/off
- Consent
- Image upload
- Rate limiting
- Free testimonial limit

### Moderation

- Inbox
- Edit
- Favorite
- Wall of Love
- Hide
- Delete
- Public visibility rules

### Embed

- Masonry
- Carousel
- Configuration
- Live preview
- Copy snippet
- Public rendering
- No private data

### Billing

- Free billing page
- Checkout creation
- Stripe redirect
- Webhook verification
- Idempotency
- Subscription activation
- Subscription cancellation
- Payment failure
- Customer Portal

## Negative/security cases

- Cross-user Space access
- Cross-user testimonial access
- Guessable public IDs
- XSS in testimonial
- XSS in title/subtitle
- Malicious image upload
- Oversized image
- Invalid MIME
- SQL-like input
- CSRF attempts
- Submission flood
- Replayed Stripe webhook
- Invalid Stripe signature
- Forged checkout-success URL
- Email leakage in embed
- Hidden testimonial appearing publicly
- Deleted testimonial appearing publicly
- Consent=false appearing publicly

## Edge cases

- Exactly 3 Spaces on Free
- Fourth Space attempt
- Exactly 100 testimonials
- 101st submission
- Subscription expires while over Free limit
- Duplicate webhook
- Two simultaneous submissions at the limit
- Empty Space
- No Wall of Love
- Long testimonial
- Unicode names
- Emoji
- Very long company/social URL
- Missing profile photo
- Deleted testimonial referenced by old embed cache
- Space slug collision

## Acceptance smoke suite

1. Register.
2. Create Space.
3. Open public URL.
4. Submit testimonial.
5. Verify owner receives/queues notification.
6. Open Inbox.
7. Add testimonial to Wall of Love.
8. Verify public embed.
9. Hide testimonial and verify embed removal.
10. Upgrade to Pro in Stripe test mode.
11. Verify webhook changes plan.
12. Verify Pro limits.
13. Cancel subscription.
14. Verify Free behavior without data deletion.

## Exit criteria

- P0 tests pass.
- No critical/high security defect remains.
- No cross-user authorization issue.
- No private data leak.
- Stripe webhook tests pass.
- Public submission is rate-limited.
- Production build succeeds.
- Queue processing works.
