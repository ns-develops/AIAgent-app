import type { Profile } from "./types";

// Fakta om dig. Kontrollera allt och fyll i de tomma fälten.
// Allt här kan visas för rekryterare, så skriv bara det du vill dela.
export const profile: Profile = {
  name: "Natalie Samaan",
  title: "Mobilapp- och webbutvecklare",
  location: "Sverige",
  summary:
    "Utvecklare med fokus på mobilappar (iOS/Swift) och fullstack-webb (React, Next.js, Node.js), med 17 års erfarenhet från hotellbranschen innan bytet till utveckling.",
  background: [
    "Arbetade 17 år i hotellbranschen (2008–2025), senast som Operations Manager.",
    "Började programmera 2020 och bytte därefter karriär till mjukvaruutveckling.",
  ],
  education: ["Mobilapputvecklare, Folkuniversitet via Göteborgs universitet (2023–2026)"],
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
  softSkills: [], // t.ex. "Ledarskap från rollen som Operations Manager"
};
