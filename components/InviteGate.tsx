"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function InviteGate() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");
  const [error, setError] = useState("");

  async function unlock(value: string) {
    setStatus("checking");
    setError("");
    try {
      const res = await fetch(`${BASE}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: value.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Något gick fel");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Något gick fel");
    }
  }

  // Länkar har formen ?invite=KOD. Koden tas bort ur adressfältet direkt
  // så att den inte sparas i historiken eller råkar delas vidare.
  useEffect(() => {
    const url = new URL(window.location.href);
    const fromLink = url.searchParams.get("invite");
    if (fromLink) {
      url.searchParams.delete("invite");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      void unlock(fromLink);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="gate">
      <h1>Natalie Samaan</h1>
      <p className="lead">AI-assistent för rekryterare</p>
      <p className="muted">Den här sidan kräver en personlig inbjudan. / This page requires a personal invitation.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) void unlock(code);
        }}
      >
        <label htmlFor="code">Inbjudningskod</label>
        <input
          id="code"
          type="password"
          autoComplete="off"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={128}
        />
        <button type="submit" disabled={status === "checking"}>
          {status === "checking" ? "Kontrollerar…" : "Öppna"}
        </button>
      </form>
      {status === "error" && <p className="error">{error}</p>}
    </section>
  );
}
