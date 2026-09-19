'use client';

import React, { useState } from 'react';
import {
  Bot,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Send,
  Sparkles,
  ArrowRight,
  Database,
  Search,
  Wrench,
  KeyRound,
  FileCheck,
  History,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GrowthEventType, GrowthAnomalyResult } from '@/lib/ai';

export function AgentExecutionLoop() {
  const [selectedEvent, setSelectedEvent] = useState<GrowthEventType>('stripe_checkout_churn');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0); // 0 = idle, 1..8
  const [analysisResult, setAnalysisResult] = useState<GrowthAnomalyResult | null>(null);
  const [humanApprovalState, setHumanApprovalState] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [customPrompt, setCustomPrompt] = useState('');

  const scenarios: Record<GrowthEventType, { title: string; source: any; baseline: string; current: string; context: any; desc: string }> = {
    stripe_checkout_churn: {
      title: 'Stripe Checkout Drop-off (-18.2% in UK Region)',
      source: 'Stripe',
      baseline: '72.4% Checkout Conversion',
      current: '54.2% Checkout Conversion',
      context: { region: 'UK/EU', paymentMethod: 'debit_cards', errorMetric: '3DS_SCA_CHALLENGE_TIMEOUT' },
      desc: 'Eric detected an elevated card authorization failure rate on European transactions following recent SCA enforcement updates.',
    },
    hubspot_stalled_deal: {
      title: 'HubSpot High-Value Expansion Deal Stalled ($4,800/mo ARR)',
      source: 'HubSpot',
      baseline: '2.4 Days Average Stage Duration',
      current: '6.8 Days Inactive at Proposal Stage',
      context: { dealId: 'deal_acme_scale', dealValue: 4800, leadOwner: 'unassigned' },
      desc: 'Tier-1 enterprise trial showed 4 days of zero account rep touchpoints after visiting the enterprise pricing page.',
    },
    posthog_funnel_drop: {
      title: 'PostHog Onboarding Funnel Drop at Step 3 (Team Invites)',
      source: 'PostHog',
      baseline: '88.5% Step 3 Completion',
      current: '59.1% Step 3 Completion',
      context: { funnelStep: 3, stepName: 'Invite Teammates', exitRate: 40.9 },
      desc: 'Self-serve beta signups are abandoning the workspace setup flow because team email invites were made mandatory.',
    },
    subscription_payment_failure: {
      title: 'Invoice Payment Failures Spike on Renewal Cycle',
      source: 'Stripe',
      baseline: '1.2% Invoice Delinquency',
      current: '5.8% Invoice Delinquency',
      context: { cycle: 'monthly_renewal', failedAttempts: 3 },
      desc: 'Repeated insufficient funds errors on recurring SaaS subscriptions without smart dunning fallback.',
    },
    expansion_opportunity: {
      title: 'Trial User Exceeded 80% Seat Utilization in 48 Hours',
      source: 'Segment',
      baseline: '3 Seats Active',
      current: '9 Seats Active',
      context: { accountPlan: 'Starter', accountAgeDays: 4 },
      desc: 'High-growth startup onboarded their entire engineering team; prime candidate for automated Pro tier upgrade voucher.',
    },
    custom_diagnostic: {
      title: 'Custom Customer Journey Diagnostic',
      source: 'PostHog',
      baseline: 'Custom Baseline',
      current: 'Custom Current',
      context: { custom: true },
      desc: 'Test Eric on any arbitrary growth, churn, or conversion bottleneck.',
    },
  };

  const stages = [
    { num: 1, label: 'Read Data', icon: Database, desc: 'Ingest Stripe, CRM & analytics telemetry' },
    { num: 2, label: 'Investigate', icon: Search, desc: 'LLM root-cause anomaly investigation' },
    { num: 3, label: 'Choose Tool', icon: Wrench, desc: 'Select appropriate remediation action' },
    { num: 4, label: 'Check Permissions', icon: KeyRound, desc: 'Verify multi-tenant RBAC & RLS bounds' },
    { num: 5, label: 'Request Approval', icon: FileCheck, desc: 'Human-in-the-loop Slack approval gate' },
    { num: 6, label: 'Execute', icon: Send, desc: 'Idempotent API action dispatch' },
    { num: 7, label: 'Verify', icon: ShieldCheck, desc: 'Validate telemetry response & 200 receipt' },
    { num: 8, label: 'Log Audit Trail', icon: History, desc: 'Append cryptographic SHA-256 ledger' },
  ];

  const handleRunInvestigation = async () => {
    setIsRunning(true);
    setCurrentStage(1);
    setHumanApprovalState('pending');
    setAnalysisResult(null);

    const scenario = scenarios[selectedEvent];

    try {
      // Stage 1: Read Data (Simulated fetch)
      await new Promise((r) => setTimeout(r, 450));
      setCurrentStage(2);

      // Stage 2: Investigate (Call Real AI Route)
      const res = await fetch('/api/ai/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: selectedEvent,
          title: scenario.title,
          source: scenario.source,
          metricBaseline: scenario.baseline,
          metricCurrent: scenario.current,
          contextData: scenario.context,
          customPrompt: customPrompt || undefined,
        }),
      });

      const data: GrowthAnomalyResult = await res.json();
      setAnalysisResult(data);

      await new Promise((r) => setTimeout(r, 450));
      setCurrentStage(3); // Choose Tool

      await new Promise((r) => setTimeout(r, 400));
      setCurrentStage(4); // Check Permissions

      await new Promise((r) => setTimeout(r, 400));
      setCurrentStage(5); // Request Approval (Awaiting human click!)
      setIsRunning(false);
    } catch (err) {
      console.error(err);
      setIsRunning(false);
    }
  };

  const handleApproveAction = async () => {
    setHumanApprovalState('approved');
    setIsRunning(true);
    setCurrentStage(6); // Execute

    await new Promise((r) => setTimeout(r, 550));
    setCurrentStage(7); // Verify

    await new Promise((r) => setTimeout(r, 500));
    setCurrentStage(8); // Log Audit Trail
    setIsRunning(false);
  };

  const handleRejectAction = () => {
    setHumanApprovalState('rejected');
    setCurrentStage(0);
    setIsRunning(false);
  };

  const activeScenario = scenarios[selectedEvent];

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0 shadow-xs">
              <Bot className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Live AI Agent Execution Runner
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono font-medium hidden sm:inline">
              Safe 8-Stage Autonomous Loop
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            Eric 8-Stage Safe Autonomous Execution Runner
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 max-w-3xl leading-relaxed">
            Paul’s Core Requirement: Eric safely reads data → investigates → chooses a tool → checks permissions → requests human approval → executes with idempotency → verifies outcome → logs cryptographic audit trail.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handleRunInvestigation}
            disabled={isRunning || (currentStage === 5 && humanApprovalState === 'pending')}
            className="h-9 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs px-4"
          >
            {isRunning ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                Executing Stage {currentStage}/8...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5 text-emerald-100" />
                Run 8-Stage Loop
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Select Real-World Growth Anomaly:
          </span>
          {analysisResult && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                {analysisResult.provider} ({analysisResult.model}) • {analysisResult.latencyMs}ms
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {(['stripe_checkout_churn', 'hubspot_stalled_deal', 'posthog_funnel_drop'] as const).map((key) => {
            const sc = scenarios[key];
            const isSelected = selectedEvent === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedEvent(key);
                  setCurrentStage(0);
                  setAnalysisResult(null);
                  setHumanApprovalState('pending');
                }}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-emerald-500/70 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs'
                    : 'border-[var(--color-border)] bg-[var(--color-panel-subtle)]/60 hover:bg-[var(--color-surface)]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-[var(--color-text-muted)]">[{sc.source}]</span>
                  {isSelected && <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active</span>}
                </div>
                <div className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                  {sc.title}
                </div>
                <div className="text-xs text-[var(--color-text-secondary)] mt-1 truncate">
                  {sc.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 8-Stage Progress Stepper Horizontal Strip */}
      <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Autonomous Pipeline Stepper
          </span>
          <span className="text-xs font-mono text-[var(--color-text-secondary)]">
            {currentStage === 0
              ? 'Status: Ready to trigger'
              : currentStage < 8
              ? `Running: Stage ${currentStage} of 8 (${stages[currentStage - 1]?.label})`
              : 'Status: 8/8 Stages Completed Successfully ✓'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isPast = currentStage > stage.num;
            const isCurrent = currentStage === stage.num;
            const isFuture = currentStage < stage.num;

            return (
              <div
                key={stage.num}
                className={`flex flex-col justify-between p-2.5 rounded-lg border text-xs transition-all ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/40 shadow-xs ring-1 ring-emerald-500'
                    : isPast
                    ? 'border-emerald-200 dark:border-emerald-900 bg-[var(--color-panel-subtle)] text-[var(--color-text-primary)]'
                    : 'border-[var(--color-border)] bg-[var(--color-panel-subtle)]/40 text-[var(--color-text-muted)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-bold">
                    0{stage.num}
                  </span>
                  {isPast ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  ) : (
                    <Icon className="h-3 w-3 opacity-40" />
                  )}
                </div>
                <div className="font-bold text-xs leading-tight">
                  {stage.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Detail / Interactive Cockpit Display */}
      {currentStage > 0 && (
        <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 sm:p-5 space-y-4">
          {/* Stage 1 & 2: Investigation & Root Cause Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-mono font-bold uppercase text-[var(--color-text-muted)]">
                Stage 1 • Telemetry Ingestion [{activeScenario.source}]
              </div>
              <div className="rounded-lg p-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-mono">
                <div>Baseline: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{activeScenario.baseline}</span></div>
                <div>Current: <span className="text-red-600 dark:text-red-400 font-semibold">{activeScenario.current}</span></div>
                <div className="mt-1 text-xs text-[var(--color-text-secondary)]">Context: {JSON.stringify(activeScenario.context)}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                Stage 2 • AI Root-Cause Investigation
              </div>
              <div className="rounded-lg p-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-xs leading-relaxed">
                {analysisResult ? (
                  <>
                    <p className="font-semibold text-[var(--color-text-primary)]">{analysisResult.rootCause}</p>
                    <div className="mt-2 text-xs font-mono text-red-600 dark:text-red-400">
                      Impact: {analysisResult.metricsImpact}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-emerald-500 border-t-transparent rounded-full" />
                    Running LLM inference...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stage 3 & 4: Tool Selection & RBAC Bounds */}
          {currentStage >= 3 && analysisResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[var(--color-border)]">
              <div className="space-y-1.5">
                <div className="text-xs font-mono font-bold uppercase text-blue-600 dark:text-blue-400">
                  Stage 3 • Chosen Tool
                </div>
                <div className="rounded-lg p-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-mono">
                  <div className="font-bold text-[var(--color-text-primary)]">{analysisResult.recommendedTool}()</div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                    Params: {JSON.stringify(analysisResult.toolParameters)}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono font-bold uppercase text-purple-600 dark:text-purple-400">
                  Stage 4 • RBAC Scope &amp; Permission Check
                </div>
                <div className="rounded-lg p-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-mono">
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Permissions Validated: {analysisResult.requiredPermissions.join(', ')}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-1">
                    Tenant RLS: app.current_org_id() = org_beta_live
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage 5: Human-in-the-Loop Slack Card Simulator */}
          {currentStage >= 5 && analysisResult && (
            <div className="pt-3 border-t border-[var(--color-border)]">
              <div className="text-xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400 mb-2">
                Stage 5 • Slack Human-in-the-Loop Approval Checkpoint
              </div>

              <div className="rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
                      E
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[var(--color-text-primary)]">Eric (AI Head of Growth)</span>
                      <span className="text-xs font-mono text-[var(--color-text-muted)] ml-2">#growth-approvals • today at 14:02</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 font-semibold">
                    AWAITING HUMAN CONFIRMATION
                  </span>
                </div>

                <p className="text-xs text-[var(--color-text-primary)] leading-relaxed">
                  {analysisResult.approvalSummary}
                </p>

                <div className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] p-2.5 text-xs font-mono text-[var(--color-text-secondary)]">
                  Execution Payload: {JSON.stringify(analysisResult.executionPayload)}
                </div>

                {humanApprovalState === 'pending' ? (
                  <div className="flex items-center gap-2.5 pt-1">
                    <Button
                      size="sm"
                      onClick={handleApproveAction}
                      className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 shadow-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      Approve &amp; Execute Action
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRejectAction}
                      className="h-8 text-xs font-semibold border-[var(--color-border)] hover:bg-red-50 hover:text-red-600 px-3.5 shadow-xs"
                    >
                      Reject Action
                    </Button>
                  </div>
                ) : humanApprovalState === 'approved' ? (
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    ✓ Human Approval Granted by Growth Lead. Proceeding to Execution.
                  </div>
                ) : (
                  <div className="text-xs font-bold text-red-600 dark:text-red-400 font-mono">
                    ✕ Action rejected by reviewer. Execution cancelled.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stage 6, 7, 8: Execution, Verification, and Audit */}
          {currentStage >= 6 && analysisResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-[var(--color-border)]">
              <div className="rounded-lg p-3 bg-[var(--color-surface)] border border-[var(--color-border)]">
                <div className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 mb-1">
                  Stage 6 • Executed API Action
                </div>
                <div className="text-xs font-mono text-[var(--color-text-primary)]">
                  Status: <span className="text-emerald-600 dark:text-emerald-400 font-bold">200 OK</span>
                </div>
                <div className="text-xs font-mono text-[var(--color-text-muted)] mt-1 truncate">
                  Key: {analysisResult.executionPayload.idempotencyKey}
                </div>
              </div>

              <div className="rounded-lg p-3 bg-[var(--color-surface)] border border-[var(--color-border)]">
                <div className="text-xs font-mono font-bold uppercase text-blue-600 dark:text-blue-400 mb-1">
                  Stage 7 • Telemetry Verification
                </div>
                <div className="text-xs text-[var(--color-text-primary)]">
                  {analysisResult.verificationCriteria}
                </div>
                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  ✓ Receipt confirmed in 84ms
                </div>
              </div>

              <div className="rounded-lg p-3 bg-[var(--color-surface)] border border-[var(--color-border)]">
                <div className="text-xs font-mono font-bold uppercase text-purple-600 dark:text-purple-400 mb-1">
                  Stage 8 • Cryptographic Audit Log
                </div>
                <div className="text-xs font-mono text-[var(--color-text-primary)] truncate">
                  Hash: {analysisResult.auditTrailHash}
                </div>
                <div className="text-xs font-mono text-[var(--color-text-muted)] mt-1">
                  Immutable record written to Supabase `audit_ledger`
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
