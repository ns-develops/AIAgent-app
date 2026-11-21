import "server-only";
import { getConfig } from "./config";

// Räknare för gränser och budget. Upstash Redis i produktion, minnet lokalt.
export interface CounterStore {
  incr(key: string, by: number, ttlSeconds: number): Promise<number>;
  get(key: string): Promise<number>;
}

class MemoryStore implements CounterStore {
  private data = new Map<string, { value: number; expiresAt: number }>();

  async incr(key: string, by: number, ttlSeconds: number) {
    const now = Date.now();
    const entry = this.data.get(key);
    const value = (entry && entry.expiresAt > now ? entry.value : 0) + by;
    this.data.set(key, { value, expiresAt: now + ttlSeconds * 1000 });
    if (this.data.size > 10_000) this.prune(now);
    return value;
  }

  async get(key: string) {
    const entry = this.data.get(key);
    return entry && entry.expiresAt > Date.now() ? entry.value : 0;
  }

  private prune(now: number) {
    for (const [k, v] of this.data) if (v.expiresAt <= now) this.data.delete(k);
  }
}

class UpstashStore implements CounterStore {
  constructor(private url: string, private token: string) {}

  private async pipeline(commands: (string | number)[][]): Promise<{ result?: unknown; error?: string }[]> {
    const res = await fetch(`${this.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`Upstash svarade ${res.status}`);
    return res.json();
  }

  async incr(key: string, by: number, ttlSeconds: number) {
    // Nycklarna innehåller tidsfönstret (minut/dag/månad), så EXPIRE varje gång är ofarligt.
    const [incr] = await this.pipeline([
      ["INCRBY", key, by],
      ["EXPIRE", key, ttlSeconds],
    ]);
    return Number(incr?.result ?? 0);
  }

  async get(key: string) {
    const [get] = await this.pipeline([["GET", key]]);
    return Number(get?.result ?? 0);
  }
}

let store: CounterStore | null = null;
export function getStore(): CounterStore {
  if (!store) {
    const { upstash, isProd } = getConfig();
    if (upstash) store = new UpstashStore(upstash.url, upstash.token);
    else {
      if (isProd) console.warn("[varning] Ingen Upstash konfigurerad: gränser räknas bara i minnet.");
      store = new MemoryStore();
    }
  }
  return store;
}
