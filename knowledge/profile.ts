import type { Profile } from "./types";

// Fakta om dig. Kontrollera allt och fyll i de tomma fälten.
// Allt här kan visas för rekryterare, så skriv bara det du vill dela.
export const profile: Profile = {
  name: "Natalie Samaan",
  title: "Mobilapp- och webbutvecklare",
  location: "Sverige",
  summary:
    "App- och webbutvecklare med fokus på mobilappar (iOS/Swift) och fullstack-webb (TypeScript, React, Next.js, Node.js). Brinner för design, problemlösning och att skapa användarvänliga applikationer som löser verkliga behov. Har 17 års erfarenhet från hotellbranschen innan bytet till utveckling.",
  about:
    "Det började med min passion för programmering år 2020, vilket så småningom ledde till att jag tog en universitetsexamen som app- och webbutvecklare. Jag har arbetat med fullständiga applikationer med moderna tekniker som TypeScript och Node.js. Jag brinner för design, problemlösning och att skapa användarvänliga applikationer som löser verkliga behov. En stor del av min tid lägger jag på att lära mig nya tekniker, är nyfiken på att bidra till open source-projekt och utforskar kreativa lösningar på komplexa problem.",
  background: [
    "Arbetade 17 år i hotellbranschen (2008–2025), senast som Operations Manager.",
    "Passionen för programmering började 2020 och ledde så småningom till en examen som app- och webbutvecklare.",
    "Har byggt fullständiga applikationer (fullstack) med moderna tekniker som TypeScript och Node.js.",
  ],
  education: ["Examen som app- och webbutvecklare, Folkuniversitet via Göteborgs universitet (2023–2026)"],
  skills: {
    "Mobil": ["Swift", "SwiftUI", "UIKit", "Core Data", "MapKit", "React Native", "Expo", "Kotlin", "Java (Android)"],
    "Frontend": ["JavaScript", "TypeScript", "React", "Next.js", "Angular", "Tailwind CSS", "shadcn/ui"],
    "Backend": ["Node.js", "Express", "REST-API:er", "GraphQL", "PHP/Laravel"],
    "Databaser och moln": ["MongoDB", "Firebase", "Supabase", "AWS (Lambda)", "Vercel"],
    "Verktyg och arbetssätt": ["Git", "CI/CD", "Docker", "Scrum", "Kanban"],
  },
  languages: ["Svenska (modersmål)", "Arabiska (modersmål)", "Engelska (professionell nivå)"],
  links: {
    github: ["https://github.com/ns-develops", "https://github.com/nasa01-crypto (tidigare konto)"],
    portfolio: "https://ns-dev.tech",
  },
  contact: { email: "natalie.samaan@live.se" },
  jobSearch: {
    lookingFor: "", // t.ex. "Junior iOS- eller fullstackutvecklare"
    workMode: "", // t.ex. "Göteborg, hybrid eller distans"
    availableFrom: "", // t.ex. "Omgående"
  },
  softSkills: [
    "Brinner för design och användarvänlighet",
    "Problemlösning: gillar att utforska kreativa lösningar på komplexa problem",
    "Nyfiken och lär sig gärna nya tekniker; lägger mycket tid på att utvecklas",
    "Nyfiken på att bidra till open source-projekt",
  ],
};
