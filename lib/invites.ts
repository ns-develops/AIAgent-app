import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { getConfig, type Invite } from "./config";

// Koderna sparas BARA som SHA-256-hashar i miljövariabeln INVITES.
// Även om någon ser dina inställningar kan de inte återskapa koderna.

export function hashCode(code: string): string {
  return createHash("sha256").update(code, "utf8").digest("hex");
}

function isExpired(invite: Invite, now = Date.now()): boolean {
  const end = Date.parse(invite.expires.length === 10 ? `${invite.expires}T23:59:59Z` : invite.expires);
  return !Number.isFinite(end) || end < now;
}

export function inviteExpiresAt(invite: Invite): number {
  return Date.parse(invite.expires.length === 10 ? `${invite.expires}T23:59:59Z` : invite.expires);
}

/** Hittar en giltig inbjudan för en kod. Jämför alla hashar i konstant tid. */
export function findInviteByCode(code: string): Invite | null {
  if (typeof code !== "string" || code.length < 16 || code.length > 128) return null;
  const candidate = Buffer.from(hashCode(code), "hex");
  let match: Invite | null = null;
  for (const invite of getConfig().invites) {
    const stored = Buffer.from(invite.hash, "hex");
    if (stored.length === candidate.length && timingSafeEqual(stored, candidate)) match = invite;
  }
  return match && !isExpired(match) ? match : null;
}

/** Används vid varje anrop: finns inbjudan kvar och är den giltig? (så att spärr slår igenom direkt) */
export function findActiveInviteById(id: string): Invite | null {
  const invite = getConfig().invites.find((i) => i.id === id) ?? null;
  return invite && !isExpired(invite) ? invite : null;
}
