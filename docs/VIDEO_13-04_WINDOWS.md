# Video 13-04 → Windows + Antigravity + GitHub Copilot Setup

This document translates the workflow shown in **Agentic Engineering 13-04.mp4** from macOS to Windows.

## What the video actually does

1. Creates a Laravel 13 application using the Laravel installer.
2. Selects the React starter kit.
3. Uses Laravel's built-in authentication starter.
4. Does not enable Teams.
5. Enables email verification, registration, two-factor authentication, passkeys, and password confirmation.
6. Lets the installer set up Wayfinder, Pest, frontend dependencies, and Laravel Boost.
7. Keeps a PRD in `docs/PRD.md`.
8. Changes `.env` from SQLite to MySQL.
9. Runs a clean migration.
10. Installs/configures Laravel Cashier.
11. Adds the Cashier `Billable` concern to the User model.
12. Consults the current Laravel Cashier documentation for Stripe configuration.

## Windows equivalent

The Mac-specific elements are mainly paths and terminal/editor tools. Use:

```text
macOS: ~/Sites
Windows: $HOME\Herd   (C:\Users\<user>\Herd)
macOS: Terminal/Ghostty
Windows: PowerShell
macOS: Cmd shortcuts
Windows: Ctrl shortcuts
```

Laravel Herd is available for Windows and provides PHP, Composer, Laravel, Node, npm and related CLI tooling. Laravel's current documentation says Herd creates `%USERPROFILE%\Herd` and automatically serves Laravel applications there on a `.test` domain.

## Windows first-day sequence

### 1. Create the application

```powershell
cd $HOME\Herd
laravel new testimonials
```

Use the same interactive choices as the video:

```text
Starter kit: Yes
Frontend: React
Authentication: Laravel's built-in authentication
Teams: No
Authentication features:
- Email verification
- Registration
- Two-factor authentication
- Passkeys
- Password confirmation
```

If the currently installed Laravel installer presents different choices, follow the current options while keeping the product requirements in `CONTEXT.md` as the source of truth.

### 2. Enter the project

```powershell
cd $HOME\Herd\testimonials
code .
```

### 3. Configure MySQL

Edit `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=testimonials
DB_USERNAME=root
DB_PASSWORD=
```

Create the `testimonials` database using your local MySQL installation (XAMPP, Herd Pro, Laragon, standalone MySQL, etc.). Do not assume the password is blank unless that is how your local MySQL is configured.

### 4. Run migrations

For a new development database:

```powershell
php artisan migrate
```

When intentionally resetting the development database:

```powershell
php artisan migrate:fresh
```

### 5. Laravel Boost

The video installs Laravel Boost. For the current workflow:

```powershell
composer require laravel/boost --dev
php artisan boost:install
```

Use the GitHub Copilot / VS Code integration where applicable. Keep `CONTEXT.md` and `AGENTS.md` as the shared project context for Antigravity and Copilot.

### 6. Laravel Cashier

```powershell
composer require laravel/cashier
php artisan vendor:publish --tag="cashier-migrations"
php artisan migrate
```

Then update `App\Models\User` using the current Cashier documentation and the project's existing authentication traits. Run formatting/tests immediately after editing this file.

### 7. Stripe environment variables

```env
STRIPE_KEY=your-stripe-key
STRIPE_SECRET=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

Never commit real secrets.

### 8. Start development

Without Herd:

```powershell
npm install
npm run build
composer run dev
```

Or:

```powershell
php artisan serve
npm run dev
```

With Herd:

```powershell
cd $HOME\Herd\testimonials
herd open
```

Expected Herd URL:

```text
http://testimonials.test
```

## Command translation

| macOS video | Windows |
|---|---|
| `cd ~/Sites` | `cd $HOME\Herd` |
| `cd ~/Sites/testimonials` | `cd $HOME\Herd\testimonials` |
| `open .` | `code .` |
| `ls` | `Get-ChildItem` |
| `pwd` | `Get-Location` |
| `cp` | `Copy-Item` |
| `rm` | `Remove-Item` |
| `Cmd` | `Ctrl` |

Laravel commands themselves are generally the same on Windows:

```powershell
php artisan migrate
php artisan migrate:fresh
php artisan test
php artisan tinker
composer install
composer require laravel/cashier
npm install
npm run build
composer run dev
```

## Agentic-development order

Use this order after the technical foundation is ready:

```text
CONTEXT.md + AGENTS.md
        ↓
Discovery
        ↓
Bootstrap verification
        ↓
Domain/database
        ↓
Spaces
        ↓
Public testimonial collection
        ↓
Inbox/moderation
        ↓
Dashboard
        ↓
Embeds
        ↓
Cashier/Stripe
        ↓
Notifications
        ↓
Security audit
        ↓
QA
        ↓
Release
```

Antigravity should be the primary implementation agent. GitHub Copilot should be the secondary reviewer/test/security agent. Do not have both agents modify the same uncommitted feature at the same time.

## Important difference from copying the video literally

The video shows a real setup session and visibly encounters a PHP syntax error while editing the User model for Cashier. Do not blindly copy the exact code. Inspect the installed package versions, follow the current official documentation, format the file, and run the tests/build after each integration.
