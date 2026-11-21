import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { runAgent, type ChatTurn } from "@/lib/agent";
import { getConfig } from "@/lib/config";
import { checkLimits, recordTokens } from "@/lib/limits";
import { getSessionInvite } from "@/lib/session";
import { BadRequest, clientKey, isSameOrigin, json, readJson } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const Turn = z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(8000) });
const Body = z.object({
  question: z.string().trim().min(1),
  history: z.array(Turn).max(40).default([]),
});

/** Historiken kommer från webbläsaren, så den städas: bara text, rätt turordning, begränsad längd. */
function sanitizeHistory(history: ChatTurn[], max: number): ChatTurn[] | null {
  const recent = history.slice(-max);
  if (recent.length && recent[0]?.role !== "user") recent.shift();
  for (let i = 0; i < recent.length; i++) {
    if (recent[i]?.role !== (i % 2 === 0 ? "user" : "assistant")) return null;
  }
  return recent.length % 2 === 0 ? recent : null; // måste sluta med ett assistentsvar
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "Otillåten källa" }, 403);

  const invite = await getSessionInvite();
  if (!invite) return json({ error: "Din inbjudan är ogiltig eller har gått ut." }, 401);

  const { agent } = getConfig();
  let question: string;
  let history: ChatTurn[];
  try {
    const parsed = Body.safeParse(await readJson(req, 120_000));
    if (!parsed.success) return json({ error: "Ogiltig förfrågan" }, 400);
    if (parsed.data.question.length > agent.maxMessageLength) {
      return json({ error: `Frågan får vara max ${agent.maxMessageLength} tecken.` }, 400);
    }
    const clean = sanitizeHistory(parsed.data.history, agent.maxHistory);
    if (!clean) return json({ error: "Konversationen gick inte att läsa. Starta en ny." }, 400);
    question = parsed.data.question;
    history = clean;
  } catch (err) {
    if (err instanceof BadRequest) return json({ error: err.message }, 400);
    throw err;
  }

  const limit = await checkLimits(invite, clientKey(req));
  if (!limit.ok) return json({ error: limit.message }, limit.status);

  try {
    const { reply, toolsUsed } = await runAgent(history, question, recordTokens);
    // Loggar VEM (inbjudan) och HUR MYCKET, aldrig själva frågan.
    console.log(`[fråga] inbjudan=${invite.id} nr=${limit.questionNumber} verktyg=${toolsUsed.join(",") || "-"}`);
    return json({ reply, toolsUsed });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error(`[claude] ${err.status ?? ""} ${err.message}`);
    } else {
      console.error("[chat]", err instanceof Error ? err.message : err);
    }
    return json({ error: "Assistenten är inte tillgänglig just nu. Försök igen om en stund." }, 503);
  }
}
