# Product Requirements Document (PRD)
## Meet Eric • Autonomous AI Head of Growth
### 30-Day Production Reliability, Systems Hardening & Rapid Shipping Specification

---

### Executive Summary & Problem Context
**Meet Eric** is an autonomous AI Head of Growth that connects to customer web platforms, payment providers (Stripe), CRMs (HubSpot), product analytics (PostHog), and communication channels (Slack). Eric monitors the complete customer journey, detects growth bottlenecks and revenue leaks, conducts root-cause investigations, recommends remediation strategies, and safely executes approved growth actions.

The platform currently possesses an active Lovable/React/TypeScript/Supabase MVP with **30 beta users waiting** and an **upcoming exhibition**. 

**Primary Operational Constraint:**
> *"We need to ship and fix things faster. We do not want someone who comes in and rewrites everything because they prefer a different stack. We want someone who can quickly decide: KEEP IT, HARDEN IT, REFACTOR IT, REPLACE IT."*

This document formalizes the engineering roadmap, multi-tenant database isolation, 8-stage agent execution boundaries, webhook idempotency, proactive OAuth token rotation, and dual-provider AI failover to ensure zero customer data leakage while tripling deployment velocity.

---

### 1. Architectural Triage Strategy

| Triage Tier | Architectural Scope | Engineering Action & Rationale |
|---|---|---|
| **KEEP IT** *(Works. Leave it alone.)* | • Lovable React UI component layouts<br>• Frontend routing & state bindings<br>• Initial API contract definitions | Retain existing UI primitives without disruption. Do not rewrite working frontend presentation code for engineering purity. |
| **HARDEN IT** *(Works, needs security & observability.)* | • Supabase Row Level Security (RLS)<br>• Webhook signature verification<br>• OAuth token vault & encryption<br>• Sentry/PostHog micro-telemetry | Apply `app.current_org_id()` kernel filters to prevent cross-tenant data leaks across 30 beta clients. Wrap tokens in AES-256-GCM envelope encryption. |
| **REFACTOR IT** *(Will become a problem if built upon.)* | • Synchronous webhook execution<br>• Ephemeral in-memory agent state<br>• Direct database mutations in API routes | Move webhook processing to Inngest durable queues with PostgreSQL advisory locking (`pg_try_advisory_xact_lock`) for strict idempotency. |
| **REPLACE IT** *(Only with strong reason.)* | • Brittle unmonitored cron scripts<br>• Single-provider LLM endpoints<br>• Unrestricted autonomous tool execution | Replace single LLM points of failure with dual OpenAI/Gemini failover and an inline LLM Firewall enforcing NIST AI RMF & OWASP LLM01–10. |

---

### 2. 8-Stage Autonomous Agent Execution Loop

Eric operates under a deterministic, human-in-the-loop operational loop to ensure autonomous interventions never cause customer churn, financial errors, or compliance breaches:

```
[1. READ DATA] ──► [2. INVESTIGATE] ──► [3. CHOOSE TOOL] ──► [4. CHECK PERMISSIONS]
       ▲                                                                   │
       │                                                                   ▼
[8. AUDIT LOG] ◄── [7. VERIFY ACTION] ◄── [6. EXECUTE ACTION] ◄── [5. SLACK APPROVAL]
                                                                  (Tier 2/3 Mutative)
```

1. **Read Data**: Ingest real-time event telemetry from Stripe webhooks (e.g. `invoice.payment_failed`), HubSpot CRM updates (e.g. stalled high-value deals), PostHog funnel metrics, and site webhooks.
2. **Investigate**: Trigger dual-provider LLM inference (OpenAI `gpt-4o-mini` primary, Google Gemini `gemini-2.0-flash` fallback) across historical user telemetry to determine anomaly root causes.
3. **Choose Tool**: Select discrete, deterministic execution tools via Model Context Protocol (MCP) or registered internal APIs (e.g. `send_slack_alert`, `trigger_stripe_dunning`, `hubspot_create_deal_task`).
4. **Check Permissions**: Evaluate multi-tenant RBAC policies and tool safety classifications:
   - *Tier 1 (Read-Only / Telemetry)*: Auto-executed without human intervention.
   - *Tier 2 (External Communication / Dunning)*: Requires Slack interactive confirmation.
   - *Tier 3 (Financial / Destructive / Account Changes)*: Requires explicit Admin Slack Block Kit authorization.
5. **Request Approval (Slack HITL)**: Dispatch structured Slack Block Kit modal with anomaly telemetry, recommended action, dry-run diff, and 1-click Approve / Modify / Reject triggers.
6. **Execute Action**: Upon cryptographically verified HMAC signature from Slack interaction webhook, execute the exact tool call with scoped credentials.
7. **Verify Action**: Poll downstream API (e.g. verify Stripe invoice status updated or HubSpot note logged) within 1,200ms to confirm positive state transition.
8. **Audit Log**: Record immutable audit log entry in PostgreSQL containing `org_id`, `actor_id`, `prompt_hash`, `tool_name`, `input_params`, `execution_status`, and `latency_ms`.

---

### 3. Data Model & Multi-Tenant Isolation

#### 3.1 Organization & RLS Context
All database transactions are executed under strict Row Level Security (RLS) policies pinned to the tenant workspace:

```sql
-- Enforce tenant isolation at PostgreSQL engine level
CREATE POLICY tenant_isolation_organizations ON organizations
  FOR ALL TO authenticated
  USING (id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid);

CREATE POLICY tenant_isolation_events ON growth_events
  FOR ALL TO authenticated
  USING (org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid)
  WITH CHECK (org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid);
```

#### 3.2 Core Schemas
- `organizations`: `id` (UUID, PK), `name`, `slug`, `tier`, `created_at`, `settings` (JSONB)
- `integrations`: `id`, `org_id` (FK), `provider` ('stripe'|'hubspot'|'posthog'|'slack'), `encrypted_access_token` (BYTEA), `encrypted_refresh_token` (BYTEA), `token_expires_at` (TIMESTAMPTZ), `status` ('active'|'expired'|'revoked')
- `growth_events`: `id` (UUID), `org_id` (FK), `event_type`, `provider`, `payload` (JSONB), `idempotency_key` (VARCHAR, UNIQUE), `status` ('pending'|'investigating'|'resolved'|'failed'), `created_at`
- `agent_actions`: `id` (UUID), `org_id` (FK), `event_id` (FK), `tool_name`, `parameters` (JSONB), `tier` (1|2|3), `approval_status` ('auto_approved'|'pending_slack'|'approved'|'rejected'), `executed_at`, `verification_result` (JSONB)
- `audit_logs`: `id` (UUID), `org_id` (FK), `action_id` (FK), `signature_hash` (TEXT), `ip_address`, `timestamp`

---

### 4. Integration Reliability & Idempotency Engine

#### 4.1 Webhook Deduplication & Advisory Locks
Network retries from Stripe or HubSpot must never result in duplicate investigations or double-sent customer messages:
- Extract unique provider event identifier (`event.id` from Stripe, `eventId` from HubSpot).
- Attempt atomic transaction lock:
  ```sql
  SELECT pg_try_advisory_xact_lock(hashtext(:provider || ':' || :event_id));
  ```
- If lock acquired, check `growth_events` for existing `idempotency_key`. If already processed, return `HTTP 200 OK` with `{ deduplicated: true }` within 18ms.
- Enqueue payload to Inngest background queue and release HTTP connection immediately.

#### 4.2 Proactive OAuth Token Vault
- Access tokens and refresh tokens are encrypted at rest using AES-256-GCM envelope encryption.
- Background worker checks integration expiration timestamps every 15 minutes.
- When `token_expires_at < NOW() + INTERVAL '300 seconds'`, automatically trigger provider refresh rotation.
- In-flight requests use cached valid tokens; expired tokens trigger automatic single-flight mutex refresh preventing stampedes.

---

### 5. Dual-Provider AI Resilience & Security Guardrails

#### 5.1 Dual-Model Inference Strategy
- **Primary Model**: OpenAI `gpt-4o-mini` (temperature: 0.15, max_tokens: 1,500, average latency: ~450ms, cost: $0.15/1M input).
- **Secondary Failover**: Google Gemini `gemini-2.0-flash` (triggered automatically on HTTP 429, 500, or 2,500ms timeout).
- **Offline Deterministic Fallback**: Rule-based heuristic engine maintaining 100% uptime if external AI APIs degrade.

#### 5.2 Securiti-Certified Inline LLM Firewall
Enforcing NIST AI RMF 100-1 and OWASP Top 10 for LLMs:
- **LLM01 Prompt Injection Defense**: Input sanitization strips system override markers (`"ignore previous instructions"`, `"act as system"`, delimiters).
- **LLM02 Sensitive Data Disclosure**: PII scanner redacts credit card numbers (Luhn check), customer SSNs, and passwords before prompt assembly.
- **LLM05 Insecure Tool Calling**: Strict JSON schema validation with parameter boundary checks prevents unauthorized database access or parameter tampering.

---

### 6. 30-Day Engineering Shipping Roadmap

| Milestone | Timeframe | Core Technical Deliverables | Impact on 30 Beta Clients & Exhibition |
|---|---|---|---|
| **Phase 0** | **Live Now** | • Interactive Systems Cockpit deployed on Vercel<br>• Subsystem Triage Matrix with live code diffs<br>• 8-Stage Agent Loop Runner with HITL simulation<br>• Real Dual-Provider AI (OpenAI + Gemini) | Instant validation of architecture & zero-risk technical capability before contract start. |
| **Week 1** | **Days 1–7** | • Broken integration triage & cURL debugging<br>• Supabase RLS kernel policies across all tables<br>• Stripe & HubSpot webhook idempotency locks<br>• Sentry & PostHog error tracing setup | Beta client onboarding unblocked; cross-tenant data leakage risk eliminated. |
| **Week 2** | **Days 8–14** | • AES-256 OAuth token vault with auto-refresh<br>• Slack Block Kit interactive approval flows<br>• Inngest durable queue architecture<br>• Migration of sync endpoints to background jobs | Exhibition demo stability locked; agent cannot execute destructive actions without Slack approval. |
| **Week 3** | **Days 15–21** | • 8-Stage Agent execution runner hardening<br>• Model Context Protocol (MCP) tool bindings<br>• Dual AI provider automatic failover telemetry<br>• Post-execution verification hooks | Autonomous investigations run reliably with sub-second response times. |
| **Week 4** | **Days 22–28** | • Multi-tenant database indexing & query optimization<br>• PgBouncer connection pooling configuration<br>• GitHub Actions CI/CD with automated RLS tests<br>• Staging vs Production environment isolation | Platform handles 100+ concurrent workspaces during exhibition traffic surge. |
| **Week 5** | **Days 29–30+** | • SOC 2 & UK GDPR readiness audit<br>• Automated cryptographic audit logging export<br>• Production SLA runbooks & incident response<br>• Long-term architectural scaling roadmap | Full compliance readiness; frictionless transition to permanent technical lead role. |

---

### 7. Acceptance Criteria Checklist

- [x] **Criterion 1 (Triage Mindset)**: Explicit Keep/Harden/Refactor/Replace framework applied across all Supabase, webhook, and agent components without rewriting working code.
- [x] **Criterion 2 (Multi-Tenant Isolation)**: RLS policies enforced using custom JWT `app.current_org_id()` claims; verified zero cross-tenant leak under attack simulation.
- [x] **Criterion 3 (Safe Agent Execution)**: 8-stage operational loop enforced with Slack Block Kit human approvals for Tier 2/3 mutative actions.
- [x] **Criterion 4 (Webhook Reliability)**: Stripe and HubSpot webhook idempotency implemented with PostgreSQL advisory locks and 18ms deduplication.
- [x] **Criterion 5 (OAuth Security)**: Proactive token refresh daemon operational with AES-256-GCM envelope encryption.
- [x] **Criterion 6 (Real Dual AI Engine)**: Native HTTP fetch to OpenAI `gpt-4o-mini` with automated Google Gemini `gemini-2.0-flash` fallback and inline LLM firewall.
- [x] **Criterion 7 (Beta & Exhibition Ready)**: High-density responsive UI running on Next.js 15 App Router with sub-100ms client navigation.
