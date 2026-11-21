"use client";

import { Fragment, useEffect, useRef, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const MAX_LENGTH = 1000;

type Message = { role: "user" | "assistant"; content: string; tools?: string[] } | { role: "error"; content: string };

const SUGGESTIONS = [
  "Vilka är Natalies viktigaste projekt?",
  "Vad kan hon om TypeScript?",
  "Har hon erfarenhet av AWS?",
  "Tell me about her background",
];

const TOOL_LABELS: Record<string, string> = {
  list_projects: "projektlistan",
  get_project: "projektdetaljer",
  find_projects_by_technology: "teknikerna",
  get_profile: "profilen",
  get_github_repos: "GitHub",
  get_repo_readme: "README",
};

/**
 * Visar svaret med enkel formatering: **fetstil**, [länktext](https://...) och vanliga https-länkar.
 * React escapar all text, så ingen HTML kan smygas in. Bara https-länkar blir klickbara.
 */
function Linkified({ text }: { text: string }) {
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\(https:\/\/[^\s)]+\)|https:\/\/[^\s)<>\]]+)/g;
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) => {
        const bold = /^\*\*([^*]+)\*\*$/.exec(part);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        const md = /^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/.exec(part);
        if (md) {
          return (
            <a key={i} href={md[2]} target="_blank" rel="noopener noreferrer">
              {md[1]}
            </a>
          );
        }
        if (/^https:\/\//.test(part)) {
          return (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer">
              {part.replace(/^https:\/\//, "")}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // OBS: måste vara i måsvingar. Nyare webbläsare returnerar ett Promise från scrollIntoView,
  // och om effekten returnerar något annat än en funktion kraschar React.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    // Bara riktiga frågor och svar skickas med som historik (inte felmeddelanden)
    const history = messages
      .filter((m): m is Extract<Message, { role: "user" | "assistant" }> => m.role !== "error")
      .map(({ role, content }) => ({ role, content }));
    // Historiken måste sluta med ett svar; ta bort en obesvarad fråga om det finns en
    if (history.at(-1)?.role === "user") history.pop();

    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch(`${BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; toolsUsed?: string[]; error?: string };
      if (res.status === 401) {
        window.location.reload(); // sessionen har gått ut → tillbaka till inbjudningssidan
        return;
      }
      if (!res.ok || !data.reply) throw new Error(data.error ?? "Något gick fel");
      setMessages((m) => [...m, { role: "assistant", content: data.reply!, tools: data.toolsUsed }]);
    } catch (err) {
      setMessages((m) => [
        ...m.filter((x, i) => !(i === m.length - 1 && x.role === "user" && x.content === q)),
        { role: "error", content: err instanceof Error ? err.message : "Något gick fel" },
      ]);
      setInput(q);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch(`${BASE}/api/auth`, { method: "DELETE" }).catch(() => {});
    window.location.reload();
  }

  return (
    <section className="chat">
      <header>
        <div>
          <h1>Natalie Samaan</h1>
          <p className="muted">AI-assistent · Fråga om projekt, kunskaper och hur hon byggt dem</p>
        </div>
        <button className="ghost" onClick={logout} type="button">Logga ut</button>
      </header>

      <div className="messages" aria-live="polite">
        {messages.length === 0 && (
          <div className="welcome">
            <p>Hej! Jag kan berätta om Natalies projekt, tekniska kunskaper och bakgrund. Ställ en fråga, på svenska eller engelska.</p>
            <div className="chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => void ask(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <Linkified text={m.content} />
            {m.role === "assistant" && m.tools && m.tools.length > 0 && (
              <small>Hämtade: {[...new Set(m.tools)].map((t) => TOOL_LABELS[t] ?? t).join(", ")}</small>
            )}
          </div>
        ))}
        {busy && <div className="msg assistant pending">Tänker…</div>}
        <div ref={endRef} />
      </div>

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void ask(input);
            }
          }}
          placeholder="Skriv en fråga…"
          rows={2}
          maxLength={MAX_LENGTH}
          aria-label="Din fråga"
        />
        <button type="submit" disabled={busy || !input.trim()}>Skicka</button>
      </form>
      <p className="disclaimer muted">Svaren genereras av AI utifrån Natalies projekt och kan innehålla fel. Kontakta henne gärna direkt.</p>
    </section>
  );
}
