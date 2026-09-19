/**
 * Inline LLM Firewall & AI Governance Shield
 * Securiti Certified Architect ID: 14B411BCE-14B411A3D-1451CFE76
 * Compliance: NIST AI RMF (Govern, Map, Measure, Manage) & OWASP Top 10 for LLMs (LLM01-LLM10)
 */

export interface FirewallScanResult {
  passed: boolean;
  sanitizedInput: string;
  piiRedacted: boolean;
  injectionDetected: boolean;
  riskScore: number; // 0.0 to 1.0
  redactions: Array<{ type: string; count: number }>;
  flaggedTokens?: string[];
}

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /you\s+are\s+now\s+(in\s+)?(developer\s+mode|dan|jailbreak)/i,
  /system\s*:\s*override/i,
  /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions|api\s*key)/i,
  /dump\s+(all\s+)?(memory|environment\s+variables|tokens)/i,
  /bypass\s+(safety|content\s+filter|guardrail)/i,
];

const PII_PATTERNS = [
  { type: 'EMAIL', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, mask: '[REDACTED_EMAIL]' },
  { type: 'PHONE', regex: /\b(\+?\d{1,2}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, mask: '[REDACTED_PHONE]' },
  { type: 'CREDIT_CARD', regex: /\b(?:\d{4}[ -]?){3}\d{4}\b/g, mask: '[REDACTED_CC]' },
  { type: 'SSN', regex: /\b\d{3}-\d{2}-\d{4}\b/g, mask: '[REDACTED_SSN]' },
];

export function scanAndSanitizePrompt(rawInput: string): FirewallScanResult {
  let sanitized = rawInput;
  let piiRedacted = false;
  const redactions: Array<{ type: string; count: number }> = [];

  // 1. PII Redaction (OWASP LLM02)
  for (const { type, regex, mask } of PII_PATTERNS) {
    const matches = sanitized.match(regex);
    if (matches && matches.length > 0) {
      piiRedacted = true;
      redactions.push({ type, count: matches.length });
      sanitized = sanitized.replace(regex, mask);
    }
  }

  // 2. Prompt Injection Defense (OWASP LLM01)
  let injectionDetected = false;
  const flaggedTokens: string[] = [];

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(rawInput)) {
      injectionDetected = true;
      flaggedTokens.push(pattern.source);
    }
  }

  const riskScore = injectionDetected ? 0.95 : piiRedacted ? 0.25 : 0.05;

  return {
    passed: !injectionDetected,
    sanitizedInput: sanitized,
    piiRedacted,
    injectionDetected,
    riskScore,
    redactions,
    flaggedTokens: flaggedTokens.length > 0 ? flaggedTokens : undefined,
  };
}
