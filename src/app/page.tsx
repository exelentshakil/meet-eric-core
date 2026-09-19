'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { ReviewerTour } from '@/components/ReviewerTour';
import { SubsystemTriage } from '@/components/SubsystemTriage';
import { AgentExecutionLoop } from '@/components/AgentExecutionLoop';
import { IntegrationHub } from '@/components/IntegrationHub';
import { SecurityMatrix } from '@/components/SecurityMatrix';
import { BentoGrid } from '@/components/BentoGrid';
import { RoiCostCalculator } from '@/components/RoiCostCalculator';
import { BlueprintExporter } from '@/components/BlueprintExporter';
import { ChaosSimulatorModal } from '@/components/ChaosSimulatorModal';
import { AiGovernanceDrawer } from '@/components/AiGovernanceDrawer';
import { ExecutionLogDrawer } from '@/components/ExecutionLogDrawer';
import { CommandMenu } from '@/components/CommandMenu';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('briefing');
  const [chaosModalOpen, setChaosModalOpen] = useState(false);
  const [governanceDrawerOpen, setGovernanceDrawerOpen] = useState(false);
  const [logsDrawerOpen, setLogsDrawerOpen] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  const isNavigatingRef = useRef(false);
  const navTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    isNavigatingRef.current = true;
    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
    }

    if (sectionId === 'briefing') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const headerOffset = 64;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = Math.max(0, elementPosition + window.scrollY - headerOffset);
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }

    const releaseLock = () => {
      isNavigatingRef.current = false;
      window.removeEventListener('scrollend', releaseLock);
    };

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', releaseLock, { once: true });
    }
    navTimeoutRef.current = setTimeout(releaseLock, 1400);
  };

  useEffect(() => {
    const sectionIds = ['briefing', 'triage', 'agent-loop', 'integrations', 'security', 'telemetry', 'roi', 'blueprints'];
    const observer = new IntersectionObserver(
      (entries) => {
        if (isNavigatingRef.current) return;
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort(
            (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          );
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: 0.1 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-text-primary)]">
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChaosModal={() => setChaosModalOpen(true)}
        onOpenGovernanceDrawer={() => setGovernanceDrawerOpen(true)}
        onOpenLogsDrawer={() => setLogsDrawerOpen(true)}
        onOpenCommandMenu={() => setCommandMenuOpen(true)}
      />

      <main className="w-full max-w-full min-w-0 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          <section id="briefing" className="scroll-mt-20">
            <ReviewerTour
              onNavigate={handleNavigate}
              onOpenChaosModal={() => setChaosModalOpen(true)}
            />
          </section>

          {/* Subsystem Triage: Keep / Harden / Refactor / Replace */}
          <section id="triage" className="scroll-mt-20">
            <SubsystemTriage />
          </section>

          {/* 8-Stage Safe Autonomous Agent Execution Loop */}
          <section id="agent-loop" className="scroll-mt-20">
            <AgentExecutionLoop />
          </section>

          {/* Integrations & Webhooks Reliability Hub */}
          <section id="integrations" className="scroll-mt-20">
            <IntegrationHub />
          </section>

          {/* Multi-Tenant RLS & Security Matrix */}
          <section id="security" className="scroll-mt-20">
            <SecurityMatrix />
          </section>

          {/* Micro-Observability & Telemetry */}
          <section id="telemetry" className="scroll-mt-20">
            <BentoGrid />
          </section>

          {/* Cost & ROI Calculator */}
          <section id="roi" className="scroll-mt-20">
            <RoiCostCalculator />
          </section>

          {/* 30-Day Blueprints */}
          <section id="blueprints" className="scroll-mt-20">
            <BlueprintExporter />
          </section>
        </div>
      </main>

      <Footer />

      <ChaosSimulatorModal
        open={chaosModalOpen}
        onOpenChange={setChaosModalOpen}
      />

      <AiGovernanceDrawer
        open={governanceDrawerOpen}
        onOpenChange={setGovernanceDrawerOpen}
      />

      <ExecutionLogDrawer
        open={logsDrawerOpen}
        onOpenChange={setLogsDrawerOpen}
      />

      <CommandMenu
        open={commandMenuOpen}
        onOpenChange={setCommandMenuOpen}
        onOpenChaos={() => {
          setCommandMenuOpen(false);
          setChaosModalOpen(true);
        }}
        onOpenGovernance={() => {
          setCommandMenuOpen(false);
          setGovernanceDrawerOpen(true);
        }}
        onOpenLogs={() => {
          setCommandMenuOpen(false);
          setLogsDrawerOpen(true);
        }}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
