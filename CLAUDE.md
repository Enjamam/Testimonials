# CLAUDE.md — Agent Operating Guide & Commands

This file defines project commands, architecture conventions, and rules for developing the **Testimonials SaaS** application.

---

## 🛠️ Project Commands

### Development Server
```bash
# Unified dev process (backend, queue, and Vite)
composer run dev

# Or separate processes:
php artisan serve                      # Backend at http://localhost:8000
npm run dev                            # Vite HMR dev server
php artisan queue:listen               # Background queue worker
```

### Build & Compilation
```bash
# Compile frontend assets (React 19, Tailwind v4, Wayfinder routes)
npm run build

# Generate Wayfinder typed route & controller bindings
php artisan wayfinder:generate
```

### Database & Setup
```bash
# Run migrations
php artisan migrate

# Seed database with demo user & realistic sample testimonials
php artisan db:seed

# Link public storage disk (for respondent photos & user avatars)
php artisan storage:link
```

### Testing & Verification
```bash
# Run full automated test suite with Pest
php artisan test --compact

# Run specific test file or filter
php artisan test --filter=ProfileUpdateTest

# Directly run Pest runner
vendor/bin/pest

# Check code formatting with Laravel Pint
vendor/bin/pint --test

# Fix PHP code formatting automatically
vendor/bin/pint
```

---

## 📐 Architecture & Conventions

- **Modular Monolith**: Laravel 11/12 backend + Inertia.js v3 + React 19 + Tailwind CSS v4.
- **Strict Tenant Isolation**: All owner resources (`Space`, `Testimonial`, `EmbedConfiguration`) must be protected by Laravel Policies (`SpacePolicy`, `TestimonialPolicy`, `EmbedConfigurationPolicy`).
- **Privacy by Design**: Respondent email addresses must **never** be rendered in public embeds, JSON APIs, or public widget payloads.
- **Server-Side Enforcement**: Plan limits (Free: 1 space, 15 testimonials / Pro: unlimited) are enforced on the backend via `PlanLimitService` using row locks (`lockForUpdate`).
- **Safe Uploads**: Public photos and user avatars must be validated (mimes: jpg, jpeg, png, webp, max 2MB) and stored on the `public` disk.
- **Wayfinder Route Binding**: Always prefer Wayfinder generated actions (`@/actions/...`) or named route helpers (`@/routes/...`) over hardcoded URLs in frontend components.

---

## 🛡️ Security Invariants

1. Every owner route must require authentication and policy verification.
2. Cross-user access (IDOR) must be impossible.
3. Stripe webhooks must verify signatures and enforce idempotent processing.
4. User-generated content must be sanitized against arbitrary HTML/JS (XSS).
5. Secrets (`.env`, Stripe private keys) must never be committed.
