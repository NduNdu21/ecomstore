# Copilot Agent Instructions — Ecommerce App (Next.js + Supabase)

## Purpose
These instructions govern how the Copilot coding agent operates in this repo. The goal is fast, reliable implementation help without ceding architectural control. The agent implements; the human decides structure.

## 1. Decisions the agent must NOT make unilaterally
The agent must stop and propose a plan (not code) before touching any of the following, and wait for explicit approval:

- **Database schema** — new tables, columns, relationships, RLS policies, migrations. Supabase schema changes are structural, not implementation detail.
- **Folder/module structure** — new top-level directories under `app/`, `lib/`, `components/`, or any reorganization of existing structure.
- **Routing structure** — new route segments, route groups, or changes to the app's URL/navigation shape.
- **State management approach** — introducing a state library, context providers, or changing how data flows between server/client components.
- **Auth/session strategy** — anything touching Supabase Auth flows, middleware, or session handling.
- **New dependencies** — any package addition. List the package, why it's needed, and lighter alternatives considered.
- **API contract changes** — Supabase RPC signatures, Next.js Route Handler request/response shapes, or anything another part of the app depends on.
- **Payment/checkout logic** — flag explicitly; this is the highest-risk surface in an ecommerce app and must be reviewed line by line, not just architecturally.

For all of the above: agent posts a short written plan (what, why, alternatives considered, blast radius) and waits. No code until approved.

## 2. Decisions the agent CAN make without asking
- Implementation details within an already-approved structure (function bodies, styling, small refactors inside a single file).
- Bug fixes that don't change public interfaces.
- Test writing for existing behavior.
- Naming of local variables, non-exported helpers.

## 3. Required workflow
1. **Plan before code** for anything in Section 1.
2. **One concern per PR/commit.** No bundling a schema change with unrelated UI work.
3. **Explain the "why," not just the "what"** in PR descriptions — the agent must state the reasoning and trade-offs, not just describe the diff.
4. **Never auto-merge.** All agent PRs require manual review and approval before merge, regardless of CI status.
5. **No silent migrations.** Any Supabase migration must be a separate, clearly labeled file the agent flags for manual review before it's applied to any environment.
6. **Supabase CLI is not connected in this project.** The agent must never attempt to run `supabase db push`, `supabase migration up`, or any other command that applies a migration directly. Migrations are written to `supabase/migrations/` as `.sql` files only; the human applies them manually via the Supabase Studio SQL editor.
7. **Surface uncertainty.** If the agent is not confident about a Supabase RLS policy, auth edge case, or payment flow, it must say so explicitly rather than proceeding with a best guess.

## 4. Project conventions (fill in / adjust to match your actual choices)
- Framework: Next.js (App Router)
- Backend: Supabase (Postgres, Auth, RLS, Storage)
- Language: TypeScript, strict mode
- Styling: Tailwind CSS
- Package manager: npm
- Testing: Vitest + React Testing Library (unit/component), Playwright (E2E — checkout flow especially)

Keep this section current — the agent should treat it as ground truth for style and tooling, not infer conventions from whatever pattern it sees most in the codebase.

## 5. Escalation phrase
If the agent is unsure whether something counts as "structural," it should default to treating it as structural and ask. Err on the side of asking.