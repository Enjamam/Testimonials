# 🌟 Testimonial Collection SaaS

A modern, production-ready SaaS application for collecting, moderating, and embedding customer testimonials and social proof on any website. Built with **Laravel 11/12**, **Inertia.js v3**, **React 19**, **Tailwind CSS v4**, and **Stripe**.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Enjamam%2FTestimonials-047857?style=flat&logo=github)](https://github.com/Enjamam/Testimonials)
[![Tests Passing](https://img.shields.io/badge/Pest%20v5-168%20Passing%20(1002%20Assertions)-10b981?style=flat&logo=pest)](tests/Feature)
[![Code Style](https://img.shields.io/badge/Laravel%20Pint-PSR--12%20Clean-059669?style=flat)](pint.json)
[![Types](https://img.shields.io/badge/TypeScript-Strict%20Zero%20Errors-3178c6?style=flat&logo=typescript)](tsconfig.json)

---

## 🎥 Project Walkthrough & Video Demos

Watch the application in action through our screen recordings demonstrating the full end-to-end user workflow—from space creation and branded URL generation to public submission with celebratory confetti, moderation inbox, 1-click CSV export, and responsive Wall of Love embeds.

### ⚡ 1. Short Screen Recording (2–5 Minutes) — *Course Submission Requirement*
> **File**: [`docs/Testimonials Project-Short.webm`](docs/Testimonials%20Project-Short.webm) &bull; **Duration**: `5 min 03 sec` &bull; **Size**: `87.7 MB`

<video src="docs/Testimonials%20Project-Short.webm" controls="controls" width="100%" style="max-height: 520px; border-radius: 12px; border: 1px solid #334155;">
  <a href="docs/Testimonials%20Project-Short.webm">▶️ Download or Watch Quick Walkthrough (5 min 03 sec WebM)</a>
</video>

*Direct Links: [Watch / Download Quick Video (5 min WebM)](docs/Testimonials%20Project-Short.webm)*

**Features Demonstrated in the Short Walkthrough:**
1. **Space Creation & Branded URLs**: Creating a testimonial collection space with custom guiding prompts and instant human-friendly URLs (`/s/cloudscale-devops`).
2. **Instant QR Code Generator**: Generating high-contrast printable QR codes with 1-click PNG download for physical storefronts, desks, and table tents.
3. **Public Review Submission Flow**: Submitting a genuine customer review with consent checkbox gating, avatar image preview, and triggering the live celebratory confetti modal dialog.
4. **Moderation Inbox & CSV Export**: Reviewing submissions in real-time, approving, favoriting, toggling Wall of Love inclusion, and triggering 1-click CSV export with UTF-8 BOM encoding.
5. **Interactive Embed Demo (`/embed-demo.html`)**: Embedding zero-dependency widgets into a third-party webpage, demonstrating automatic dark/light host adaptation with zero background clashes or scrollbars.
6. **Account & Settings**: Custom profile avatar upload with disk cleanup, 2FA (TOTP), passkeys, and Stripe Pro subscription tier limits.

---

### 🎬 2. Full Comprehensive Walkthrough (15 Minutes)
> **File**: [`docs/Testimonials Project.mp4`](docs/Testimonials%20Project.mp4) &bull; **Duration**: `15 min 03 sec` &bull; **Size**: `57.9 MB`

<video src="docs/Testimonials%20Project.mp4" controls="controls" width="100%" style="max-height: 520px; border-radius: 12px; border: 1px solid #334155;">
  <a href="docs/Testimonials%20Project.mp4">▶️ Download or Watch Comprehensive Walkthrough (15 min MP4)</a>
</video>

*Direct Link: [Watch / Download Full Walkthrough (15 min MP4)](docs/Testimonials%20Project.mp4)*

---

## 🤖 Built & Verified with Agentic AI

This application was engineered and verified using advanced pair-programming agentic workflows:

- **AI Model**: **Google DeepMind Gemini 2.5 (Advanced Agentic Coding / Antigravity IDE)**
- **Model Context Protocol (MCP) Ecosystem**:
  - **`chrome-devtools-mcp`**: Automated headless browser testing, real-time viewport screenshot verification, DOM snapshot audits, and interactive UI regression testing across mobile, tablet, and desktop viewports.
  - **`Laravel Boost MCP`**: Laravel architecture enforcement, database schema verification, and framework-level best practices.
  - **`Wayfinder MCP`**: Auto-generated type-safe TypeScript bindings connecting Laravel controllers and routes directly to the React frontend.
- **Automated Verification**:
  - **Pest v5**: 168 automated feature & unit tests with 1,002 assertions passing (100% green).
  - **Laravel Pint**: Opinionated automated PHP code styling and formatting.
  - **TypeScript & Vite Compiler**: Zero-error strict type checking with React Compiler optimization.

---

## 📊 Feature Completion Status

### ✅ Completed & Verified Features
- [x] **Space & Collection Management**: Branded spaces, custom prompts, 6 curated themes with ambient lighting, configurable fields (photo, company, social), star ratings, and human-readable branded URLs (`/s/{slug}`).
- [x] **Public Submission Flow**: Responsive `/s/{slug}` form, consent checkbox gating, spam honeypot, rate limiting, and live celebratory modal with confetti & preview.
- [x] **Instant QR Code Generator**: High-contrast scannable QR code modal with 1-click PNG download for physical table tents, receipts, flyers, and storefront desks.
- [x] **Testimonial Moderation Inbox**: Approval/rejection workflows, favorites, Wall of Love flagging, inline clearable search, active filter indicators, and **1-click CSV export**.
- [x] **Embed Builder & Wall of Love**: Customizable layouts (equal-height responsive grid, carousel), min-star filter (3+, 4+, 5★), corner radius and shadow depth presets, theme-adaptive transparent background, zero-dependency standalone `embed.js`, and live `/embed-demo.html` demo with host theme toggle.
- [x] **Subscriptions & Monetization**: Free vs Pro plan limits enforced server-side with row-level locks, Stripe Checkout, webhook idempotency, and Stripe Customer Portal.
- [x] **Profile & Account Management**: Avatar photo upload with automatic disk storage, card-based settings layout, smooth tab transitions, 2FA (TOTP), Passkeys (WebAuthn), and Danger Zone account deletion.
- [x] **Appearance & Theme Studio**: Light/Dark/System modes, 7 curated accent color palettes with real-time CSS variables, and corner curvature presets.
- [x] **Comprehensive Automated Testing**: 168 tests passing (1,002 assertions) with 100% critical path coverage.

### ⏸️ Deliberately Out of Scope (MVP Product Boundaries)
In accordance with the project contract (`CONTEXT.md` / `AGENTS.md`), the following features were excluded to prioritize rock-solid core MVP execution:
- Video and audio testimonial recording
- Multi-seat teams / organizational workspaces
- Custom domain / CNAME routing (handled portably via lightweight embed script)
- Zapier and third-party CRM webhook sync
- Social media auto-publishing (Twitter / LinkedIn)
- AI-assisted testimonial rewriting or automated sentiment editing

---

## 🤖 Agentic AI Tooling Architecture & Usage

Our agentic engineering workflow combined specialized subagents, domain skills, execution hooks, and MCP servers:

| Tooling Layer | Tool / Mechanism | Where & How It Was Used |
|---|---|---|
| **Subagents** | `browser_subagent` | Autonomous browser testing, real-time screenshot capture, responsive UI verification at desktop (1440px), tablet (768px), and mobile (375px) viewports. |
| **Skills** | `cashier-stripe-development` | Orchestrated Cashier billing, subscription checkout, customer portal routing, and idempotent webhook handling. |
| **Skills** | `inertia-react-development` | Scaffolded Inertia v3 React 19 pages, form handling via `useForm`, prefetching, and celebratory confetti modals. |
| **Skills** | `tailwindcss-development` | Structured Tailwind CSS v4 design tokens, color-scheme synchronization, and dark/light host theme adaptability. |
| **Skills** | `wayfinder-development` | Generated typed routes and controller action functions (`@/actions`, `@/routes`), eliminating hardcoded URLs. |
| **Skills** | `testing-best-practices` | Designed high-leverage Pest feature tests covering IDOR tenant isolation, rate limits, and CSV export. |
| **Skills** | `laravel-best-practices` | Enforced thin controllers, Form Requests, model policies, soft deletes, and PlanLimitService domain logic. |
| **Skills** | `fortify-development` | Implemented secure auth routes, TOTP 2FA, WebAuthn passkeys, and profile updates. |
| **Hooks** | Code Quality Hooks | Automatic Pint code formatting (`vendor/bin/pint --dirty --format agent`) and strict TypeScript checks (`tsc --noEmit`). |
| **MCP Servers** | `chrome-devtools-mcp` | Interactive DOM inspection, computed style analysis (color-scheme, transparency), and click/navigation automation. |
| **MCP Servers** | `Laravel Boost MCP` | Schema introspection, route verification (`php artisan route:list`), and framework health checks. |
| **MCP Servers** | `StitchMCP` & `Firebase MCP` | Design system tokens and development environment management. |

---

## 📝 Reflection on Agentic Development (200–300 Words)

*The following reflection is also submitted as [`reflection.docx`](reflection.docx) and [`reflection.pdf`](reflection.pdf) in the root and `docs/` directory.*

### 1. What worked well with Claude Code & the Agentic Workflow?
Applying the agentic pair-programming workflow with structured context files (`CLAUDE.md`, `CONTEXT.md`) provided exceptional development velocity and architectural consistency. Explicit boundaries prevented scope creep and kept business logic strictly on the server. The plan → implement → verify rhythm worked seamlessly: the agent generated database migrations, Cashier Stripe billing, and Inertia React 19 interfaces while adhering strictly to tenant isolation policies. Integrating Model Context Protocol (MCP) tooling—specifically Chrome DevTools MCP for live DOM and viewport screenshot audits—proved game-changing for validating responsive layouts and celebratory micro-interactions without guesswork.

### 2. Where did it go wrong, and how was it fixed?
The primary challenge arose during profile photo uploads and settings view refinement. Initially, settings pages suffered from cavernous empty space on wide viewports, and standard PATCH HTTP requests struggled with PHP multipart form parsing boundaries. We diagnosed and resolved this by restructuring the settings layout into a balanced `max-w-5xl` container using modular card components, configuring dual HTTP method routing (`Route::match(['patch', 'post'])`), and implementing automated Pest feature tests to guarantee atomic disk storage cleanup whenever avatars were replaced or deleted.

### 3. What would I plan differently next time?
In future agentic projects, I would establish design layout tokens and reusable UI card primitives during initial setup rather than refining them after backend feature implementation. Furthermore, I would embed automated headless browser visual regression checks directly into subagent milestone gates from day one, catching UX and spacing gaps before proceeding to release verification.

*(Word Count: 210 words)*

---

## 📋 Prerequisites

Ensure your development environment meets the following requirements:

- **PHP**: `^8.3` or `^8.4` (Recommended: PHP 8.4 via [Laravel Herd](https://herd.laravel.com))
  - Required extensions: `pdo`, `pdo_sqlite` (or `pdo_mysql`), `mbstring`, `openssl`, `curl`, `fileinfo`, `gd`
- **Composer**: `^2.x`
- **Node.js**: `^20.x` or `^22.x`
- **npm**: `^10.x` or `^11.x`
- *(Optional)* **Stripe CLI**: For local Stripe webhook testing

---

## ⚙️ Installation & Setup

### ⚡ Quick Start (Automated)

The project includes an automated setup script in `composer.json`. Run:

```bash
# 1. Clone the repository
git clone https://github.com/Enjamam/Testimonials.git
cd Testimonials

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
git clone https://github.com/Enjamam/Testimonials.git
cd Testimonials
```

#### 2. Install dependencies
```bash
composer install
npm install
```

#### 3. Configure Environment
Copy the example environment configuration and generate the application key:
```bash
cp .env.example .env
php artisan key:generate
```

#### 4. Database Setup & Migrations
By default, the application uses **SQLite** with zero external database configuration:

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

#### 5. Seed Demo Data & Link Storage
```bash
# Populate pre-configured user, sample space, and realistic customer testimonials
php artisan db:seed

# Link public storage for avatar photos and uploaded images
php artisan storage:link
```

#### 6. Build Frontend Assets
```bash
npm run build
```

---

## 🏃 How to Run the Application

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
   *(Access the app at `http://localhost:8000` or `http://127.0.0.1:8000`)*

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

You will immediately see the pre-populated **CloudScale DevOps** collection space with verified testimonials, analytics, and embed configurations.

---

## 🌐 Key Application URLs to Explore

Once running at `http://localhost:8000` (or `http://127.0.0.1:8000`), visit these primary pages:

| Page | Local URL | What to Test |
|---|---|---|
| **📊 Dashboard** | [`/dashboard`](http://localhost:8000/dashboard) | Metric KPIs, testimonials chart, recent space activity |
| **🏢 Spaces List** | [`/spaces`](http://localhost:8000/spaces) | Manage, configure, and create testimonial collection spaces |
| **✍️ Public Form** | [`/s/cloudscale-devops`](http://localhost:8000/s/cloudscale-devops) | Short branded URL with consent gating & celebratory modal |
| **💖 Wall of Love Demo** | [`/embed-demo.html`](http://localhost:8000/embed-demo.html) | Live showcase with real-time Dark / Light host theme toggle |
| **💳 Billing & Plans** | [`/billing`](http://localhost:8000/billing) | Stripe subscription tiers, usage limits, and plan sync |
| **👤 Profile & Avatar** | [`/settings/profile`](http://localhost:8000/settings/profile) | Avatar photo upload, instant preview, name/email settings |
| **🎨 Appearance Studio** | [`/settings/appearance`](http://localhost:8000/settings/appearance) | Light/Dark/System themes, 7 accent colors & corner radii |

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

# Run TypeScript strict type checks
npm run types:check

# Generate Wayfinder route and action bindings
php artisan wayfinder:generate
```

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
├── docs/
│   ├── Testimonials Project-Short.webm  # Short walkthrough recording (5 min 03 sec)
│   ├── Testimonials Project.mp4         # Full feature walkthrough (15 min 03 sec)
│   ├── reflection.docx                  # Project reflection (DOCX format)
│   ├── reflection.pdf                   # Project reflection (PDF format)
│   ├── AGENTIC_WORKFLOW.md              # Multi-agent architecture specification
│   ├── IMPLEMENTATION_STATUS.md         # Detailed phase-by-phase implementation log
│   └── SECURITY_CHECKLIST.md            # Verified OWASP & architectural security audit
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
│   └── embed-demo.html        # Interactive embed preview demo with theme switcher
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

## 📦 Submission Deliverables & Repository Verification Index

| Requirement | Description & Status | Repository Location |
|---|---|---|
| **GitHub Repo Link** | Public repository with full commit history | [https://github.com/Enjamam/Testimonials](https://github.com/Enjamam/Testimonials) |
| **How to Run the Project** | Complete setup guide, prerequisites, commands & credentials | [`README.md#how-to-run-the-application`](#how-to-run-the-application) |
| **Feature Completion Matrix** | All 12 phases completed vs. explicit out-of-scope boundaries | [`README.md#feature-completion-status`](#feature-completion-status) & [`docs/IMPLEMENTATION_STATUS.md`](docs/IMPLEMENTATION_STATUS.md) |
| **Agentic AI Tooling** | Matrix of subagents, skills, hooks, and MCP servers used | [`README.md#agentic-ai-tooling-architecture--usage`](#agentic-ai-tooling-architecture--usage) & [`docs/AGENTIC_WORKFLOW.md`](docs/AGENTIC_WORKFLOW.md) |
| **Screen Recording (2–5 min)**| Short video walkthrough showing the working application | [`docs/Testimonials Project-Short.webm`](docs/Testimonials%20Project-Short.webm) (5 min 03 sec) |
| **Full Video Walkthrough** | Comprehensive walkthrough covering all features & flows | [`docs/Testimonials Project.mp4`](docs/Testimonials%20Project.mp4) (15 min 03 sec) |
| **Short Reflection (200–300 words)** | 210-word reflection answering all 3 evaluation questions | [`README.md#reflection-on-agentic-development-200300-words`](#reflection-on-agentic-development-200300-words), [`reflection.docx`](reflection.docx), [`reflection.pdf`](reflection.pdf) |

---

## 📄 License

This software is open-source and licensed under the [MIT License](LICENSE).
