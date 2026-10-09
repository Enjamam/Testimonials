# Agentic Engineering Workflow

## Principle

Do not ask one coding agent to invent product requirements, architecture, implementation and QA simultaneously.

Use specialized agents with a shared source of truth.

```text
Human brief
   |
   v
Product Agent
   |
   +--> PRD
   |
   v
Architecture Agent
   |
   +--> Architecture + decisions
   |
   v
Bootstrap Agent
   |
   +--> Working skeleton
   |
   v
Feature Agents
   |
   +--> Backend
   +--> Frontend
   +--> Billing
   +--> Embed
   |
   v
QA Agent
   |
   +--> Tests + defects
   |
   v
Security Agent
   |
   +--> Security findings
   |
   v
Review/Release Agent
   |
   +--> Final verification
```

## Shared contract

All agents must read:

1. `docs/PRD.md`
2. `docs/ARCHITECTURE.md`
3. `docs/IMPLEMENTATION_PLAN.md`

Feature agents must not silently expand scope.

## Handoff format

Every agent should report:

```text
STATUS: COMPLETE | BLOCKED | NEEDS_DECISION

CHANGED:
- ...

TESTS:
- ...

ASSUMPTIONS:
- ...

RISKS:
- ...

NEXT:
- ...
```

## Context discipline

Agents should:

- Read only relevant files first.
- Inspect before editing.
- Make small changes.
- Run focused tests after changes.
- Run the full relevant suite before handoff.
- Update documentation when architecture changes.
- Avoid unrelated refactors.

## Definition of agent completion

An agent is not complete merely because code compiles.

It must:

- Implement the requested behavior.
- Test it.
- Check failure paths.
- Preserve authorization.
- Update affected docs.
- Report assumptions.

## Recommended agent order

### 1. Product Agent

Output:

- PRD
- acceptance criteria
- scope boundaries

### 2. Architecture Agent

Output:

- architecture
- schema
- routes
- security model
- integration boundaries

### 3. Bootstrap Agent

Output:

- runnable Laravel project
- MySQL connection
- Inertia React
- UI system
- auth
- tests

### 4. Domain Agent

Output:

- migrations
- models
- policies
- services

### 5. Public Collection Agent

Output:

- public form
- validation
- submission
- rate limiting
- uploads

### 6. Inbox Agent

Output:

- moderation UI
- state transitions
- soft delete

### 7. Dashboard Agent

Output:

- stats
- graph
- usage banner

### 8. Embed Agent

Output:

- embed builder
- public renderer
- isolation

### 9. Billing Agent

Output:

- Checkout
- Cashier
- webhooks
- Customer Portal
- plan enforcement

### 10. QA Agent

Output:

- automated tests
- regression findings

### 11. Security Agent

Output:

- security findings
- fixes

### 12. Release Agent

Output:

- smoke result
- deployment checklist
- final status
