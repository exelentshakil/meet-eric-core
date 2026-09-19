'use client';

import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Code2,
  FileCode,
  ShieldCheck,
  Database,
  Terminal,
  Webhook,
  Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlueprintItem {
  id: string;
  name: string;
  filename: string;
  category: string;
  language: 'sql' | 'typescript';
  icon: React.ElementType;
  desc: string;
  code: string;
}

export function BlueprintExporter() {
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>('bp_rls');
  const [copied, setCopied] = useState(false);

  const blueprints: BlueprintItem[] = [
    {
      id: 'bp_rls',
      name: 'Supabase Multi-Tenant RLS Migration',
      filename: '20260920_eric_multi_tenant_rls.sql',
      category: 'Database & Security',
      language: 'sql',
      icon: Database,
      desc: 'Production PostgreSQL migration enforcing organization isolation via app.current_org_id() in JWT claims. Eliminates cross-tenant data leaks across 30 beta clients.',
      code: `-- ==============================================================================
-- MEET ERIC • PRODUCTION MULTI-TENANT RLS MIGRATION
-- Hardens Supabase against cross-tenant data bleed across 30 beta workspaces
-- ==============================================================================

-- 1. Helper function extracting verified organization claim from Supabase Auth JWT
CREATE OR REPLACE FUNCTION auth.current_org_id() 
RETURNS UUID AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json ->> 'org_id', '')::uuid;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- 2. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan_tier TEXT DEFAULT 'beta_pro',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Customer Journey Events Table
CREATE TABLE IF NOT EXISTS public.customer_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  source TEXT NOT NULL, -- 'stripe' | 'hubspot' | 'posthog' | 'slack'
  event_name TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_events ENABLE ROW LEVEL SECURITY;

-- 5. Strict Tenant Isolation Policies
CREATE POLICY "Tenant Isolation: Organizations" ON public.organizations
  FOR ALL
  USING (id = auth.current_org_id());

CREATE POLICY "Tenant Isolation: Customer Events" ON public.customer_events
  FOR ALL
  USING (org_id = auth.current_org_id())
  WITH CHECK (org_id = auth.current_org_id());

-- Index for high-velocity tenant query acceleration
CREATE INDEX IF NOT EXISTS idx_customer_events_org_created 
  ON public.customer_events(org_id, created_at DESC);`,
    },
    {
      id: 'bp_agent_loop',
      name: 'Inngest 8-Stage Durable Agent Function',
      filename: 'eric-agent-workflow.ts',
      category: 'AI Agents & Background Jobs',
      language: 'typescript',
      icon: Bot,
      desc: 'Durable background agent execution loop: Read -> Investigate -> Tool Choice -> RBAC Check -> Human Approval -> Idempotent Exec -> Verification -> Audit Log.',
      code: `import { inngest } from '@/lib/inngest';
import { investigateGrowthAnomaly } from '@/lib/ai';
import { executeToolWithIdempotency } from '@/lib/tools';
import { dispatchSlackApprovalBlock } from '@/lib/slack';
import { appendSha256AuditLog } from '@/lib/audit';

export const ericSafeAgentLoop = inngest.createFunction(
  { id: 'eric-safe-agent-loop', retries: 3 },
  { event: 'eric/anomaly.detected' },
  async ({ event, step }) => {
    const { orgId, anomalyData } = event.data;

    // Stage 1: Read Telemetry Data
    const telemetry = await step.run('1-read-telemetry', async () => {
      return fetchCustomerJourneyData(orgId, anomalyData.timeframe);
    });

    // Stage 2: AI Root-Cause Investigation
    const investigation = await step.run('2-investigate-anomaly', async () => {
      return investigateGrowthAnomaly({
        eventType: anomalyData.type,
        title: anomalyData.title,
        source: anomalyData.source,
        metricBaseline: anomalyData.baseline,
        metricCurrent: anomalyData.current,
        contextData: telemetry,
      });
    });

    // Stage 3 & 4: Tool Selection & RBAC Least-Privilege Gate
    const permissionCheck = await step.run('3-4-rbac-check', async () => {
      return verifyAgentRbac(orgId, investigation.recommendedTool, investigation.requiredPermissions);
    });

    if (!permissionCheck.allowed) {
      throw new Error(\`Disallowed tool execution: \${permissionCheck.reason}\`);
    }

    // Stage 5: Request Human-in-the-Loop Approval if Destructive
    if (investigation.requiresApproval) {
      const approvalTicket = await step.run('5-dispatch-slack-approval', async () => {
        return dispatchSlackApprovalBlock({
          orgId,
          summary: investigation.approvalSummary,
          tool: investigation.recommendedTool,
          payload: investigation.executionPayload,
        });
      });

      // Wait for human button click via Slack interactive webhook
      const approvalResponse = await step.waitForEvent('wait-for-human-approval', {
        event: 'slack/action.approved',
        timeout: '24h',
        match: 'data.ticketId',
      });

      if (!approvalResponse?.data?.approved) {
        return { status: 'cancelled_by_human', ticketId: approvalTicket.id };
      }
    }

    // Stage 6: Idempotent Execution
    const executionReceipt = await step.run('6-execute-idempotent', async () => {
      return executeToolWithIdempotency(investigation.recommendedTool, investigation.executionPayload);
    });

    // Stage 7: Telemetry Verification
    const verification = await step.run('7-verify-outcome', async () => {
      return verifyMetricTelemetry(orgId, investigation.verificationCriteria);
    });

    // Stage 8: Cryptographic SHA-256 Audit Trail
    await step.run('8-log-audit-trail', async () => {
      return appendSha256AuditLog({
        orgId,
        investigationId: investigation.anomalyId,
        tool: investigation.recommendedTool,
        receipt: executionReceipt,
        verification,
      });
    });

    return { status: 'success', receiptId: executionReceipt.id };
  }
);`,
    },
    {
      id: 'bp_idempotency',
      name: 'Stripe & HubSpot Webhook Idempotency Guard',
      filename: 'webhook-idempotency-middleware.ts',
      category: 'APIs & Webhooks',
      language: 'typescript',
      icon: Webhook,
      desc: 'PostgreSQL advisory locks and unique event_id deduplication. Eliminates duplicate customer alerts, double discount creation, and replay attacks.',
      code: `import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function processIdempotentWebhook(
  req: NextRequest,
  provider: 'stripe' | 'hubspot' | 'posthog',
  eventId: string,
  handler: (payload: any) => Promise<any>
) {
  // 1. Acquire PostgreSQL Advisory Lock to block concurrent identical webhooks
  const { data: lockAcquired } = await supabaseAdmin.rpc('pg_try_advisory_xact_lock', {
    key: hashStringTo64BitInt(eventId),
  });

  if (!lockAcquired) {
    // Concurrent worker already processing same event
    return NextResponse.json({ duplicate: true, status: 'locked' }, { status: 200 });
  }

  // 2. Insert into Webhook Ingestion Journal with Unique Constraint
  const { error: insertError } = await supabaseAdmin
    .from('webhook_inbox')
    .insert({
      event_id: eventId,
      provider,
      status: 'processing',
      received_at: new Date().toISOString(),
    });

  if (insertError?.code === '23505') {
    // PostgreSQL Unique Violation: Already ingested!
    return NextResponse.json({ duplicate: true, status: 'already_processed' }, { status: 200 });
  }

  try {
    const payload = await req.json();
    const result = await handler(payload);

    await supabaseAdmin
      .from('webhook_inbox')
      .update({ status: 'completed', processed_at: new Date().toISOString() })
      .eq('event_id', eventId);

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    await supabaseAdmin
      .from('webhook_inbox')
      .update({ status: 'failed', error_message: err.message })
      .eq('event_id', eventId);

    throw err;
  }
}`,
    },
  ];

  const active = blueprints.find((b) => b.id === selectedBlueprint) || blueprints[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(active.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([active.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = active.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0 shadow-xs">
              <Code2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Production Architecture Code Exports
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono font-medium hidden sm:inline">
              100% Code Ownership • No Zapier/n8n Wrappers
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            Meet Eric Production Code &amp; Migration Blueprints
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 max-w-3xl leading-relaxed">
            Real production TypeScript and PostgreSQL blueprints ready for your GitHub repository. Zero toy automation tools: clean RLS migrations, Inngest durable agent loops, and webhook idempotency guards.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 text-xs font-semibold border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1.5 text-[var(--color-text-muted)]" />
                Copy Code
              </>
            )}
          </Button>

          <Button
            size="sm"
            onClick={handleDownload}
            className="h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download {active.filename}
          </Button>
        </div>
      </div>

      {/* Blueprint Selector */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {blueprints.map((b) => {
          const Icon = b.icon;
          const isSelected = selectedBlueprint === b.id;

          return (
            <button
              key={b.id}
              onClick={() => setSelectedBlueprint(b.id)}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? 'border-blue-500 bg-[var(--color-surface)] shadow-sm ring-1 ring-blue-500'
                  : 'border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:bg-[var(--color-surface)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)]">
                  <Icon className="h-3.5 w-3.5 text-[var(--color-text-primary)]" />
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold uppercase">
                  {b.language}
                </span>
              </div>
              <div className="font-bold text-xs text-[var(--color-text-primary)]">
                {b.name}
              </div>
              <div className="text-xs font-mono text-[var(--color-text-muted)] mt-1 truncate">
                {b.filename}
              </div>
            </button>
          );
        })}
      </div>

      {/* Code Display Box */}
      <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto shadow-inner">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-blue-400" />
            <span className="text-white font-semibold">{active.filename}</span>
          </div>
          <span>{active.desc}</span>
        </div>
        <pre className="leading-relaxed whitespace-pre text-xs">{active.code}</pre>
      </div>
    </div>
  );
}
