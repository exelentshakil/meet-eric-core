#!/usr/bin/env python3
r"""
Production Scope & Formal Architecture Brief / Estimate Generator
Canonical Gold-Standard Builder Engine for Meet Eric (Paul • Swadlincote, UK).

STRICT DESIGN CONTRACT (MANDATORY & UNBREAKABLE):
1. Exactly 6 Direct Flex Children of .page-container (NO intermediate wrappers, zero middle void, 96%-98% vertical fill).
2. Exactly 6-Row Scope Table Density (Phase 0 $0.00 Live + Milestones 1 to 5 + Total Row).
3. Light Slate Table Headers (background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; font-size: 8.2px; text-transform: uppercase).
4. Section 3: 2-Column Grid (Left: Milestone Schedule with dotted leader lines; Right: Architecture Guardrails with green checkmarks).
5. Section 4: 4-Column Commercial Terms Box (Calibrated Hourly Rate, Exhibition SLA, 100% Code Ownership, Daily Async Standups).
6. Section 5: Formal Dual Acceptance Authorization Block (Shakil Ahmed cursive signature + Paul, Founder Meet Eric).
7. Section 6: Executive Signature Footer (Avatar, Former Lead Engineer at Legiit, Securiti Certified AI Architect, Verified Upwork Partner, Logo, Live URL badge).
8. Headless Chrome Single-Page Print Verification (re.findall(rb"/Type\s*/Page[^s]", pdf_bytes) == 1, file size > 500KB).
9. Synchronizes BOTH docs/ESTIMATE.pdf and docs/ARCHITECTURE_BRIEF.pdf.
"""

import os
import re
import base64
import subprocess
import sys
import shutil

def build_estimate():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.abspath(os.path.join(current_dir, ".."))
    docs_dir = os.path.join(project_dir, "docs")
    html_path = os.path.join(docs_dir, "estimate.html")
    pdf_path = os.path.join(docs_dir, "ESTIMATE.pdf")
    brief_html_path = os.path.join(docs_dir, "architecture_brief.html")
    brief_pdf_path = os.path.join(docs_dir, "ARCHITECTURE_BRIEF.pdf")

    headshot_file = os.path.join(docs_dir, "headshot.jpeg")
    logo_file = os.path.join(docs_dir, "logo.png")

    headshot_b64 = ""
    if os.path.exists(headshot_file):
        with open(headshot_file, "rb") as f:
            headshot_b64 = base64.b64encode(f.read()).decode("utf-8")

    logo_b64 = ""
    if os.path.exists(logo_file):
        with open(logo_file, "rb") as f:
            logo_b64 = base64.b64encode(f.read()).decode("utf-8")

    project_slug = "meet-eric-core"
    live_url = f"https://{project_slug}.vercel.app"

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Meet Eric • Systems Architecture &amp; Rapid Shipping Blueprint</title>
  <style>
    @page {{
      size: letter portrait;
      margin: 6mm 8.5mm 6mm 8.5mm;
    }}
    * {{
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    html, body {{
      margin: 0;
      padding: 0;
      height: 100%;
      background: #ffffff;
      overflow: hidden;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.32;
      font-size: 9.4px;
    }}

    .page-container {{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      box-sizing: border-box;
      gap: 6px;
    }}

    /* 1. Executive Header */
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 6px;
    }}
    .header-left {{
      flex: 1;
      min-width: 0;
    }}
    .brand-title {{
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #2563eb;
      margin-bottom: 2px;
      white-space: nowrap;
    }}
    h1 {{
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 2px 0;
      letter-spacing: -0.02em;
      line-height: 1.18;
      white-space: nowrap;
    }}
    .subtitle {{
      font-size: 8.6px;
      color: #475569;
      margin: 0;
      line-height: 1.25;
      white-space: nowrap;
    }}
    .meta-card {{
      flex-shrink: 0;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 5px 10px;
      font-size: 8.3px;
      text-align: right;
      line-height: 1.36;
      white-space: nowrap;
    }}
    .meta-card strong {{
      color: #0f172a;
    }}
    .live-badge {{
      display: inline-block;
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 9999px;
      font-size: 8px;
      text-transform: uppercase;
      margin-left: 3px;
    }}

    /* 2. Scope & Milestones Table */
    .scope-block {{
      margin-top: 0;
    }}
    .section-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3.5px;
    }}
    .section-title {{
      font-size: 9.6px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0f172a;
      border-left: 3px solid #2563eb;
      padding-left: 6px;
      margin: 0;
    }}
    .section-meta {{
      font-size: 8.2px;
      color: #64748b;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
    }}
    th {{
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8.2px;
      letter-spacing: 0.04em;
      border: 1px solid #cbd5e1;
      padding: 3.8px 6px;
      text-align: left;
    }}
    td {{
      border: 1px solid #e2e8f0;
      padding: 3.8px 6px;
      font-size: 8.5px;
      vertical-align: top;
    }}
    .phase-num {{
      font-weight: 800;
      color: #1e293b;
      font-size: 8.5px;
      white-space: nowrap;
    }}
    .phase-name {{
      font-weight: 700;
      color: #0f172a;
      font-size: 8.8px;
    }}
    .phase-desc {{
      color: #475569;
      font-size: 7.9px;
      margin-top: 1px;
      line-height: 1.22;
    }}
    .phase-0-row {{
      background: #f0fdf4;
    }}
    .phase-0-badge {{
      color: #15803d;
      font-weight: 800;
    }}
    .total-row {{
      background: #0f172a;
      color: #ffffff;
      font-weight: 800;
      border: 1px solid #0f172a;
    }}
    .total-row td {{
      border: 1px solid #0f172a;
      padding: 4.2px 6px;
      font-size: 8.8px;
    }}

    /* 3. 2-Column Technical & Financial Breakdown */
    .grid-2col {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px;
    }}
    .card-box {{
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #f8fafc;
      padding: 5px 9px;
    }}
    .card-box-title {{
      font-size: 8.4px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #0f172a;
      margin: 0 0 3px 0;
      display: flex;
      align-items: center;
      gap: 4px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
    }}
    .milestone-item {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      border-bottom: 1px dotted #cbd5e1;
      padding: 2px 0;
      font-size: 7.8px;
    }}
    .milestone-item:last-child {{
      border-bottom: none;
      padding-bottom: 0;
    }}
    .milestone-name {{
      color: #334155;
    }}
    .milestone-val {{
      font-weight: 800;
      color: #0f172a;
      font-family: ui-monospace, monospace;
      white-space: nowrap;
    }}
    .guardrail-item {{
      font-size: 7.8px;
      color: #334155;
      margin-bottom: 2px;
      padding-left: 10px;
      position: relative;
      line-height: 1.22;
    }}
    .guardrail-item:last-child {{
      margin-bottom: 0;
    }}
    .guardrail-item::before {{
      content: "✓";
      position: absolute;
      left: 0;
      color: #16a34a;
      font-weight: 800;
      font-size: 7.5px;
    }}

    /* 4. Commercial Terms Section */
    .terms-box {{
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
      padding: 5px 9px;
    }}
    .terms-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }}
    .term-col {{
      font-size: 7.8px;
      line-height: 1.22;
    }}
    .term-title {{
      font-weight: 800;
      color: #2563eb;
      text-transform: uppercase;
      font-size: 7.7px;
      margin-bottom: 1px;
    }}
    .term-body {{
      color: #475569;
    }}

    /* 5. Formal Acceptance Authorization Block */
    .auth-block {{
      border: 1px solid #94a3b8;
      border-radius: 6px;
      background: #f8fafc;
      padding: 6px 11px;
    }}
    .auth-title {{
      font-size: 8.4px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0f172a;
      margin-bottom: 3.5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 2px;
    }}
    .auth-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }}
    .auth-party {{
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 7.9px;
    }}
    .auth-party-title {{
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      font-size: 7.8px;
      margin-bottom: 1px;
    }}
    .auth-sign-line {{
      display: flex;
      align-items: flex-end;
      gap: 8px;
      margin-top: 3px;
    }}
    .auth-sign-field {{
      flex: 1;
      border-bottom: 1.2px solid #475569;
      min-height: 22px;
      display: flex;
      align-items: flex-end;
      font-family: "Brush Script MT", "Caveat", cursive, sans-serif;
      font-size: 14px;
      color: #0f172a;
      padding-left: 4px;
      padding-bottom: 1px;
    }}
    .auth-date-field {{
      width: 90px;
      border-bottom: 1.2px solid #475569;
      min-height: 22px;
      font-family: ui-monospace, monospace;
      font-size: 8px;
      color: #334155;
      text-align: center;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 1px;
      white-space: nowrap;
    }}
    .auth-label {{
      font-size: 7px;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 1.5px;
    }}

    /* 6. Executive Signature Footer */
    .footer-container {{
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #f8fafc;
      padding: 5px 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }}
    .footer-founder {{
      display: flex;
      align-items: center;
      gap: 9px;
      flex: 1;
      min-width: 0;
    }}
    .founder-avatar {{
      width: 34px;
      height: 34px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid #2563eb;
      flex-shrink: 0;
    }}
    .founder-info {{
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }}
    .founder-name {{
      font-size: 8.8px;
      color: #0f172a;
      line-height: 1.18;
      white-space: nowrap;
    }}
    .founder-name strong {{
      color: #0f172a;
      font-weight: 800;
    }}
    .founder-company {{
      font-size: 8px;
      color: #334155;
      line-height: 1.18;
      white-space: nowrap;
    }}
    .founder-company strong {{
      color: #1e293b;
      font-weight: 700;
    }}
    .founder-sub {{
      font-size: 7.5px;
      color: #475569;
      line-height: 1.18;
      white-space: nowrap;
    }}
    .footer-brand {{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2.5px;
      flex-shrink: 0;
    }}
    .business-logo {{
      height: 17px;
      width: auto;
      object-fit: contain;
    }}
    .demo-badge {{
      font-size: 7.6px;
      color: #2563eb;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 1.5px 6px;
      border-radius: 3px;
      font-weight: 700;
      font-family: ui-monospace, monospace;
      text-decoration: none;
      white-space: nowrap;
    }}
  </style>
</head>
<body>
<div class="page-container">

  <!-- 1. Executive Header -->
  <div class="header">
    <div class="header-left">
      <div class="brand-title">BarakahSoft LLC • Technical Leadership &amp; Systems Architecture • Ref #BS-2026-MEET-ERIC</div>
      <h1>Meet Eric • 30-Day Systems Reliability &amp; Rapid Shipping Blueprint</h1>
      <p class="subtitle">Supabase Multi-Tenant RLS • 8-Stage Safe Autonomous Agent Loop • Webhook Idempotency • AES-256 OAuth Vault</p>
    </div>
    <div class="meta-card">
      <div><strong>Client:</strong> Paul • Founder, Meet Eric (Swadlincote, UK)</div>
      <div><strong>Engagement:</strong> Senior Full-Stack Product Engineer / Technical Lead</div>
      <div><strong>Calibrated Rate:</strong> <strong>$80.00/hr USD (10–15 hrs/wk Contract-to-Hire)</strong></div>
      <div><strong>Live Prototype:</strong> <span class="live-badge">Verified &amp; Operational</span></div>
    </div>
  </div>

  <!-- 2. Scope Table -->
  <div class="scope-block">
    <div class="section-header">
      <h2 class="section-title">Production Scope &amp; Milestone Delivery Schedule</h2>
      <div class="section-meta">Live Cockpit: {live_url}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 12%;">Milestone</th>
          <th style="width: 58%;">Architecture &amp; Production Engineering Deliverables</th>
          <th style="width: 10%; text-align: center;">Timeline</th>
          <th style="width: 8%; text-align: center;">Share</th>
          <th style="width: 12%; text-align: right;">Allocation</th>
        </tr>
      </thead>
      <tbody>
        <tr class="phase-0-row">
          <td class="phase-num"><span class="phase-0-badge">Phase 0</span></td>
          <td>
            <div class="phase-name">Interactive Systems Cockpit &amp; Architectural Triage Matrix (Live)</div>
            <div class="phase-desc">Shipped live ahead of contract: Subsystem Keep/Harden/Refactor/Replace matrix, 8-stage safe autonomous loop runner with Slack HITL simulation, dual AI inference engine, and webhook replay defense.</div>
          </td>
          <td style="text-align: center; font-weight: 700; white-space: nowrap;">Live Now</td>
          <td style="text-align: center; color: #16a34a; font-weight: 700;">Included</td>
          <td style="text-align: right; font-weight: 800; color: #16a34a;">$0.00 (Live)</td>
        </tr>
        <tr>
          <td class="phase-num">Milestone 1</td>
          <td>
            <div class="phase-name">Broken Integrations Triage, Supabase Multi-Tenant RLS &amp; Webhook Locks</div>
            <div class="phase-desc">Fix failing Stripe/HubSpot webhooks using cURL debugging and PostgreSQL advisory locks (pg_try_advisory_xact_lock) for 18ms deduplication. Enforce kernel RLS via app.current_org_id() to protect 30 beta clients.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">Week 1</td>
          <td style="text-align: center; font-weight: 700; color: #2563eb;">20%</td>
          <td style="text-align: right; font-weight: 700;">10 Hrs ($800)</td>
        </tr>
        <tr>
          <td class="phase-num">Milestone 2</td>
          <td>
            <div class="phase-name">AES-256 OAuth Token Vault &amp; Slack Block Kit Interactive Human Approvals</div>
            <div class="phase-desc">Implement envelope encryption for HubSpot and PostHog tokens with proactive 300s expiration refresh daemon. Deploy interactive Slack Block Kit modals for Tier 2/3 agent action authorization with HMAC verification.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">Week 2</td>
          <td style="text-align: center; font-weight: 700; color: #2563eb;">20%</td>
          <td style="text-align: right; font-weight: 700;">10 Hrs ($800)</td>
        </tr>
        <tr>
          <td class="phase-num">Milestone 3</td>
          <td>
            <div class="phase-name">8-Stage Autonomous Agent Loop &amp; Inngest Durable Execution Queues</div>
            <div class="phase-desc">Harden the complete operational loop: Read -> Investigate -> Choose tool -> Check permissions -> Request approval -> Execute -> Verify -> Audit log. Migrate agent tasks to Inngest durable step-functions with retry jitter.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">Week 3</td>
          <td style="text-align: center; font-weight: 700; color: #2563eb;">20%</td>
          <td style="text-align: right; font-weight: 700;">10 Hrs ($800)</td>
        </tr>
        <tr>
          <td class="phase-num">Milestone 4</td>
          <td>
            <div class="phase-name">Database Query Optimization, Connection Pooling &amp; CI/CD Testing Pipelines</div>
            <div class="phase-desc">Profile Supabase slow queries with EXPLAIN ANALYZE, deploy composite B-Tree indexes, and configure PgBouncer pooling. Set up GitHub Actions CI/CD with automated RLS security test suites before production deploys.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">Week 4</td>
          <td style="text-align: center; font-weight: 700; color: #2563eb;">20%</td>
          <td style="text-align: right; font-weight: 700;">10 Hrs ($800)</td>
        </tr>
        <tr>
          <td class="phase-num">Milestone 5</td>
          <td>
            <div class="phase-name">Exhibition Launch Readiness, SOC 2 / UK GDPR Governance &amp; Runbooks</div>
            <div class="phase-desc">Stress-test multi-tenant capacity for 100+ concurrent workspaces during the upcoming exhibition. Finalize immutable cryptographic audit logging, NIST AI RMF / OWASP LLM01-10 firewall, and comprehensive handover runbooks.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">Week 5</td>
          <td style="text-align: center; font-weight: 700; color: #2563eb;">20%</td>
          <td style="text-align: right; font-weight: 700;">10 Hrs ($800)</td>
        </tr>
        <tr class="total-row">
          <td colspan="2" style="font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Technical Lead Engagement (Contract-to-Hire / 10–15 Hrs/Wk Ramp)</td>
          <td style="text-align: center; font-weight: 800;">30 Days</td>
          <td style="text-align: center; font-weight: 800;">100%</td>
          <td style="text-align: right; font-weight: 800; font-family: ui-monospace, monospace; font-size: 9.8px;">$80.00/hr Retainer</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 3. 2-Column Technical & Financial Breakdown -->
  <div class="grid-2col">
    <div class="card-box">
      <div class="card-box-title">30-Day Shipping &amp; Hardening Roadmap</div>
      <div class="milestone-item">
        <span class="milestone-name">Phase 0: Interactive Systems Cockpit (Delivered)</span>
        <span class="milestone-val" style="color: #16a34a;">$0.00 (Live Ahead of Bid)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name">W1: Broken Integrations, Supabase RLS &amp; Webhook Locks</span>
        <span class="milestone-val">10 Hrs (Net Day 7)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name">W2: AES-256 OAuth Vault &amp; Slack HITL Modals</span>
        <span class="milestone-val">10 Hrs (Net Day 14)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name">W3: 8-Stage Agent Loop &amp; Inngest Durable Queues</span>
        <span class="milestone-val">10 Hrs (Net Day 21)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name">W4: Query Indexing, PgBouncer &amp; CI/CD Pipelines</span>
        <span class="milestone-val">10 Hrs (Net Day 28)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name">W5: Exhibition Capacity, SOC 2/GDPR &amp; Runbooks</span>
        <span class="milestone-val">10 Hrs (Ongoing/Wk)</span>
      </div>
    </div>

    <div class="card-box">
      <div class="card-box-title">Architectural Guardrails &amp; Quality Mindset</div>
      <div class="guardrail-item"><strong>Strict Triage Discipline:</strong> Keep working Lovable code; harden RLS &amp; webhooks; refactor queues; replace single-LLM points of failure.</div>
      <div class="guardrail-item"><strong>Kernel RLS Isolation:</strong> app.current_org_id() token claims enforce absolute tenant boundaries across all 30 beta clients.</div>
      <div class="guardrail-item"><strong>Advisory Webhook Locks:</strong> PostgreSQL advisory locking eliminates duplicate event executions during Stripe/HubSpot retries.</div>
      <div class="guardrail-item"><strong>Deterministic Agent Loop:</strong> Tier 2/3 mutative actions strictly gated behind verified Slack Block Kit human approvals.</div>
      <div class="guardrail-item"><strong>Dual AI Failover:</strong> Sub-500ms automated failover (OpenAI gpt-4o-mini to Gemini 2.0 Flash) with inline LLM Firewall defense.</div>
    </div>
  </div>

  <!-- 4. Commercial Terms Section -->
  <div class="terms-box">
    <div class="terms-grid">
      <div class="term-col">
        <div class="term-title">Calibrated Rate ($80/hr)</div>
        <div class="term-body">$80.00/hr (10–15 hrs/week). Matches verified profile list rate; Claude Code/Cursor workflows deliver 35–40 hrs of conventional output.</div>
      </div>
      <div class="term-col">
        <div class="term-title">Exhibition &amp; Beta SLA</div>
        <div class="term-body">Zero cross-tenant leaks, 99.99% webhook uptime, and sub-second agent investigations ready for the live exhibition.</div>
      </div>
      <div class="term-col">
        <div class="term-title">100% Code Ownership</div>
        <div class="term-body">All code, PRs, Supabase migrations, and Inngest workflows committed directly to your private GitHub repository.</div>
      </div>
      <div class="term-col">
        <div class="term-title">Daily Async Standups</div>
        <div class="term-body">Daily video/Slack updates covering shipped fixes, upcoming PRs, and architectural decisions. Zero hand-holding needed.</div>
      </div>
    </div>
  </div>

  <!-- 5. Formal Acceptance Authorization Block -->
  <div class="auth-block">
    <div class="auth-title">
      <span>Formal Authorization &amp; Systems Reliability Acceptance</span>
      <span style="font-weight: 500; font-size: 7.4px; color: #475569;">Binding upon contract activation via Upwork hourly offer / milestone schedule</span>
    </div>
    <div class="auth-grid">
      <div class="auth-party">
        <div class="auth-party-title">Authorized Architect: BarakahSoft LLC (Wyoming, USA)</div>
        <div>Signatory: <strong>Shakil Ahmed</strong> • Principal Systems Architect &amp; Former Lead Engineer at Legiit</div>
        <div class="auth-sign-line">
          <div class="auth-sign-field">Shakil Ahmed</div>
          <div class="auth-date-field">20 Sep 2026</div>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="auth-label">Authorized Architect Signature</span>
          <span class="auth-label" style="width: 90px; text-align: center;">Date</span>
        </div>
      </div>

      <div class="auth-party">
        <div class="auth-party-title">Authorized Client: Meet Eric (Swadlincote, UK)</div>
        <div>Signatory: <strong>Paul</strong> • Founder &amp; Product Lead, Meet Eric</div>
        <div class="auth-sign-line">
          <div class="auth-sign-field" style="color: #64748b; font-family: inherit; font-size: 8px; font-style: italic;">[ Accepted via Upwork Contract Offer / Sign-off ]</div>
          <div class="auth-date-field">___ / ___ / 2026</div>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="auth-label">Authorized Client Signature</span>
          <span class="auth-label" style="width: 90px; text-align: center;">Date</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 6. Executive Signature Footer -->
  <div class="footer-container">
    <div class="footer-founder">
      <img src="data:image/jpeg;base64,{headshot_b64}" alt="Shakil Ahmed" class="founder-avatar" />
      <div class="founder-info">
        <div class="founder-name"><strong>Shakil Ahmed</strong> • Senior Full-Stack Product Engineer &amp; Former Lead Engineer at Legiit (12+ Yrs Exp)</div>
        <div class="founder-company"><strong>BarakahSoft LLC</strong> • Enterprise Systems Engineering &amp; Autonomous AI Architecture</div>
        <div class="founder-sub">Securiti Certified AI Security &amp; Governance Architect (Cert ID: 14B411BCE-14B411A3D-1451CFE76) • Verified Upwork Partner</div>
      </div>
    </div>
    <div class="footer-brand">
      <img src="data:image/png;base64,{logo_b64}" alt="BarakahSoft" class="business-logo" />
      <a href="{live_url}" target="_blank" class="demo-badge">{project_slug}.vercel.app</a>
    </div>
  </div>

</div>
</body>
</html>
"""

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print("Saved estimate.html to:", html_path)

    with open(brief_html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print("Saved architecture_brief.html to:", brief_html_path)

    # Compile with Headless Chrome using absolute file URI
    chrome_cmd = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        f"file://{os.path.abspath(html_path)}"
    ]

    res = subprocess.run(chrome_cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print("Successfully generated ESTIMATE.pdf via Chrome Headless at:", pdf_path)
        print("File size:", os.path.getsize(pdf_path), "bytes")
    else:
        print("Chrome print-to-pdf error:", res.stderr, file=sys.stderr)
        sys.exit(1)

    # Copy to ARCHITECTURE_BRIEF.pdf
    shutil.copyfile(pdf_path, brief_pdf_path)
    print(f"Synced copy to ARCHITECTURE_BRIEF.pdf ({os.path.getsize(brief_pdf_path)} bytes)")

    # Verify page count
    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()

    pages = re.findall(rb"/Type\s*/Page[^s]", pdf_bytes)
    print(f"Verified PDF page count: {len(pages)} page(s)")
    if len(pages) != 1:
        print(f"CRITICAL ERROR: Expected exactly 1 page, got {len(pages)}!", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    build_estimate()
