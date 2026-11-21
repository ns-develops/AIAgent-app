import "server-only";
import { getConfig, type Invite } from "./config";
import { getStore } from "./store";

// Kostnadsskydd i flera lager. Varje fråga räknas innan Claude anropas.

export type LimitResult = { ok: true; questionNumber: number } | { ok: false; status: number; message: string };

const day = () => new Date().toISOString().slice(0, 10); // UTC-dygn
const month = () => new Date().toISOString().slice(0, 7);
const minute = () => Math.floor(Date.now() / 60_000);

export async function checkLimits(invite: Invite, clientKey: string): Promise<LimitResult> {
  const { limits } = getConfig();
  const store = getStore();

  // 1) Per IP och minut (mot spam och botar)
  const perMinute = await store.incr(`rl:ip:${clientKey}:${minute()}`, 1, 120);
  if (perMinute > limits.perIpPerMinute) {
    return { ok: false, status: 429, message: "Du skickar frågor lite för snabbt. Vänta en minut." };
  }

  // 2) Månadsbudget i tokens för hela appen
  const usedTokens = await store.get(`budget:tokens:${month()}`);
  if (usedTokens >= limits.monthlyTokenBudget) {
    return { ok: false, status: 503, message: "Assistenten är pausad för den här månaden. Kontakta Natalie direkt." };
  }

  // 3) Totalt per dygn för alla användare
  const global = await store.incr(`g:day:${day()}`, 1, 2 * 86_400);
  if (global > limits.globalPerDay) {
    return { ok: false, status: 503, message: "Assistenten har nått dagens gräns. Försök igen i morgon." };
  }

  // 4) Per inbjudan och dygn (högre gräns för admin)
  const dailyLimit = invite.admin ? limits.adminPerDay : limits.perInvitePerDay;
  const perDay = await store.incr(`inv:${invite.id}:day:${day()}`, 1, 2 * 86_400);
  if (perDay > dailyLimit) {
    return { ok: false, status: 429, message: "Du har nått dagens antal frågor. Välkommen tillbaka i morgon!" };
  }

  // 5) Totalt per inbjudan
  const total = await store.incr(`inv:${invite.id}:total`, 1, 400 * 86_400);
  const max = invite.admin ? Infinity : invite.maxQuestions ?? limits.defaultMaxQuestionsPerInvite;
  if (total > max) {
    return { ok: false, status: 429, message: "Din inbjudan har använt alla sina frågor. Kontakta Natalie för en ny." };
  }

  return { ok: true, questionNumber: total };
}

export async function recordTokens(tokens: number): Promise<void> {
  if (tokens > 0) await getStore().incr(`budget:tokens:${month()}`, Math.ceil(tokens), 40 * 86_400);
}
