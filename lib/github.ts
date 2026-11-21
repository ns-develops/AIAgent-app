import "server-only";
import { projects } from "@/knowledge/projects";

// Hämtar BARA publika repos via GitHubs öppna API, utan token.
// Utan token kan appen aldrig se privata repos, och det finns ingen nyckel som kan läcka.

const MAIN_ACCOUNT = "ns-develops";
const ALLOWED_OWNERS = new Set(["ns-develops", "nasa01-crypto"]);
const NAME_RE = /^[A-Za-z0-9._-]{1,100}$/;
const CACHE_MS = 60 * 60 * 1000; // 1 timme: GitHub tillåter ca 60 anrop/timme utan token

export interface PublicRepo {
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  updated: string;
  url: string;
  homepage: string | null;
}

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "ns-dev-recruiter-assistant",
  "X-GitHub-Api-Version": "2022-11-28",
};

let repoCache: { at: number; repos: PublicRepo[] } | null = null;
const readmeCache = new Map<string, { at: number; text: string }>();

async function githubFetch(url: string, accept?: string): Promise<Response> {
  return fetch(url, {
    headers: accept ? { ...headers, Accept: accept } : headers,
    signal: AbortSignal.timeout(8000),
    redirect: "error",
    next: { revalidate: 3600 },
  });
}

export async function getPublicRepos(): Promise<PublicRepo[]> {
  if (repoCache && Date.now() - repoCache.at < CACHE_MS) return repoCache.repos;
  try {
    const res = await githubFetch(`https://api.github.com/users/${MAIN_ACCOUNT}/repos?per_page=100&sort=updated&type=owner`);
    if (!res.ok) throw new Error(`GitHub svarade ${res.status}`);
    const raw = (await res.json()) as Array<Record<string, unknown>>;
    const repos: PublicRepo[] = raw
      .filter((r) => r.private === false && r.fork === false) // dubbelkoll: bara publika, egna repos
      .map((r) => ({
        name: String(r.name),
        description: typeof r.description === "string" ? r.description : null,
        language: typeof r.language === "string" ? r.language : null,
        topics: Array.isArray(r.topics) ? r.topics.filter((t): t is string => typeof t === "string") : [],
        stars: Number(r.stargazers_count) || 0,
        updated: String(r.pushed_at ?? r.updated_at ?? "").slice(0, 10),
        url: String(r.html_url),
        homepage: typeof r.homepage === "string" && r.homepage ? r.homepage : null,
      }));
    repoCache = { at: Date.now(), repos };
    return repos;
  } catch (err) {
    console.error("[github]", err instanceof Error ? err.message : err);
    return repoCache?.repos ?? [];
  }
}

/** Läser README för ett repo som finns i kunskapsbasen eller bland de publika repona. */
export async function getReadme(name: string): Promise<{ owner: string; name: string; text: string } | null> {
  if (!NAME_RE.test(name)) return null;

  const known = projects.find((p) => p.name.toLowerCase() === name.toLowerCase());
  let owner = known?.owner as string | undefined;
  let repoName = known?.name;
  if (!owner) {
    const live = (await getPublicRepos()).find((r) => r.name.toLowerCase() === name.toLowerCase());
    if (!live) return null;
    owner = MAIN_ACCOUNT;
    repoName = live.name;
  }
  if (!owner || !repoName || !ALLOWED_OWNERS.has(owner)) return null;

  const key = `${owner}/${repoName}`;
  const cached = readmeCache.get(key);
  if (cached && Date.now() - cached.at < CACHE_MS) return { owner, name: repoName, text: cached.text };

  const res = await githubFetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/readme`,
    "application/vnd.github.raw+json",
  );
  if (res.status === 404) return { owner, name: repoName, text: "" };
  if (!res.ok) throw new Error(`GitHub svarade ${res.status}`);
  const full = await res.text();
  const text = full.length > 6000 ? `${full.slice(0, 6000)}\n…[avkortad]` : full;
  readmeCache.set(key, { at: Date.now(), text });
  return { owner, name: repoName, text };
}
