# Architecture/Product Decisions

## ADR-001 — Modular Laravel Monolith

Decision:
Use one Laravel application with Inertia/React.

Reason:
The MVP has tightly coupled authentication, dashboard, public collection, billing and moderation workflows. Microservices would add unnecessary operational complexity.

## ADR-002 — Server-Side Plan Enforcement

Decision:
Plan limits are enforced in Laravel, not only in React.

Reason:
Client-side checks can be bypassed and concurrent requests can race.

## ADR-003 — Stripe Webhooks as Subscription Synchronization

Decision:
Use verified Stripe webhook events to synchronize local subscription state.

Reason:
Browser redirects are not authoritative payment confirmation.

## ADR-004 — Separate Public Data Boundary

Decision:
Public embed queries return an explicit display DTO/whitelist.

Reason:
The Testimonial model contains private email data and internal state that must never leak.

## ADR-005 — Soft Delete Testimonials

Decision:
Use soft deletion.

Reason:
Owners should be able to remove testimonials from active workflows without destroying historical records immediately.

## ADR-006 — Predefined Respondent Fields

Decision:
Support only a fixed field set in MVP.

Reason:
Custom field builders expand schema, validation, UI and public-rendering complexity. The video explicitly keeps custom fields out of scope.

## ADR-007 — Queued Notifications

Decision:
Queue owner email notifications.

Reason:
Public submission should not depend on email provider latency.
