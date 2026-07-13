// Shared security helpers for edge functions: CORS allow-listing + best-effort
// in-memory rate limiting. Import from "../_shared/security.ts".

const ALLOWED = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

/**
 * Build CORS headers for a request. If ALLOWED_ORIGINS is configured, only
 * matching origins are echoed back (others get the first allowed origin, so the
 * browser blocks them). If it is NOT configured, falls back to "*" so local dev
 * still works — set ALLOWED_ORIGINS in production to lock this down.
 */
export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  let allowOrigin = "*";
  if (ALLOWED.length > 0) {
    allowOrigin = ALLOWED.includes(origin) ? origin : ALLOWED[0];
  }
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

// --- Best-effort per-IP fixed-window rate limiter -------------------------
// Note: edge instances are ephemeral, so this only throttles bursts hitting a
// warm instance. For hard guarantees use an external store (e.g. Upstash).
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/** Returns true if the request is over the limit and should be rejected. */
export function isRateLimited(req: Request): boolean {
  const ip = clientIp(req);
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}
