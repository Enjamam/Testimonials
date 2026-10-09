# GitHub Copilot Repository Instructions

The canonical project context is `CONTEXT.md`.

Before coding, read:
- `CONTEXT.md`
- `AGENTS.md`
- the relevant document under `docs/`
- the existing code related to the task

Follow the project architecture and security invariants defined in those files.

Do not:
- invent new product scope
- bypass authorization
- put security/business rules only in the client
- expose private respondent information
- trust Stripe browser redirects as payment confirmation
- commit secrets
- make unrelated refactors

For every meaningful change:
1. inspect existing implementation
2. implement the smallest safe change
3. add/update tests
4. run relevant tests
5. review the diff
6. update implementation status/docs if needed

Use the handoff format defined in `AGENTS.md`.
