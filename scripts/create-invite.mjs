#!/usr/bin/env node
// Skapar en personlig inbjudningskod.
// Användning:  npm run invite -- "Anna, Volvo" 30          (giltig i 30 dagar)
//              npm run invite -- "Natalie" 365 --admin     (din egen testkod)
//              npm run invite -- "Erik, Spotify" 14 --max 50
//
// Koden visas BARA här, en gång. I .env sparas bara en hash av den.
import { randomBytes, createHash } from "node:crypto";

for (const f of [".env.local", ".env"]) { try { process.loadEnvFile(f); } catch { /* filen finns inte */ } }

const args = process.argv.slice(2);
const label = args[0];
const days = Number(args[1] ?? 30);
const admin = args.includes("--admin");
const maxIndex = args.indexOf("--max");
const maxQuestions = maxIndex >= 0 ? Number(args[maxIndex + 1]) : undefined;

if (!label || !Number.isFinite(days) || days <= 0) {
  console.error('Användning: npm run invite -- "Namn, Företag" <antal dagar> [--max <frågor>] [--admin]');
  process.exit(1);
}

const slug = label.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 28) || "inbjudan";
const id = `${slug}-${randomBytes(3).toString("hex")}`;
const code = randomBytes(24).toString("base64url"); // 192 bitar slump
const hash = createHash("sha256").update(code, "utf8").digest("hex");
const expires = new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

const entry = { id, label: label.slice(0, 100), hash, expires };
if (maxQuestions) entry.maxQuestions = maxQuestions;
if (admin) entry.admin = true;

const site = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const base = (process.env.BASE_PATH || "").replace(/\/$/, "");

console.log("\n1) Lägg till den här raden i INVITES-listan (i .env.local och på Vercel):\n");
console.log(JSON.stringify(entry));
console.log("\n2) Skicka den här länken till mottagaren (visas bara nu):\n");
console.log(`${site}${base}/?invite=${code}`);
console.log(`\nGiltig till och med ${expires}. Spärra genom att ta bort raden ur INVITES.\n`);
