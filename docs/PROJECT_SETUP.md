# Project Setup

## Prerequisites

Verify the versions recommended by the currently supported Laravel release before installation.

Required categories:

- PHP
- Composer
- Node.js
- npm/pnpm
- MySQL
- Git

## Bootstrap sequence

The coding agent should use the official Laravel installation flow appropriate for the selected Laravel version.

Then configure:

1. `.env`
2. MySQL database
3. Inertia + React
4. Tailwind
5. shadcn/ui
6. Authentication
7. Pest
8. Stripe/Cashier
9. Queue backend

## Environment categories

Expected configuration categories include:

```env
APP_URL=
DB_CONNECTION=mysql
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

QUEUE_CONNECTION=

STRIPE_KEY=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO_MONTHLY=
```

Do not place real secrets in repository files.

## Local services

Minimum:

- Laravel application
- MySQL
- Queue worker
- Vite development server

For Stripe local development, use the appropriate Stripe CLI/webhook forwarding workflow.

## First verification

The bootstrap agent must prove:

```text
App starts
Database connects
Auth page loads
Dashboard loads after login
React/Vite build succeeds
Pest suite runs
Queue worker starts
```

## Recommended development order

Do not configure production deployment first.

Get this sequence working locally:

```text
Auth
 -> Space
 -> Public form
 -> Submission
 -> Inbox
 -> Embed
 -> Billing
 -> Notifications
 -> Hardening
 -> Deployment
```
