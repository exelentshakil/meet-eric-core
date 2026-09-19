ERIC

hi paul,

built a working systems reliability cockpit for meet eric ahead of bidding so you can verify how i think, test, and ship:
https://meet-eric-core.vercel.app
(github: https://github.com/exelentshakil/meet-eric-core)

here are the direct answers to your 3 questions:

1. relevant experience:
closest product is the legiit enterprise command center ($1m arr marketplace with 1,500+ businesses and 1m+ orders) where i served as lead engineer for 4 years. personally responsible for multi-tenant data isolation, stripe webhook idempotency under traffic spikes, proactive oauth token vaults, and background queue workers. also rescued multiple stalled lovable/supabase mvps by enforcing strict architectural triage: keep working ui, harden rls policies, refactor sync webhooks into durable inngest queues, and replace single-llm points of failure with dual openai/gemini failover.
video intro (<5 min): https://youtube.com/shorts/kK3XZd5PNOk

2. ai development:
i use claude code and cursor as force multipliers, not crutches. i orchestrate agentic workflows with strict schemas, test-driven boundary prompts, and pre-commit hooks. my senior judgment steps in to catch rls leaks, audit generated sql, enforce postgres advisory locks (pg_try_advisory_xact_lock) for webhook idempotency, and guarantee zero prompt injection (securiti certified in nist ai rmf & owasp llm01-10). ai triples my shipping velocity; my systems background guarantees production reliability.

3. availability:
can start immediately today. committed to 25-30 hours/week over the next two weeks to unblock your 30 beta users and lock down stability ahead of the exhibition.

which area is your highest priority to tackle first?
a) broken stripe/hubspot webhooks & rls audit
b) 8-stage agent loop & slack hitl approvals
c) oauth token vault & background queues

shaq
founder, barakahsoft
former lead engineer at legiit | securiti certified ai architect
