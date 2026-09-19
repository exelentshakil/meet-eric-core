'use client';

import React from 'react';
import {
  Layers,
  Bot,
  Webhook,
  ShieldCheck,
  Activity,
  Calculator,
  Download,
  Search,
  SlidersHorizontal,
  Sun,
  Moon,
  CheckCircle2,
  ChevronDown,
  Terminal,
  Zap,
  Sparkles,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenChaosModal: () => void;
  onOpenGovernanceDrawer: () => void;
  onOpenLogsDrawer: () => void;
  onOpenCommandMenu: () => void;
}

export function Header({
  activeSection,
  onNavigate,
  onOpenChaosModal,
  onOpenGovernanceDrawer,
  onOpenLogsDrawer,
  onOpenCommandMenu,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  // Primary navigation anchors for Meet Eric
  const primaryNavItems = [
    { id: 'triage', label: 'Triage Matrix', icon: Layers },
    { id: 'agent-loop', label: 'Agent Runner', icon: Bot },
    { id: 'integrations', label: 'Integrations', icon: Webhook },
    { id: 'security', label: 'Security & RLS', icon: ShieldCheck },
    { id: 'telemetry', label: 'Observability', icon: Activity },
  ];

  // Secondary navigation anchors in sleek "More" dropdown
  const secondaryNavItems = [
    { id: 'roi', label: 'Infrastructure & ROI', icon: Calculator, desc: 'Supabase compute & token micro-costs' },
    { id: 'blueprints', label: '30-Day Shipping Blueprint', icon: Download, desc: 'Turnkey architectural migrations & code' },
    { id: 'briefing', label: 'Executive Briefing', icon: Zap, desc: 'Context for 30 beta users & exhibition' },
  ];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeSection);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Cluster: Brand Anchor + Hairline Divider + Integrated Primary Nav */}
        <div className="flex items-center gap-3 xl:gap-4 shrink-0 min-w-0">
          {/* Brand Logo Lockup */}
          <button
            onClick={() => onNavigate('briefing')}
            className="group flex items-center gap-2.5 text-left transition-opacity hover:opacity-90 shrink-0"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xs font-bold shrink-0 text-sm">
              E
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
                Meet Eric
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono">
                AI Head of Growth
              </span>
            </div>
          </button>

          {/* Hairline Divider */}
          <div className="hidden md:block h-4 w-px bg-[var(--color-border)] select-none shrink-0" />

          {/* Inlined Primary Navigation for Quick 1-Click Access */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 ${
                    isActive
                      ? 'border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-[var(--color-text-primary)] font-semibold shadow-2xs'
                      : 'border border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)]/70'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-[var(--color-text-muted)]'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}

            {/* "More" Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all shrink-0 ${
                    isSecondaryActive
                      ? 'border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-[var(--color-text-primary)] font-semibold shadow-2xs'
                      : 'border border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)]/70'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className="h-3 w-3 opacity-60 ml-0.5 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="w-60 bg-[var(--color-surface)] border border-[var(--color-border)] p-1.5 shadow-lg"
              >
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      onSelect={() => {
                        setTimeout(() => onNavigate(item.id), 20);
                      }}
                      className={`flex items-start gap-2.5 p-2 rounded-md cursor-pointer text-xs ${
                        isActive ? 'bg-[var(--color-panel-subtle)] font-semibold text-blue-600 dark:text-blue-400' : 'text-[var(--color-text-primary)]'
                      }`}
                    >
                      <Icon className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <div>
                        <div className="font-medium leading-none">{item.label}</div>
                        <div className="text-xs text-[var(--color-text-muted)] mt-1 font-normal">{item.desc}</div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Right Cluster: PDF Blueprint + Quick Search + Diagnostics + Theme */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-4 lg:ml-6">
          {/* 1-Click PDF Architecture Blueprint Download */}
          <a
            href="/Meet-Eric-Architecture-Blueprint.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-md border border-blue-200 dark:border-blue-800/80 bg-blue-50/90 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-2xs transition-colors whitespace-nowrap shrink-0"
            title="Open 1-Page Systems Blueprint PDF (Ref #BS-2026-ERIC)"
          >
            <Download className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="hidden sm:inline">30-Day Blueprint (PDF)</span>
            <span className="sm:hidden">Blueprint PDF</span>
          </a>

          {/* Quick Search ⌘K Button */}
          <button
            onClick={onOpenCommandMenu}
            className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-2.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-slate-400 transition-colors shadow-2xs whitespace-nowrap shrink-0"
            title="Quick Navigation Palette (⌘K)"
          >
            <Search className="h-3.5 w-3.5 text-[var(--color-text-muted)] shrink-0" />
            <span className="font-medium whitespace-nowrap">Quick</span>
            <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-1.5 py-0.5 text-xs font-mono font-semibold text-[var(--color-text-muted)] shrink-0">
              ⌘K
            </kbd>
          </button>

          {/* Consolidated Diagnostics & Governance Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-medium border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)] gap-1 px-2.5 shadow-2xs whitespace-nowrap shrink-0"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--color-text-secondary)] shrink-0" />
                <span className="hidden md:inline">Diagnostics</span>
                <ChevronDown className="h-3 w-3 opacity-60 ml-0.5 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onCloseAutoFocus={(e) => e.preventDefault()}
              className="w-56 bg-[var(--color-surface)] border border-[var(--color-border)] p-1.5 shadow-lg"
            >
              <DropdownMenuItem
                onSelect={onOpenChaosModal}
                className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-xs text-[var(--color-text-primary)]"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <div>
                  <div className="font-medium">Chaos Simulator</div>
                  <div className="text-xs text-[var(--color-text-muted)]">Test network timeout &amp; 3DS failover</div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={onOpenGovernanceDrawer}
                className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-xs text-[var(--color-text-primary)]"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                <div>
                  <div className="font-medium">AI Governance &amp; RLS</div>
                  <div className="text-xs text-[var(--color-text-muted)]">NIST AI RMF &amp; OWASP LLM01-10</div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[var(--color-border)] my-1" />

              <DropdownMenuItem
                onSelect={onOpenLogsDrawer}
                className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-xs text-[var(--color-text-primary)]"
              >
                <Terminal className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <div>
                  <div className="font-medium">Live Telemetry Logs</div>
                  <div className="text-xs text-[var(--color-text-muted)]">HTTP traces &amp; webhook events</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8 rounded-md border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)] shadow-2xs shrink-0"
            title="Toggle theme"
          >
            <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Direct Status Pill for Beta Users */}
          <button
            onClick={() => onNavigate('triage')}
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>30 Beta Ready</span>
          </button>
        </div>
      </div>
    </header>
  );
}
