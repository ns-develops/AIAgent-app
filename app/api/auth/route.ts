import { NextResponse } from "next/server";
import { z } from "zod";
import { findInviteByCode } from "@/lib/invites";
import { SESSION_COOKIE, cookieOptions, createSessionValue } from "@/lib/session";
import { BadRequest, clientKey, isSameOrigin, json, readJson } from "@/lib/security";
import { getStore } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({ code: z.string().min(1).max(128) });

// Byter en inbjudningskod mot en säker sessionscookie.
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "Otillåten källa" }, 403);

  // Skydd mot att någon gissar koder: max 10 försök per minut per IP
  const attempts = await getStore().incr(`auth:${clientKey(req)}:${Math.floor(Date.now() / 60_000)}`, 1, 120);
  if (attempts > 10) return json({ error: "För många försök. Vänta en minut." }, 429);

  let code: string;
  try {
    const parsed = Body.safeParse(await readJson(req, 2_000));
    if (!parsed.success) return json({ error: "Ogiltig kod" }, 400);
    code = parsed.data.code;
  } catch (err) {
    if (err instanceof BadRequest) return json({ error: err.message }, 400);
    throw err;
  }

  const invite = findInviteByCode(code);
  if (!invite) return json({ error: "Koden är ogiltig eller har gått ut." }, 401);

  console.log(`[inbjudan] ${invite.id} öppnades`);
  const { value, expires } = createSessionValue(invite);
  const res = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  res.cookies.set(SESSION_COOKIE, value, cookieOptions(expires));
  return res;
}

// Logga ut
export async function DELETE(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "Otillåten källa" }, 403);
  const res = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  res.cookies.set(SESSION_COOKIE, "", cookieOptions(new Date(0)));
  return res;
}
