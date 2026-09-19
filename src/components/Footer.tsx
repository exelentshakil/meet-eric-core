'use client';

import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Database,
  ExternalLink,
  Code2,
  Terminal,
  Activity,
  Award,
  CheckCircle2,
  Layers,
  Sparkles,
  Bot,
  Webhook,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="mx-auto max-w-7xl">
        {/* Balanced 3-Pillar Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-stretch">
          
          {/* Pillar 1: Platform & Systems Mission */}
          <div className="space-y-2.5 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">
              Systems Platform
            </h4>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 flex flex-col justify-between flex-1 space-y-3.5 text-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-sm shadow-xs shrink-0">
                    E
                  </div>
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <span className="text-base font-semibold tracking-tight text-[var(--color-text-primary)] whitespace-nowrap">
                      Meet Eric
                    </span>
                    <span className="rounded-full bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-xs font-mono font-bold text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 whitespace-nowrap shrink-0">
                      v2.4 Production Engine
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Autonomous AI Head of Growth watching the customer journey across Stripe, HubSpot, PostHog, and Slack. Detects churn bottlenecks, investigates anomalies, and safely executes approved growth interventions.
                </p>
              </div>

              {/* Verified Platform Status Strip */}
              <div className="pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap min-w-0">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0"></span>
                  <span className="text-xs font-semibold truncate">Target SLA: 99.99%</span>
                </div>
                <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-xs font-mono font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0">
                  30 Beta Clients Ready
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Systems Architecture & Technical Specs */}
          <div className="space-y-2.5 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">
              Systems Architecture
            </h4>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 flex flex-col justify-between flex-1 space-y-3.5 text-xs">
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 text-xs font-mono text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Database className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">Supabase Multi-Tenant</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Bot className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">8-Stage Safe Loop</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Webhook className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">Idempotency Locks</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Layers className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">Inngest Workflows</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Terminal className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">AES-256 OAuth Vault</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Code2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">Slack Block Kit UI</span>
                  </div>
                </div>
              </div>

              {/* Compliance & SLA Verification Strip */}
              <div className="pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between gap-2 text-xs font-mono">
                <span className="text-xs text-[var(--color-text-muted)] font-medium truncate">
                  NIST AI RMF 100-1 &amp; OWASP LLM01-10
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0">
                  Kernel RLS Active
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Principal Systems Architect Verification */}
          <div className="space-y-2.5 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">
              Technical Lead &amp; Architect
            </h4>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 flex flex-col justify-between flex-1 space-y-3 text-xs">
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src="/headshot.jpeg"
                      alt="Shakil Ahmed - Principal Systems Architect"
                      className="h-11 w-11 rounded-xl object-cover ring-2 ring-blue-500/30 border border-[var(--color-border)] shadow-xs"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-white ring-2 ring-white dark:ring-slate-900 shadow-xs" title="Verified Architect">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-bold text-[var(--color-text-primary)] text-sm">
                      <span className="truncate">Shakil Ahmed</span>
                      <span className="inline-flex items-center rounded bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 text-xs font-mono font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0">
                        Lead
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] font-mono truncate">
                      Principal Systems Architect &amp; Founder
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Former Lead Systems Engineer at Legiit ($1M ARR Command Center). 12+ Years Enterprise Systems &amp; Autonomous AI Delivery.
                </p>
              </div>

              {/* Certified Architect Verification Bar */}
              <div className="pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between gap-1.5 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium min-w-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span className="whitespace-nowrap shrink-0 text-xs font-semibold">Securiti Certified (Cert ID: 14B411BCE)</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0">
                  <ShieldCheck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  <span>Verified</span>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-muted)] font-mono gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 text-center md:text-left">
            <span>© {new Date().getFullYear()} Meet Eric</span>
            <span className="text-[var(--color-border)] select-none">•</span>
            <span>Production Systems Reliability &amp; Autonomous AI Cockpit</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <a href="#triage" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              Triage Matrix
            </a>
            <span className="text-[var(--color-border)] select-none hidden sm:inline">•</span>
            <a href="#agent-loop" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              8-Stage Agent Loop
            </a>
            <span className="text-[var(--color-border)] select-none hidden sm:inline">•</span>
            <a href="#integrations" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              Integrations Hub
            </a>
            <span className="text-[var(--color-border)] select-none hidden sm:inline">•</span>
            <a href="#security" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              Security Matrix
            </a>
            <span className="text-[var(--color-border)] select-none hidden sm:inline">•</span>
            <a href="#blueprints" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              30-Day Blueprint
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
