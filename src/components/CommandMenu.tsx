'use client';

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Compass,
  FileText,
  Workflow,
  Sliders,
  Radio,
  Sparkles,
  MessageSquare,
  Database,
  Calculator,
  FileJson,
  Zap,
  ShieldCheck,
  Terminal,
  Sun,
  Moon,
} from 'lucide-react';

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenChaos: () => void;
  onOpenGovernance: () => void;
  onOpenLogs: () => void;
  onNavigate?: (sectionId: string) => void;
}

export function CommandMenu({
  open,
  onOpenChange,
  onOpenChaos,
  onOpenGovernance,
  onOpenLogs,
  onNavigate,
}: CommandMenuProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const handleNavigate = (id: string) => {
    onOpenChange(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] p-4 text-[var(--color-text-primary)]">
        <DialogHeader className="border-b border-[var(--color-border)] pb-2 mb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Command Palette (⌘K)
            </DialogTitle>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              ESC to close
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {/* Section Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] font-mono mb-2">
              Jump to Architecture Section
            </h4>
            <div className="space-y-1">
              {[
                { id: 'briefing', label: 'Executive Briefing & Evaluation Paths', icon: FileText },
                { id: 'triage', label: 'Subsystem Triage (Keep / Harden / Refactor / Replace)', icon: Database },
                { id: 'agent-loop', label: '8-Stage Safe Autonomous Agent Loop', icon: Sparkles },
                { id: 'integrations', label: 'Stripe, HubSpot, PostHog, Slack Hub', icon: Radio },
                { id: 'security', label: 'Multi-Tenant Supabase RLS & Tool Defense', icon: ShieldCheck },
                { id: 'telemetry', label: 'Micro-Observability & Telemetry Bento', icon: Workflow },
                { id: 'roi', label: 'Infrastructure & Token Cost Calculator', icon: Calculator },
                { id: 'blueprints', label: '30-Day Ship Blueprint & Code Exports', icon: FileJson },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[var(--color-panel-subtle)] text-xs text-left transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Icon className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                      {item.label}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] font-mono">
                      #{item.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Simulator Actions */}
          <div className="border-t border-[var(--color-border)] pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] font-mono mb-2">
              System Operations & Audits
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onOpenChange(false);
                  onOpenChaos();
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-amber-50/50 dark:hover:bg-amber-950/20 text-xs text-left text-amber-700 dark:text-amber-400 transition-colors"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Launch Chaos & Resilience Simulator</span>
              </button>

              <button
                onClick={() => {
                  onOpenChange(false);
                  onOpenGovernance();
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-xs text-left text-emerald-700 dark:text-emerald-400 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>View NIST AI RMF & OWASP Top 10 Governance</span>
              </button>

              <button
                onClick={() => {
                  onOpenChange(false);
                  onOpenLogs();
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-xs text-left text-[var(--color-text-primary)] transition-colors"
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Open Live Pipeline Event Log Stream</span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
