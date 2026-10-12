# Data Model & Entity Relationships — Testimonials SaaS

This document outlines the database schema, entity models, and relationships used across the Testimonials collection platform.

---

## 📊 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ SPACES : owns
    USERS ||--o{ SUBSCRIPTIONS : has
    SPACES ||--o{ TESTIMONIALS : collects
    SPACES ||--|| EMBED_CONFIGURATIONS : configures

    USERS {
        bigint id PK
        string name
        string email UK
        string avatar "Nullable storage path"
        timestamp email_verified_at
        string password
        string stripe_id "Nullable Cashier ID"
        string pm_type
        string pm_last_four
        timestamp trial_ends_at
        timestamps created_at_updated_at
    }

    SPACES {
        bigint id PK
        bigint user_id FK
        string name
        string slug
        string public_id UK "Unique external identifier"
        text prompt_title
        text prompt_message
        string theme "light | dark"
        boolean rating_enabled
        json field_configuration "Name, email, company, social, photo config"
        timestamps created_at_updated_at
    }

    TESTIMONIALS {
        bigint id PK
        bigint space_id FK
        string name
        string email "Strictly private - never in public embeds"
        string company_name
        string social_url
        string profile_photo_path
        text testimonial
        tinyint rating "1-5 stars"
        boolean consent_given "Marketing consent flag"
        boolean is_favorite
        boolean is_wall_of_love "Featured on public widget"
        boolean is_hidden "Moderation status"
        timestamp submitted_at
        timestamp deleted_at "Soft delete"
        timestamps created_at_updated_at
    }

    EMBED_CONFIGURATIONS {
        bigint id PK
        bigint space_id FK, UK
        string layout "grid | masonry | carousel"
        string theme "light | dark"
        integer item_limit
        json display_options "Show ratings, photos, companies, dates"
        timestamps created_at_updated_at
    }

    SUBSCRIPTIONS {
        bigint id PK
        bigint user_id FK
        string type "default"
        string stripe_id UK
        string stripe_status
        string stripe_price
        integer quantity
        timestamp ends_at
        timestamps created_at_updated_at
    }
```

---

## 🔍 Key Entity Descriptions

### 1. `User`
- **Role**: Account owner who creates collection spaces and moderates feedback.
- **Billable**: Integrated with Laravel Cashier (`stripe_id`, `pm_type`, `pm_last_four`).
- **Profile**: Includes custom avatar path (`avatar`), 2FA secrets, and Passkeys.

### 2. `Space`
- **Role**: Dedicated branded container for collecting customer testimonials.
- **Security**: Features an unguessable `public_id` used for public collection (`/s/{public_id}`) and embed endpoints (`/embed/{public_id}`).
- **Configuration**: Stores dynamic field requirements and rating options in JSON.

### 3. `Testimonial`
- **Role**: Individual customer review submitted through a public space.
- **Privacy Guarantee**: `email` is never included in public queries or API scopes.
- **Moderation Workflow**: Controlled via `is_hidden`, `is_favorite`, `is_wall_of_love`, and `consent_given`.
- **Retention**: Utilizes `SoftDeletes` for accidental deletion recovery.

### 4. `EmbedConfiguration`
- **Role**: Customization options for rendering the public Wall of Love widget.
- **Display Options**: Controls layout (masonry, grid, carousel) and visual elements (photos, company badges, star ratings).
