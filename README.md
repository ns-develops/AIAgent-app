# AI-assistent för rekryterare

En AI-assistent som svarar rekryterare på frågor om Natalie Samaans projekt, tekniska kunskaper och hur hon har byggt dem. Den är byggd med **Next.js, TypeScript och Claude API (tool use)**.

Sidan är bara tillgänglig med en **personlig inbjudningslänk**.

---

## Kom igång lokalt

1. **Installera paketen**
   ```bash
   npm install
   ```
2. **Skapa din miljöfil**
   ```bash
   cp .env.example .env.local
   ```
3. **Fyll i `.env.local`**
   - `ANTHROPIC_API_KEY`: skapa en **egen nyckel för den här appen** i [Claude Console](https://platform.claude.com) under Settings → API keys. Klistra aldrig in den någon annanstans.
   - `SESSION_SECRET`: kör `npm run secret` och klistra in resultatet.
4. **Skapa din egen testkod**
   ```bash
   npm run invite -- "Natalie" 365 --admin
   ```
   Lägg JSON-raden i `INVITES=[ ... ]` (allt på en rad, med kommatecken mellan raderna) och spara länken.
5. **Starta**
   ```bash
   npm run dev
   ```
   Öppna länken från steg 4.

## Bjuda in en rekryterare

```bash
npm run invite -- "Anna, Volvo" 30            # giltig i 30 dagar, standard 100 frågor
npm run invite -- "Erik, Spotify" 14 --max 50 # 14 dagar, max 50 frågor
```

- Lägg JSON-raden i `INVITES`, lokalt och på Vercel. Skicka länken till rekryteraren.
- **Koden visas bara en gång.** Appen sparar bara en hash, så den kan inte återskapas.
- **Spärra** en kod genom att ta bort raden ur `INVITES` (på Vercel: spara och gör en ny deploy).
- I loggarna ser du när en inbjudan öppnas och hur många frågor den har ställt, men aldrig själva frågorna.

## Fyll på kunskapsbasen (viktigast!)

Assistenten svarar bara utifrån det som står här. Tomma fält används aldrig, och då hänvisar den till dig i stället för att gissa.

- `knowledge/profile.ts`: kontrollera fakta och fyll i `jobSearch` (vilken roll du söker, ort och distans, när du kan börja) och `softSkills`.
- `knowledge/projects.ts`: fyll i `story` för dina utvalda projekt (`featured: true`):
  - `context`: skolprojekt, examensarbete eller eget? Själv eller i team?
  - `why`: varför du byggde det och valde tekniken
  - `challenges`: ett svårt problem och hur du löste det
  - `learned`: vad du lärde dig eller skulle göra annorlunda

Bra README-filer på GitHub gör också svaren bättre, eftersom assistenten kan läsa dem.

## Hur det fungerar

```
Rekryterare → /api/chat → kontroller (inbjudan, gränser) → Claude
                                     ↑                       │ "jag vill köra get_project"
                                     └── verktyg ←───────────┘
                         (kunskapsbas + publika GitHub-repos, bara läsning)
```

| Fil | Vad den gör |
|---|---|
| `lib/agent.ts` | Agentloopen och systemprompten |
| `lib/tools.ts` | Verktygen assistenten får använda |
| `lib/github.ts` | Publika repos och README-filer från GitHub (utan token) |
| `lib/limits.ts` | Kostnadsskydd |
| `lib/invites.ts`, `lib/session.ts` | Inbjudningskoder och sessioner |
| `knowledge/` | Din kunskapsbas |

## Säkerhet

| Risk | Skydd |
|---|---|
| API-nyckeln läcker | Finns bara i miljövariabler på servern. `server-only` stoppar bygget om serverkod importeras i webbläsaren, och `.env*` ligger i `.gitignore`. |
| Obehöriga använder sidan | Personliga koder (192 bitar slump) som sparas som SHA-256-hashar och jämförs i konstant tid. Max 10 kodförsök per minut och IP. |
| Koden sprids | Koden tas bort ur adressfältet direkt och byts mot en HttpOnly-, Secure- och SameSite=Strict-cookie som är signerad med HMAC. `Referrer-Policy: no-referrer` gör att den inte läcker till länkade sajter. Varje kod har utgångsdatum och kan spärras. |
| Kostnader skenar | Gränser per IP och minut, per kod och dygn, totalt per kod, för hela appen per dygn och en månadsbudget i tokens. Dessutom max 6 steg per fråga, max svarslängd, max frågelängd och Haiku som modell. |
| Prompt injection | Alla verktyg är skrivskyddade. README-text behandlas som data, och assistenten är instruerad att bara svara om Natalie. |
| Privata repos | GitHub anropas utan token, så API:et returnerar bara publika repos. Svaren filtreras dessutom på `private === false`. |
| Falsk historik | Historiken från webbläsaren städas till ren text med rätt turordning och begränsad längd. Verktygsresultat kan inte förfalskas. |
| XSS, clickjacking och CSRF | React escapar all text och bara `https:`-länkar görs klickbara. Content-Security-Policy, `X-Frame-Options: DENY` och Origin-kontroll på alla POST-anrop. |
| Sökmotorer | `robots.txt` blockerar allt, och `noindex` finns både i headers och i metadata. |
| Integritet | IP-adresser hashas och frågor loggas aldrig. |

**Utöver koden, gör det här i Claude Console:** sätt ett **utgiftstak (spend limit)**, använd förbetalda krediter utan automatisk påfyllning och använd en egen API-nyckel för just den här appen.

## Publicera (när du är redo)

1. Lägg upp repot på GitHub. Kontrollera först att `.env.local` **inte** kommer med.
2. Importera projektet på [Vercel](https://vercel.com) och lägg in alla variabler från `.env.example` under Settings → Environment Variables.
3. Skapa en gratis Redis-databas på [Upstash](https://upstash.com) och lägg in `UPSTASH_REDIS_REST_URL` och `UPSTASH_REDIS_REST_TOKEN`. Utan den nollställs räknarna vid omstart och delas inte mellan serverinstanser.
4. **Koppla till ns-dev.tech/aiassistant** (portfolion ligger kvar på Netlify):
   - Sätt `BASE_PATH=/aiassistant` och `SITE_URL=https://ns-dev.tech` i Vercels miljövariabler.
   - Lägg till de här raderna **överst** i filen `_redirects` i portfolioprojektet (i mappen som publiceras, ofta `public/`):
     ```
     /aiassistant    https://DIN-APP.vercel.app/aiassistant         200!
     /aiassistant/*  https://DIN-APP.vercel.app/aiassistant/:splat  200!
     ```
     `200` betyder att Netlify vidarebefordrar anropet utan att adressen ändras. Besökaren ser bara `ns-dev.tech/aiassistant`.
   - Inbjudningslänkar skapas då med `SITE_URL=https://ns-dev.tech BASE_PATH=/aiassistant npm run invite -- "Namn" 30`.
