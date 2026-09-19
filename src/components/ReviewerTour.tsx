'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  Bot,
  Webhook,
  ShieldCheck,
  Activity,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewerTourProps {
  onNavigate: (sectionId: string) => void;
  onOpenChaosModal: () => void;
}

export function ReviewerTour({ onNavigate, onOpenChaosModal }: ReviewerTourProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const evaluationPaths = [
    {
      id: 'triage',
      badge: 'Path 1 • Architecture',
      title: 'Keep / Harden / Refactor / Replace',
      desc: 'Immediate audit of Eric’s 6 subsystems: Supabase RLS, Webhooks, OAuth vault, Agent tools, Queues, and Slack actions.',
      actionLabel: 'Inspect Triage Matrix',
      icon: Layers,
    },
    {
      id: 'agent-loop',
      badge: 'Path 2 • Safe Agent Loop',
      title: '8-Stage Autonomous Runner',
      desc: 'Test the safe autonomous loop: Read data → Investigate → Choose tool → Check permissions → Request human Slack approval → Execute → Verify → Audit.',
      actionLabel: 'Run 8-Stage Loop',
      icon: Bot,
    },
    {
      id: 'integrations',
      badge: 'Path 3 • APIs & Webhooks',
      title: 'Stripe, HubSpot, Slack Resiliency',
      desc: 'Test duplicate webhook replay defense with PostgreSQL advisory locks and proactive OAuth token auto-refresh before expiration.',
      actionLabel: 'Test Integrations Hub',
      icon: Webhook,
    },
    {
      id: 'security',
      badge: 'Path 4 • Zero Data Leakage',
      title: 'Multi-Tenant RLS & Tool Firewall',
      desc: 'Verify Securiti-certified defenses: cross-tenant SQL isolation, prompt injection interception, and RBAC least-privilege tool bounds.',
      actionLabel: 'Verify Security Matrix',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-xs transition-all">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Executive Architecture Briefing • Enterprise Systems Cockpit
            </span>
            <span className="text-xs text-[var(--color-text-secondary)] font-mono font-medium hidden sm:inline">
              30 Beta Users • Exhibition Ready
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            How to Evaluate This Production Systems Architecture Cockpit
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 max-w-4xl leading-relaxed">
            Fast Lovable MVPs need pragmatic engineering judgment, not academic rewrites. We preserve working code, harden multi-tenant Supabase RLS, refactor the 8-stage safe agent execution gateway with human-in-the-loop Slack approval, and guarantee zero customer data leaks ahead of the exhibition.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 text-xs font-medium border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)] whitespace-nowrap shrink-0 shadow-xs"
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="h-3.5 w-3.5 mr-1" />
                Expand
              </>
            ) : (
              <>
                <ChevronUp className="h-3.5 w-3.5 mr-1" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Collapsible Evaluation Paths */}
      {!isCollapsed && (
        <div className="mt-5 space-y-4">
          {/* 4 Interactive Evaluation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {evaluationPaths.map((path) => {
              const Icon = path.icon;
              return (
                <div
                  key={path.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 transition-all hover:border-slate-400 hover:bg-[var(--color-surface)] shadow-xs hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="inline-flex items-center text-xs font-semibold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0 shadow-xs">
                        {path.badge}
                      </span>
                      <Icon className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                      {path.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {path.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-[var(--color-border-subtle)]">
                    <button
                      onClick={() => onNavigate(path.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>{path.actionLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* High-Contrast Command Console Summary Strip */}
          <div className="rounded-xl bg-slate-950 text-white p-3.5 sm:p-4 shadow-sm border border-slate-800 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div className="sm:hidden flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-xs">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-mono font-semibold text-blue-300 uppercase tracking-wider text-xs whitespace-nowrap shrink-0">
                Technical Lead Guarantees
              </span>
            </div>

            <div className="flex items-stretch justify-between gap-3 sm:items-center sm:gap-3.5 flex-1 min-w-0">
              <div className="space-y-1.5 sm:space-y-0 sm:flex sm:items-center sm:gap-3 flex-1 min-w-0">
                <div className="hidden sm:flex items-center gap-2.5 shrink-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-xs">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-mono font-semibold text-blue-300 uppercase tracking-wider text-xs whitespace-nowrap shrink-0">
                    Lead Standards
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 text-xs">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono whitespace-nowrap w-fit">
                    No Purity Rewrites
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono whitespace-nowrap w-fit">
                    Fast Modular PRs
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono whitespace-nowrap w-fit">
                    Multi-Tenant RLS Safe
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-950/40 border border-blue-800/50 text-blue-300 text-xs font-mono font-semibold whitespace-nowrap w-fit">
                    30 Beta Ready
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-2.5 sm:px-3 sm:py-0 sm:h-9 rounded-xl sm:rounded-lg bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/30 shadow-xs shrink-0 w-28 sm:w-auto text-center self-stretch sm:self-auto sm:flex-row sm:gap-2.5">
                <div className="relative flex h-8 w-8 sm:h-6 sm:w-6 items-center justify-center rounded-lg sm:rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30 mb-1 sm:mb-0 shrink-0">
                  <Activity className="h-4 w-4 sm:h-3.5 w-3.5 text-blue-400" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                </div>
                <div className="space-y-0.5 sm:space-y-0 sm:text-left flex flex-col justify-center">
                  <div className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider leading-none">
                    Target SLA
                  </div>
                  <div className="text-xs font-mono font-semibold text-white leading-tight">
                    99.99%
                  </div>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              onClick={onOpenChaosModal}
              className="h-9 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs whitespace-nowrap shrink-0 border border-blue-500/40 w-full sm:w-auto px-3.5 rounded-lg justify-center inline-flex items-center gap-1.5"
            >
              <Zap className="h-3.5 w-3.5 text-blue-200 shrink-0" />
              <span>Test Failover</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
