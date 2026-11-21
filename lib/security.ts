import "server-only";
import { createHash } from "node:crypto";
import { getConfig } from "./config";

/**
 * Kräver att POST-anrop kommer från appens egen sida (skydd mot CSRF och andra sajter).
 * Godkänner samma värd som anropet, eller adressen i SITE_URL (behövs när t.ex.
 * ns-dev.tech/aiassistant vidarebefordras från Netlify till appen på Vercel).
 */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (host && originHost === host) return true;
  try {
    return !!process.env.SITE_URL && originHost === new URL(process.env.SITE_URL).host;
  } catch {
    return false;
  }
}

/** IP-adressen hashas: vi behöver kunna räkna anrop, inte veta vem som gör dem. */
export function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || req.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${ip}:${getConfig().sessionSecret}`).digest("hex").slice(0, 24);
}

export class BadRequest extends Error {}

/** Läser JSON med storleksgräns. */
export async function readJson(req: Request, maxBytes = 20_000): Promise<unknown> {
  const text = await req.text();
  if (text.length > maxBytes) throw new BadRequest("För stort anrop");
  try {
    return JSON.parse(text);
  } catch {
    throw new BadRequest("Ogiltig JSON");
  }
}

export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}
