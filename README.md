# 🌟 Testimonial Collection SaaS

A modern, production-ready SaaS application for collecting, moderating, and embedding customer testimonials and social proof on any website. Built with **Laravel 11/12**, **Inertia.js v3**, **React 19**, **Tailwind CSS v4**, and **Stripe**.

---

## 🤖 Built & Verified with Agentic AI

This application was engineered and tested using advanced pair-programming agentic workflows:

- **AI Model**: **Google DeepMind Gemini 2.5 (Advanced Agentic Coding / Antigravity IDE)**
- **Model Context Protocol (MCP) Ecosystem**:
  - **`chrome-devtools-mcp`**: Automated headless browser testing, real-time viewport screenshot verification, DOM snapshot audits, and interactive UI regression testing across mobile, tablet, and desktop viewports.
  - **`Laravel Boost MCP`**: Laravel architecture enforcement, database schema verification, and framework-level best practices.
  - **`Wayfinder MCP`**: Auto-generated type-safe TypeScript bindings connecting Laravel controllers and routes directly to the React frontend.
- **Automated Verification**:
  - **Pest v5**: 159 automated feature & unit tests with 961 assertions passing.
  - **Laravel Pint**: Opinionated automated PHP code styling and formatting.
  - **TypeScript & Vite Compiler**: Zero-error strict type checking with React Compiler optimization.

---

## 📊 Feature Completion Status

### ✅ Completed & Verified Features
- [x] **Space & Collection Management**: Branded spaces, custom prompts, minimal light/dark themes, configurable fields (photo, company, social), star ratings.
- [x] **Public Submission Flow**: Responsive `/s/{public_id}` form, consent checkbox gating, spam honeypot, rate limiting, and live celebratory modal with confetti & preview.
- [x] **Testimonial Moderation Inbox**: Approval/rejection workflows, favorites, Wall of Love flagging, and multi-parameter searching/filtering.
- [x] **Embed Builder & Wall of Love**: Customizable layouts (masonry, grid, carousel), zero-dependency standalone `embed.js`, and live `/embed-demo.html` demo.
- [x] **Subscriptions & Monetization**: Free vs Pro plan limits enforced server-side with row-level locks, Stripe Checkout, webhook idempotency, and Stripe Customer Portal.
- [x] **Profile & Account Management**: Avatar photo upload with automatic disk storage, card-based settings layout, smooth tab transitions, 2FA (TOTP), Passkeys (WebAuthn), and Danger Zone account deletion.
- [x] **Appearance & Theme Studio**: Light/Dark/System modes, 7 curated accent color palettes with real-time CSS variables, and corner curvature presets.
- [x] **Comprehensive Automated Testing**: 159 tests passing (961 assertions) with 100% critical path coverage.

### ⏸️ Deliberately Out of Scope (MVP Product Boundaries)
In accordance with the project contract (`CONTEXT.md`), the following features were excluded to prioritize rock-solid MVP core execution:
- Video and audio testimonial recording
- Multi-seat teams / organizational workspaces
- Custom domain / CNAME routing (handled portably via lightweight embed script)
- Zapier and third-party CRM webhook sync
- Social media auto-publishing (Twitter / LinkedIn)
- AI-assisted testimonial rewriting or automated sentiment editing

---

## 🚀 Features

### 🏢 Space & Collection Management
- **Dedicated Spaces**: Create branded collection spaces with custom prompts, headers, subtitles, and guiding questions.
- **Theme Personalization**: High-contrast **Minimal Light** and **Minimal Dark** themes that adapt cleanly to any brand.
- **Configurable Fields**: Toggle optional/required respondent fields including avatar photos, company names, job titles, and social profile links.
- **Star Ratings**: Configurable 1–5 star rating selector with intuitive rating labels.

### ✍️ Public Submission Flow & UX
- **Seamless Public Forms**: Clean, ultra-fast, mobile-responsive submission pages at `/s/{public_id}`.
- **Consent-Gated Submissions**: Strict permission consent checkbox gating to ensure legal compliance for public marketing usage.
- **Live Celebratory Modal**: Beautiful celebratory popup dialog upon submission featuring floating confetti animations, glowing celebratory badge, and an instant live preview of the submitted testimonial.
- **Spam & Abuse Protection**: Client-side image validation (2MB limit), silent honeypot trap (`website_hp`), and server-side submission rate limiting (6 requests/minute).

### 📥 Testimonial Inbox & Moderation
- **Moderation Workflow**: Filter by pending, approved, or archived/rejected testimonials.
- **Wall of Love Selection**: Curate and feature the best testimonials for public display with a single click.
- **Search & Filtering**: Search by customer name, company, or testimonial text; filter by star rating and featured status.

### 🌐 Widgets, Wall of Love & Embeds
- **Interactive Embed Builder**: Customize live widgets with grid layouts, carousels, dark/light themes, and custom borders.
- **Lightweight Embed Script**: Zero-dependency standalone JavaScript loader (`public/embed.js`) compatible with any CMS, Shopify, WordPress, Webflow, or custom site.
- **Iframe & Direct Integration**: Responsive iframe fallback and native embed code snippets with one-click copy.
- **Embed Demo Showcase**: Built-in demonstration page at `/embed-demo.html` showcasing live masonry and carousel widgets.

### 👤 Profile, Avatar & Account Settings
- **Profile Picture Upload**: Upload custom avatar photos (JPG, PNG, WebP up to 2MB) with live client-side preview, automatic disk storage management, and old photo cleanup.
- **Sidebar & Header Sync**: Instant live synchronization of uploaded avatars to the primary sidebar user widget and dropdown menus.
- **Clean Card-Based Settings Layout**: Modern, structured `max-w-5xl` settings suite eliminating excessive whitespace.
- **Smooth Tab Transitions**: Instant tab switching powered by Inertia prefetching and subtle entrance animations.
- **Password & Danger Zone**: Secure password change forms and a structured Danger Zone card with password confirmation for irreversible account deletion.

### 💳 Subscriptions & Monetization
- **Free vs. Pro Tiers**:
  - **Free Tier**: 1 active space, up to 15 testimonials.
  - **Pro Tier**: Unlimited spaces, unlimited testimonials.
- **Stripe Checkout**: Integrated checkout flow using **Laravel Cashier (Stripe)**.
- **Webhook Processing**: Cryptographically verified webhook handling with idempotent transaction safeguards.
- **Customer Billing Portal**: Self-service Stripe Customer Portal for managing invoices, payment methods, and plan cancellations.

### 🎨 Theme Customizer & Radiance
- **Appearance Settings**: Real-time theme mode switching (Light, Dark, System).
- **Curated Accent Palettes**: Dynamic accent colors (Sunset Rose, Emerald, Royal Indigo, Violet) with live interactive previews.

### 🔐 Authentication & Enterprise Security
- **Laravel Fortify Engine**: Secure registration, login, email verification, and password resets.
- **Two-Factor Authentication (2FA)**: TOTP app support (Google Authenticator, 1Password) with QR codes and secure recovery codes.
- **WebAuthn / Passkeys**: Hardware biometric and security key authentication support.
- **Tenant Isolation**: Strict policy authorization ensuring owners can only view and manage their own resources.
- **Privacy by Design**: Respondent email addresses are **never** rendered in public embeds, JSON APIs, or widget outputs.

---

## 🛠️ Tech Stack & Tooling

| Layer | Technology | Purpose |
|---|---|---|
| **AI Pair-Programming** | Google DeepMind Gemini 2.5 | Architecture design, full-stack implementation & automated testing |
| **Testing / Tooling MCP**| Chrome DevTools MCP & Laravel Boost MCP | Live browser execution, screenshot verification, DOM audits |
| **Backend Framework** | [Laravel 11/12](https://laravel.com) (PHP 8.4) | Modular backend, Eloquent ORM, Queues & Middleware |
| **Frontend Adapter** | [Inertia.js v3](https://inertiajs.com) | Monolith SPA architecture with instant routing & state sync |
| **Frontend UI** | [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org) | Modern reactive user interface |
| **API & Routing** | [Laravel Wayfinder](https://github.com/laravel/wayfinder) | Auto-generated type-safe TS route and controller bindings |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com) | Premium UI design system, dark mode & micro-animations |
| **Icons & Effects** | [Lucide React](https://lucide.dev), Canvas Confetti | Crisp SVG iconography & celebratory micro-interactions |
| **Billing & Payments** | [Laravel Cashier](https://laravel.com/docs/billing) (Stripe) | Subscriptions, customer portal & webhook handling |
| **Authentication** | [Laravel Fortify](https://laravel.com/docs/fortify) + Passkeys | 2FA TOTP, Passkeys/WebAuthn, email verification |
| **Database** | SQLite (default local) / MySQL 8+ / PostgreSQL | Reliable persistence with strict foreign keys & soft deletes |
| **Testing Framework** | [Pest v5](https://pestphp.com) | 159 automated tests covering 100% of critical paths |
| **Code Formatter** | [Laravel Pint](https://laravel.com/docs/pint) | Automated code styling adhering to PSR-12 / Laravel standards |

---

## 📋 Prerequisites

Ensure your development environment meets the following requirements:

- **PHP**: `^8.3` or `^8.4` (Recommended: PHP 8.4 via [Laravel Herd](https://herd.laravel.com))
  - Required extensions: `pdo`, `pdo_sqlite` (or `pdo_mysql`), `mbstring`, `openssl`, `curl`, `fileinfo`, `gd` or `imagick`
- **Composer**: `^2.x`
- **Node.js**: `^20.x` or `^22.x`
- **npm**: `^10.x` or `^11.x`
- *(Optional)* **Stripe CLI**: For local Stripe webhook forwarding

---

## ⚙️ Installation & Setup

### ⚡ Quick Start (Automated)

The project includes an automated setup script in `composer.json`. Run:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/testimonials.git
cd testimonials

# 2. Run automated setup (copies .env, generates key, installs dependencies, runs migrations)
composer run setup

# 3. Seed demo data (creates demo user, space & realistic testimonials)
php artisan db:seed

# 4. Link public storage (for avatars and uploaded photos)
php artisan storage:link

# 5. Build frontend assets
npm run build
```

---

### 🔧 Manual Step-by-Step Installation

If you prefer installing dependencies manually step-by-step:

#### 1. Clone the repository
```bash
git clone https://github.com/your-username/testimonials.git
cd testimonials
```

#### 2. Install PHP dependencies
```bash
composer install
```

#### 3. Install Node.js dependencies
```bash
npm install
```

#### 4. Configure Environment
Copy the example environment configuration:
```bash
cp .env.example .env
```

Generate the unique application encryption key:
```bash
php artisan key:generate
```

#### 5. Database Setup
By default, the application is configured to use **SQLite** with zero external database configuration:

```bash
# Ensure SQLite database file exists (if not created automatically)
touch database/database.sqlite

# Run all database migrations
php artisan migrate
```

> **Using MySQL instead?**
> Update `.env` with your credentials:
> ```ini
> DB_CONNECTION=mysql
> DB_HOST=127.0.0.1
> DB_PORT=3306
> DB_DATABASE=testimonials
> DB_USERNAME=root
> DB_PASSWORD=your_password
> ```

#### 6. Seed Demo Data
Populate the database with a pre-configured user, sample space, and realistic customer testimonials:
```bash
php artisan db:seed
```

#### 7. Link Public Storage
Required for serving uploaded user avatars and respondent profile photos:
```bash
php artisan storage:link
```

#### 8. Build Frontend Assets
Compile React, Tailwind CSS v4, and Wayfinder TypeScript bindings:
```bash
npm run build
```

---

## 🏃 Running the Application

### Option A: Unified Dev Process (Recommended)
You can run the web server, background queue worker, and Vite dev server concurrently with one command:

```bash
composer run dev
```

### Option B: Separate Terminal Processes

1. **Start the Laravel backend server**:
   ```bash
   php artisan serve
   ```
   *(Access the app at `http://localhost:8000`)*

2. **Start the background queue worker** (for email notifications & background tasks):
   ```bash
   php artisan queue:listen
   ```

3. **Start the Vite development server** (for HMR hot reloading):
   ```bash
   npm run dev
   ```

---

## 🔑 Default Demo Credentials

After running `php artisan db:seed`, log in with:

- **Email**: `test@example.com`
- **Password**: `password`

You will immediately see the pre-populated **CloudScale DevOps** collection space with verified testimonials and analytics.

---

## 💳 Stripe Billing & Webhook Configuration (Optional)

To enable Pro subscription upgrades and customer portal management locally:

1. Create a free account at [stripe.com](https://stripe.com).
2. Create a recurring monthly product and copy its Price ID (`price_...`).
3. Add your Stripe test credentials to `.env`:
   ```ini
   STRIPE_KEY=pk_test_...
   STRIPE_SECRET=sk_test_...
   STRIPE_PRO_PRICE_ID=price_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. To test webhooks locally using the [Stripe CLI](https://stripe.com/docs/stripe-cli):
   ```bash
   stripe listen --forward-to localhost:8000/stripe/webhook
   ```
   Copy the webhook signing secret output by Stripe CLI into `STRIPE_WEBHOOK_SECRET` in `.env`.

---

## 🧪 Testing & Quality Assurance

The repository features comprehensive automated and browser-based test coverage:

```bash
# Run all automated tests (Feature and Unit via Pest)
php artisan test --compact

# Run tests directly with Pest runner
vendor/bin/pest

# Run automated code styling via Laravel Pint
vendor/bin/pint

# Run TypeScript type checks
npm run types:check

# Generate Wayfinder route and action bindings
php artisan wayfinder:generate
```

### Visual & Browser Testing Tools
- **Chrome DevTools MCP**: Automated testing was used to inspect viewport layouts at 1440px desktop, tablet, and 375px mobile viewports, verifying form interactions, celebratory modal dialogs, and avatar file uploads.

---

## 📁 Project Architecture

```
├── app/
│   ├── Concerns/              # ProfileValidationRules & shared validation logic
│   ├── Http/
│   │   ├── Controllers/       # Space, Testimonial, Embed, Settings, Billing & Dashboard
│   │   ├── Requests/          # Form requests with strict validation & rate limits
│   │   └── Middleware/        # Rate limiting, auth, Inertia share & Fortify middleware
│   ├── Mail/                  # NewTestimonialReceivedMail queued notification
│   ├── Models/                # User, Space, Testimonial, EmbedConfiguration
│   ├── Policies/              # SpacePolicy, TestimonialPolicy (Tenant isolation)
│   └── Services/              # PlanLimitService (Free vs Pro limit enforcement)
├── database/
│   ├── factories/             # Eloquent factories for User, Space & Testimonial
│   ├── migrations/            # Database schema & Cashier migration tables
│   └── seeders/               # DatabaseSeeder with realistic sample data
├── resources/
│   ├── css/                   # Global Tailwind CSS v4 design tokens
│   └── js/
│       ├── actions/           # Wayfinder typed controller actions
│       ├── components/        # Radix UI, StarRating, Avatar, DeleteUser, Cards
│       ├── layouts/           # AppLayout, SettingsLayout, AuthLayouts
│       ├── routes/            # Wayfinder typed route definitions
│       └── pages/
│           ├── billing/       # Subscription plans & billing management
│           ├── dashboard/     # Metric cards, statistics & space overview
│           ├── embeds/        # Embed builder & Wall of Love generator
│           ├── public/        # Responsive public submission form & celebration modal
│           ├── settings/      # Profile (avatar uploader), Security (2FA), Appearance
│           ├── spaces/        # Space creation, editing & settings
│           └── testimonials/  # Moderation inbox, approvals & Wall of Love curation
├── public/
│   ├── embed.js               # Lightweight standalone embed loader script
│   └── embed-demo.html        # Interactive embed preview demo
├── routes/
│   ├── web.php                # Web routes & Wayfinder typed endpoints
│   └── settings.php           # Settings, profile, security & appearance routes
└── tests/
    └── Feature/               # Pest feature tests covering all critical paths
```

---

## 🛡️ Security & Privacy Guarantees

- **Tenant Isolation**: Every owner resource is secured via Laravel Policies. Cross-tenant access is strictly prohibited.
- **Privacy Redaction**: Respondent emails are strictly kept private and never exposed in public widget payloads.
- **Spam & Anti-Bot**: Honeypot inputs silently discard automated bot spam without affecting real users.
- **Safe File Storage**: Avatars and submission photos are strictly validated (mimes: jpg, jpeg, png, webp, max 2MB) and stored on the public disk with automatic file replacement.
- **Idempotent Webhooks**: Stripe webhook handling utilizes database locks and idempotency keys to prevent duplicate subscriptions or double-processing.

---

## 📄 License

This software is open-source and licensed under the [MIT License](LICENSE).
