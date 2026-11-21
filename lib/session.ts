import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getConfig, type Invite } from "./config";
import { findActiveInviteById, inviteExpiresAt } from "./invites";

// Signerad sessionscookie: { inviteId, utgångstid } + HMAC-signatur.
// HttpOnly (JavaScript kommer inte åt den), Secure, SameSite=Strict.

export const SESSION_COOKIE = "ra_session";

function sign(payload: string): string {
  return createHmac("sha256", getConfig().sessionSecret).update(payload).digest("base64url");
}

export function createSessionValue(invite: Invite): { value: string; expires: Date } {
  const { sessionDays } = getConfig();
  const exp = Math.min(Date.now() + sessionDays * 86_400_000, inviteExpiresAt(invite));
  const payload = Buffer.from(JSON.stringify({ i: invite.id, e: exp })).toString("base64url");
  return { value: `${payload}.${sign(payload)}`, expires: new Date(exp) };
}

export function cookieOptions(expires: Date) {
  const { isProd, basePath } = getConfig();
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict" as const,
    path: basePath || "/",
    expires,
  };
}

export function verifySessionValue(value: string | undefined): Invite | null {
  if (!value || value.length > 500) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { i?: unknown; e?: unknown };
    if (typeof data.i !== "string" || typeof data.e !== "number" || data.e < Date.now()) return null;
    return findActiveInviteById(data.i);
  } catch {
    return null;
  }
}

/** Läser och verifierar sessionen från inkommande cookies (server components och route handlers). */
export async function getSessionInvite(): Promise<Invite | null> {
  const store = await cookies();
  return verifySessionValue(store.get(SESSION_COOKIE)?.value);
}
