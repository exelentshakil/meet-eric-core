'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Layers,
  Cpu,
  Zap,
  TrendingUp,
  GitCommit,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

// ==========================================
// 1. INGESTION TELEMETRY (AreaChart)
// ==========================================
const ingestionConfig = {
  reqs: {
    label: 'Throughput (req/s)',
    color: '#10b981',
  },
  p99: {
    label: 'P99 Latency (ms)',
    color: '#059669',
  },
} satisfies ChartConfig;

const ingestionData = [
  { t: '10:00:00', reqs: 4820, p99: 15.1 },
  { t: '10:00:01', reqs: 4950, p99: 14.8 },
  { t: '10:00:02', reqs: 5120, p99: 14.6 },
  { t: '10:00:03', reqs: 5040, p99: 14.7 },
  { t: '10:00:04', reqs: 5310, p99: 14.3 },
  { t: '10:00:05', reqs: 5490, p99: 13.9 },
  { t: '10:00:06', reqs: 5240, p99: 14.2 },
  { t: '10:00:07', reqs: 5380, p99: 14.0 },
  { t: '10:00:08', reqs: 5540, p99: 13.8 },
  { t: '10:00:09', reqs: 5410, p99: 14.1 },
  { t: '10:00:10', reqs: 5320, p99: 14.2 },
  { t: '10:00:11', reqs: 5240, p99: 14.2 },
];

// ==========================================
// 2. POSTGRESQL QUERY ACCELERATION (Horizontal BarChart)
// ==========================================
const pgConfig = {
  ms: {
    label: 'Query Latency (ms)',
    color: '#6366f1',
  },
} satisfies ChartConfig;

const pgData = [
  { method: 'Seq Scan', ms: 428, display: '428ms', fill: '#f43f5e', sub: '14.2k disk reads' },
  { method: 'Partial Idx', ms: 48.2, display: '48.2ms', fill: '#f59e0b', sub: '1.8k buffer hits' },
  { method: 'Covering Idx', ms: 3.8, display: '3.8ms', fill: '#10b981', sub: '42 buffer hits' },
  { method: 'PgBouncer', ms: 0.9, display: '0.9ms', fill: '#06b6d4', sub: 'RAM cache' },
];

// ==========================================
// 3. CONNECTION POOL DEFENSE (Donut / Semi-Circle PieChart)
// ==========================================
const poolConfig = {
  active: { label: 'Active (12)', color: '#10b981' },
  reserved: { label: 'Reserved (8)', color: '#6366f1' },
  headroom: { label: 'Headroom (5)', color: '#94a3b8' },
} satisfies ChartConfig;

const poolData = [
  { name: 'Active Querying', value: 12, fill: '#10b981' },
  { name: 'Reserved / Warm', value: 8, fill: '#6366f1' },
  { name: 'Spare Headroom', value: 5, fill: '#94a3b8' },
];

// ==========================================
// 4. CACHE STAMPEDE (XFetch) DEFENSE (Multi-Line Chart)
// ==========================================
const cacheConfig = {
  xfetch: {
    label: 'XFetch Active (99.4%)',
    color: '#8b5cf6',
  },
  standard: {
    label: 'Standard TTL Expiry',
    color: '#f43f5e',
  },
} satisfies ChartConfig;

const cacheData = [
  { t: '0s', xfetch: 99.8, standard: 99.8 },
  { t: '15s', xfetch: 99.6, standard: 99.4 },
  { t: '30s', xfetch: 99.5, standard: 99.1 },
  { t: '45s', xfetch: 99.4, standard: 95.0 },
  { t: '55s', xfetch: 99.4, standard: 52.0 },
  { t: '60s', xfetch: 99.3, standard: 0.0 },
];

// ==========================================
// 5. AI GATEWAY ROUTING & LATENCY (Comparative BarChart)
// ==========================================
const aiConfig = {
  latency: {
    label: 'Latency (ms)',
    color: '#10b981',
  },
} satisfies ChartConfig;

const aiData = [
  { provider: 'Gemini 2.5', latency: 142, share: '92.4%', fill: '#10b981' },
  { provider: 'GPT-4o-mini', latency: 310, share: '7.2%', fill: '#6366f1' },
  { provider: 'Local Cache', latency: 14, share: '0.4%', fill: '#0284c7' },
];

// ==========================================
// 6. CI/CD & TESTING RIGOR (Stage Runtime BarChart)
// ==========================================
const cicdConfig = {
  duration: {
    label: 'Duration (s)',
    color: '#10b981',
  },
} satisfies ChartConfig;

const cicdData = [
  { stage: 'Lint', duration: 0.8, fill: '#10b981' },
  { stage: 'Types', duration: 1.9, fill: '#10b981' },
  { stage: 'DryRun', duration: 1.2, fill: '#10b981' },
  { stage: 'Workers', duration: 2.6, fill: '#10b981' },
  { stage: 'Deploy', duration: 3.4, fill: '#06b6d4' },
];

export function BentoGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* ========================================================
            CARD 1: Webhook Stream Ingestion (Smooth AreaChart)
        ======================================================== */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Webhook Stream Ingestion
              </span>
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
                <Activity className="h-3 w-3 animate-pulse" />
                <span>99.99% Delivered</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
                5,240 req/s
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">
                P99: 14.2ms
              </span>
            </div>
          </div>

          {/* Genuine Shadcn AreaChart with Full Edge-to-Edge Fill */}
          <div className="mt-3 h-[85px] w-full">
            {mounted ? (
              <ChartContainer config={ingestionConfig} className="aspect-auto h-[85px] w-full">
                <AreaChart
                  data={ingestionData}
                  margin={{ top: 6, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <ChartTooltip
                    cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '2 2' }}
                    content={<ChartTooltipContent hideLabel indicator="dot" />}
                  />
                  <ReferenceLine y={5000} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.4} />
                  <Area
                    type="monotone"
                    dataKey="reqs"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#streamGrad)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="h-[85px] w-full bg-[var(--color-panel-subtle)] animate-pulse rounded-lg" />
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
            <span>Buffer: Redis 7</span>
            <span>Workers: 16 Celery</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Lag: 0ms</span>
          </div>
        </div>

        {/* ========================================================
            CARD 2: PostgreSQL 16 Optimization (Comparative Horizontal BarChart)
        ======================================================== */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                PostgreSQL 16 Optimization
              </span>
              <div className="flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 whitespace-nowrap shrink-0">
                <TrendingUp className="h-3 w-3" />
                <span>112x Speedup</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
                3.8 ms
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">
                down from 428ms
              </span>
            </div>
          </div>

          {/* Genuine Shadcn Horizontal Comparative BarChart with Safe Margins */}
          <div className="mt-3 h-[85px] w-full">
            {mounted ? (
              <ChartContainer config={pgConfig} className="aspect-auto h-[85px] w-full">
                <BarChart
                  data={pgData}
                  layout="vertical"
                  margin={{ top: 2, right: 12, left: 4, bottom: 2 }}
                >
                  <XAxis type="number" hide domain={[0, 450]} />
                  <YAxis
                    dataKey="method"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9.5, fill: 'var(--color-text-secondary)', fontFamily: 'monospace' }}
                    width={85}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name, item) => (
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className="font-bold">{item.payload.method}:</span>
                            <span className="text-emerald-500 font-semibold">{item.payload.display}</span>
                            <span className="text-slate-400 text-[10px]">({item.payload.sub})</span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="ms" radius={[0, 4, 4, 0]} barSize={11} isAnimationActive={false}>
                    {pgData.map((entry, index) => (
                      <Cell key={`pg-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[85px] w-full bg-[var(--color-panel-subtle)] animate-pulse rounded-lg" />
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
            <span>Disk I/O: 14.2k ➔ 0</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">B-Tree Hot Hit</span>
          </div>
        </div>

        {/* ========================================================
            CARD 3: Connection Pool Defense (Donut Chart & Saturation Meter)
        ======================================================== */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Connection Pool Defense
              </span>
              <div className="flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0">
                <Layers className="h-3 w-3" />
                <span>58:1 Ratio</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
                1,450 Clients
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">
                ➔ 25 Postgres Slots
              </span>
            </div>
          </div>

          {/* Genuine Shadcn Donut / PieChart */}
          <div className="mt-2 flex items-center justify-between gap-2 h-[90px] w-full">
            <div className="h-[90px] w-[95px] relative shrink-0">
              {mounted ? (
                <ChartContainer config={poolConfig} className="aspect-auto h-[90px] w-[95px]">
                  <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <ChartTooltip
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={poolData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={24}
                      outerRadius={38}
                      paddingAngle={4}
                      strokeWidth={1}
                      stroke="var(--color-surface)"
                      isAnimationActive={false}
                    >
                      {poolData.map((entry, index) => (
                        <Cell key={`pool-cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="h-[90px] w-[95px] rounded-full bg-[var(--color-panel-subtle)] animate-pulse" />
              )}
              {/* Central Donut Badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] font-bold font-mono text-[var(--color-text-primary)] leading-none">25</span>
                <span className="text-[8px] font-mono text-[var(--color-text-muted)] leading-none mt-0.5">SLOTS</span>
              </div>
            </div>

            {/* Micro Breakdown Legend */}
            <div className="flex-1 space-y-1.5 font-mono text-xs pr-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-[var(--color-text-secondary)]">Active (12)</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">48%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  <span className="text-[11px] text-[var(--color-text-secondary)]">Reserved (8)</span>
                </div>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">32%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-slate-400" />
                  <span className="text-[11px] text-[var(--color-text-secondary)]">Spare (5)</span>
                </div>
                <span className="text-[11px] font-bold text-slate-500">20%</span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
            <span>Pooler: PgBouncer</span>
            <span>Wait Queue: 0ms</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Zero Spikes</span>
          </div>
        </div>

        {/* ========================================================
            CARD 4: Cache Stampede Defense (XFetch vs Standard LineChart)
        ======================================================== */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Cache Stampede Defense
              </span>
              <div className="flex items-center gap-1 rounded-full bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 whitespace-nowrap shrink-0">
                <Zap className="h-3 w-3" />
                <span>XFetch Active</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
                0 Spike Events
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">
                99.4% Hit Rate
              </span>
            </div>
          </div>

          {/* Genuine Shadcn Multi-Line Chart comparing XFetch vs Standard TTL cliff */}
          <div className="mt-3 h-[85px] w-full">
            {mounted ? (
              <ChartContainer config={cacheConfig} className="aspect-auto h-[85px] w-full">
                <LineChart
                  data={cacheData}
                  margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                >
                  <YAxis domain={[0, 105]} hide />
                  <XAxis
                    dataKey="t"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9.5, fill: 'var(--color-text-muted)', fontFamily: 'monospace' }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => (
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className="font-semibold">{name === 'xfetch' ? 'XFetch Early Recompute' : 'Standard TTL Cliff'}:</span>
                            <span className={name === 'xfetch' ? 'text-purple-500 font-bold' : 'text-rose-500 font-bold'}>
                              {value}% Hit
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  {/* Standard TTL Cliff (Dashed Crimson Plunge) */}
                  <Line
                    type="monotone"
                    dataKey="standard"
                    stroke="#f43f5e"
                    strokeWidth={1.75}
                    strokeDasharray="3 3"
                    dot={false}
                    isAnimationActive={false}
                  />
                  {/* XFetch Probabilistic Early Compute (Solid Purple) */}
                  <Line
                    type="monotone"
                    dataKey="xfetch"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[85px] w-full bg-[var(--color-panel-subtle)] animate-pulse rounded-lg" />
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
            <span className="text-purple-600 dark:text-purple-400 font-semibold">― XFetch (99.4%)</span>
            <span className="text-rose-500">··· TTL Cliff (0%)</span>
            <span>Beta: 1.0</span>
          </div>
        </div>

        {/* ========================================================
            CARD 5: AI Microservice Gateway (Comparative Provider BarChart)
        ======================================================== */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                AI Microservice Gateway
              </span>
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
                <Cpu className="h-3 w-3" />
                <span>Multi-Provider</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
                142 ms
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">
                Auto-Failover &lt; 500ms
              </span>
            </div>
          </div>

          {/* Genuine Shadcn Multi-Provider BarChart with Safe Margins */}
          <div className="mt-3 h-[85px] w-full">
            {mounted ? (
              <ChartContainer config={aiConfig} className="aspect-auto h-[85px] w-full">
                <BarChart
                  data={aiData}
                  layout="vertical"
                  margin={{ top: 2, right: 12, left: 4, bottom: 2 }}
                >
                  <XAxis type="number" hide domain={[0, 350]} />
                  <YAxis
                    dataKey="provider"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9.5, fill: 'var(--color-text-secondary)', fontFamily: 'monospace' }}
                    width={85}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name, item) => (
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className="font-bold">{item.payload.provider}:</span>
                            <span className="text-emerald-500 font-semibold">{item.payload.latency}ms</span>
                            <span className="text-slate-400 text-[10px]">({item.payload.share} traffic)</span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="latency" radius={[0, 4, 4, 0]} barSize={11} isAnimationActive={false}>
                    {aiData.map((entry, index) => (
                      <Cell key={`ai-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[85px] w-full bg-[var(--color-panel-subtle)] animate-pulse rounded-lg" />
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Gemini 2.5: 92.4%</span>
            <span>GPT-4o-mini: 7.2%</span>
            <span>Cache: 0.4%</span>
          </div>
        </div>

        {/* ========================================================
            CARD 6: CI/CD & Testing Rigor (Stage Duration BarChart)
        ======================================================== */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                CI/CD &amp; Testing Rigor
              </span>
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
                <GitCommit className="h-3 w-3" />
                <span>Passing CI (9.9s)</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
                100% Strict
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">
                Type-Safe
              </span>
            </div>
          </div>

          {/* Genuine Shadcn Stage Duration BarChart */}
          <div className="mt-3 h-[85px] w-full">
            {mounted ? (
              <ChartContainer config={cicdConfig} className="aspect-auto h-[85px] w-full">
                <BarChart
                  data={cicdData}
                  margin={{ top: 6, right: 6, left: 6, bottom: 0 }}
                >
                  <YAxis hide domain={[0, 4]} />
                  <XAxis
                    dataKey="stage"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9.5, fill: 'var(--color-text-muted)', fontFamily: 'monospace' }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name, item) => (
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className="font-bold">{item.payload.stage}:</span>
                            <span className="text-emerald-500 font-semibold">{item.payload.duration}s</span>
                            <span className="text-emerald-600 font-medium text-[10px]">PASSED</span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="duration" radius={[4, 4, 0, 0]} barSize={18} isAnimationActive={false}>
                    {cicdData.map((entry, index) => (
                      <Cell key={`cicd-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[85px] w-full bg-[var(--color-panel-subtle)] animate-pulse rounded-lg" />
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Dry-Run: Verified</span>
            <span>TypeScript: 0 Errors</span>
            <span className="text-cyan-600 dark:text-cyan-400">Deploy: 3.4s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
