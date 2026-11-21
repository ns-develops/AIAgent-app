import "server-only";
import { z } from "zod";

// All konfiguration läses och valideras här, BARA på servern ("server-only" gör att
// bygget misslyckas om någon råkar importera den här filen i webbläsarkod).

const InviteSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{1,40}$/),
  label: z.string().max(100),
  hash: z.string().regex(/^[a-f0-9]{64}$/),
  expires: z.string(), // ISO-datum, t.ex. 2026-12-31
  maxQuestions: z.number().int().positive().optional(),
  admin: z.boolean().optional(),
});
export type Invite = z.infer<typeof InviteSchema>;

function int(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export type AppConfig = ReturnType<typeof load>;

function load() {
  const apiKey = process.env.ANTHROPIC_API_KEY ?? "";
  const sessionSecret = process.env.SESSION_SECRET ?? "";
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY saknas");
  if (sessionSecret.length < 32) throw new Error("SESSION_SECRET saknas eller är för kort (minst 32 tecken)");

  let invites: Invite[] = [];
  try {
    invites = z.array(InviteSchema).parse(JSON.parse(process.env.INVITES || "[]"));
  } catch {
    throw new Error("INVITES har fel format. Använd raderna från npm run invite.");
  }

  return {
    apiKey,
    sessionSecret,
    model: process.env.MODEL || "claude-haiku-5-5",
    invites,
    basePath: process.env.BASE_PATH || "",
    isProd: process.env.NODE_ENV === "production",
    upstash:
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
        ? { url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN }
        : null,
    limits: {
      perIpPerMinute: int("LIMIT_PER_IP_PER_MINUTE", 10),
      perInvitePerDay: int("LIMIT_PER_INVITE_PER_DAY", 30),
      adminPerDay: int("LIMIT_ADMIN_PER_DAY", 100),
      globalPerDay: int("LIMIT_GLOBAL_PER_DAY", 200),
      monthlyTokenBudget: int("MONTHLY_TOKEN_BUDGET", 2_000_000),
      defaultMaxQuestionsPerInvite: 100,
    },
    agent: {
      maxSteps: 6, // max varv i agentloopen per fråga
      maxTokens: 1024, // max längd på varje svar
      maxMessageLength: 1000, // max tecken i en fråga
      maxHistory: 20, // max tidigare meddelanden som skickas med
    },
    sessionDays: 7,
  };
}

let cached: AppConfig | null = null;
export function getConfig(): AppConfig {
  cached ??= load();
  return cached;
}
