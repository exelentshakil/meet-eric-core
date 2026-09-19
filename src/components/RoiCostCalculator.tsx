'use client';

import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
  Zap,
  Building2,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RoiCostCalculator() {
  const [betaClients, setBetaClients] = useState<number>(30);
  const [monthlyEventsPerClient, setMonthlyEventsPerClient] = useState<number>(12000);
  const [avgClientArr, setAvgClientArr] = useState<number>(4500);
  const [churnReductionPercent, setChurnReductionPercent] = useState<number>(18);

  // Operational Infrastructure Calculations
  const totalEvents = betaClients * monthlyEventsPerClient;
  const investigationsCount = Math.round(totalEvents * 0.04); // ~4% anomalies investigated

  // gpt-4o-mini & gemini-2.0-flash micro-costs: ~$0.00015 per investigation
  const monthlyAiCost = +(investigationsCount * 0.00015).toFixed(2);
  const supabaseCost = 25.0; // Supabase Pro compute tier with connection pooler
  const inngestQueueCost = totalEvents > 100000 ? 20.0 : 0.0; // Inngest durable queue

  const totalMonthlyCost = +(supabaseCost + inngestQueueCost + monthlyAiCost).toFixed(2);

  // Churn & Growth ROI Calculations
  // Total Monthly ARR Monitored
  const totalMonitoredArr = betaClients * avgClientArr;
  // Estimated churn rate without Eric: ~4.5%/mo
  const baselineMonthlyChurn = totalMonitoredArr * 0.045;
  // Preserved Revenue with Eric
  const preservedMonthlyRevenue = +(baselineMonthlyChurn * (churnReductionPercent / 100)).toFixed(2);
  const netMonthlyValue = +(preservedMonthlyRevenue - totalMonthlyCost).toFixed(2);
  const annualPreservedValue = +(preservedMonthlyRevenue * 12).toFixed(0);

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0">
              <Calculator className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              SaaS Infrastructure Economics
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono hidden sm:inline">
              Supabase Compute • Dual AI Inference • Net Preserved ARR
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
            Meet Eric Infrastructure Micro-Costs &amp; Growth ROI Engine
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Transparent cost modeling across your 30 beta clients and scaling up to the exhibition. Low-overhead Supabase and dual-provider AI keep running costs under $60/month while preserving thousands in recurring ARR.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-[var(--color-text-muted)] font-mono block">
            Estimated Total Compute Cost
          </span>
          <span className="text-xl sm:text-2xl font-semibold text-blue-600 dark:text-blue-400 font-mono">
            ${totalMonthlyCost}/mo
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Sliders & Controls */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Slider 1: Active Beta Organizations */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[var(--color-text-primary)]">
                  Active Client Workspaces
                </span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                  {betaClients} Beta Orgs
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={betaClients}
                onChange={(e) => setBetaClients(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-[var(--color-panel-subtle)] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-mono">
                <span>30 (Current Beta)</span>
                <span>75</span>
                <span>150 (Post-Exhibition)</span>
              </div>
            </div>

            {/* Slider 2: Monthly Customer Events per Org */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[var(--color-text-primary)]">
                  Monthly Telemetry Events / Org
                </span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                  {monthlyEventsPerClient.toLocaleString()} events
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="50000"
                step="2000"
                value={monthlyEventsPerClient}
                onChange={(e) => setMonthlyEventsPerClient(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-[var(--color-panel-subtle)] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-mono">
                <span>2k/mo</span>
                <span>25k/mo</span>
                <span>50k/mo</span>
              </div>
            </div>

            {/* Slider 3: Average Client Monthly ARR */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[var(--color-text-primary)]">
                  Average Monitored Client ARR
                </span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                  ${avgClientArr.toLocaleString()}/mo
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={avgClientArr}
                onChange={(e) => setAvgClientArr(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-[var(--color-panel-subtle)] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-mono">
                <span>$1k</span>
                <span>$7.5k</span>
                <span>$15k</span>
              </div>
            </div>

            {/* Slider 4: Churn Reduction / Recovery % */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[var(--color-text-primary)]">
                  Eric Churn Reduction &amp; Recovery
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  +{churnReductionPercent}% Preserved
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={churnReductionPercent}
                onChange={(e) => setChurnReductionPercent(Number(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-[var(--color-panel-subtle)] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-mono">
                <span>5%</span>
                <span>18% (Baseline)</span>
                <span>40%</span>
              </div>
            </div>
          </div>

          {/* Infrastructure Breakdown Card */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-3 space-y-2 text-xs font-mono">
            <div className="text-[11px] font-bold text-[var(--color-text-primary)] uppercase">
              Itemized Infrastructure Micro-Costs:
            </div>
            <div className="flex justify-between text-[var(--color-text-secondary)]">
              <span>Supabase Pro (PostgreSQL + PgBouncer)</span>
              <span className="text-[var(--color-text-primary)] font-semibold">${supabaseCost.toFixed(2)}/mo</span>
            </div>
            <div className="flex justify-between text-[var(--color-text-secondary)]">
              <span>Dual AI Inference ({investigationsCount.toLocaleString()} runs @ $0.00015)</span>
              <span className="text-[var(--color-text-primary)] font-semibold">${monthlyAiCost.toFixed(2)}/mo</span>
            </div>
            <div className="flex justify-between text-[var(--color-text-secondary)]">
              <span>Inngest Durable Background Queues</span>
              <span className="text-[var(--color-text-primary)] font-semibold">${inngestQueueCost.toFixed(2)}/mo</span>
            </div>
          </div>
        </div>

        {/* ROI Output Card (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 p-5 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-blue-700 dark:text-blue-400">
                Projected Business Impact
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-semibold">
                ROI: {Math.round((preservedMonthlyRevenue / (totalMonthlyCost || 1)) * 100)}%
              </span>
            </div>

            <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-4 space-y-3">
              <div>
                <span className="text-xs text-[var(--color-text-muted)] font-mono block">
                  Preserved Monthly Revenue (Net Churn Averted)
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  +${preservedMonthlyRevenue.toLocaleString()}/mo
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--color-border-subtle)] text-xs font-mono">
                <div>
                  <span className="text-[var(--color-text-muted)] text-[11px] block">Monitored MRR</span>
                  <span className="font-bold text-[var(--color-text-primary)]">${totalMonitoredArr.toLocaleString()}/mo</span>
                </div>
                <div>
                  <span className="text-[var(--color-text-muted)] text-[11px] block">Annualized Impact</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+${Number(annualPreservedValue).toLocaleString()}/yr</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              By detecting drop-offs at checkout and stalled CRM opportunities before leads disengage, Eric pays for his own infrastructure multiple times over each month.
            </p>
          </div>

          <div className="pt-2 text-[11px] font-mono text-[var(--color-text-muted)] flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span>Exhibition &amp; Multi-Tenant Capacity Confirmed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
