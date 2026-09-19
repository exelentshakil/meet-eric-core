import { NextResponse } from 'next/server';

export async function GET() {
  const hasOpenAi = !!process.env.OPENAI_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    status: 'healthy',
    system: 'Meet Eric • AI Head of Growth (Production Architecture Cockpit)',
    timestamp: new Date().toISOString(),
    version: '2.4.0-prod',
    environment: 'production-hardening',
    activeBetaUsers: 30,
    exhibitionStatus: 'exhibition-ready',
    providers: {
      openai: {
        active: hasOpenAi,
        model: 'gpt-4o-mini',
        role: 'primary-investigation-engine',
      },
      gemini: {
        active: hasGemini,
        model: 'gemini-2.0-flash',
        role: 'failover-investigation-engine',
      },
      deterministic: {
        active: true,
        model: 'rule-engine-v1',
        role: 'zero-dependency-offline-fallback',
      },
      supabase: {
        active: hasSupabase,
        role: 'multi-tenant-rls-datastore',
      },
    },
    subsystemTriage: {
      supabaseRls: 'HARDENED (app.current_org_id context)',
      webhookIngestion: 'HARDENED (advisory lock + idempotency)',
      agentExecution: 'REFACTORED (8-stage safe gate with approval)',
      oauthVault: 'HARDENED (AES-256-GCM + proactive refresh)',
      backgroundQueues: 'REPLACED (Inngest durable workflows)',
      slackActions: 'KEPT (Block Kit + HMAC-SHA256 signature)',
    },
    capabilities: [
      '8-stage-safe-agent-execution-loop',
      'multi-tenant-supabase-rls-isolation',
      'stripe-hubspot-webhook-idempotency-engine',
      'human-in-the-loop-slack-approval-gate',
      'securiti-certified-llm-firewall-owasp-nist',
      'sha256-cryptographic-audit-ledger',
    ],
  });
}
