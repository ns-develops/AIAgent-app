import type { Project } from "./types";

// Projekten är hämtade från dina publika GitHub-repos (beskrivningar, taggar och,
// för några, README och kod). Fyll i "story" för dina viktigaste projekt.
export const projects: Project[] = [
  // ── iOS / Swift ─────────────────────────────────────────
  {
    name: "RealMatch-app",
    owner: "ns-develops",
    category: "ios",
    featured: true,
    summary:
      "Examensarbete: en app för att skapa genuina kontakter mellan människor i stället för ändlöst scrollande och ytliga samtal.",
    tech: ["Swift", "Firebase Auth", "Firebase Database", "Firebase Storage"],
    highlights: ["Matchningsalgoritm", "Chattfunktion", "Examensarbete (degree project)"],
    story: {},
  },
  {
    name: "HealthMealTracker-app",
    owner: "ns-develops",
    category: "ios",
    featured: true,
    summary:
      "Loggar måltider och räknar ut vitamininnehåll, med statistik och rekommendationer om vilka näringsämnen man bör fokusera på. Data lagras per användare.",
    tech: ["Swift", "SwiftUI", "Firebase Authentication", "Firebase Database"],
    highlights: ["Fullstack med användarbaserad backend", "Pågående projekt"],
    story: {},
  },
  {
    name: "First-AI-Powered-app",
    owner: "ns-develops",
    category: "ios",
    summary: "iOS-app som genererar intelligenta svar i realtid med OpenAI:s GPT-4o-mini.",
    tech: ["Swift", "OpenAI API (GPT-4o-mini)"],
  },
  {
    name: "Journal-app",
    owner: "ns-develops",
    category: "ios",
    summary: "Dagboksapp för att följa personlig utveckling och dagliga tankar, med anteckningar sparade per datum.",
    tech: ["Swift", "SwiftUI", "MVVM"],
  },
  {
    name: "DinnerMate-app",
    owner: "ns-develops",
    category: "ios",
    summary:
      "Virtuell receptbok med slumpade personliga förslag och möjlighet att få förslag utifrån ingredienser man har hemma.",
    tech: ["Swift", "SwiftUI", "MVVM"],
  },
  {
    name: "ChessTimer-app",
    owner: "ns-develops",
    category: "ios",
    summary: "Schackklocka med rymdtema, fyra vanliga tidskontroller och spelarnamn.",
    tech: ["Swift", "SwiftUI", "UIKit", "AVFoundation"],
  },
  {
    name: "MapSwiftUI",
    owner: "ns-develops",
    category: "ios",
    summary: "Karta med egna pins (annotations) där användaren kan lägga till en pin på sin nuvarande position.",
    tech: ["Swift", "SwiftUI", "MapKit", "Location services"],
  },
  {
    name: "CoreData-frame-SQLite",
    owner: "ns-develops",
    category: "ios",
    summary: "Övningsprojekt med Core Data: datamodellering, persistens och optimerade hämtningar med SQLite.",
    tech: ["Swift", "SwiftUI", "Core Data", "SQLite"],
  },
  {
    name: "SpeedWriter",
    owner: "nasa01-crypto",
    category: "ios",
    summary: "Snabbskrivningsspel på svenska och engelska för att träna språkkunskaper.",
    tech: ["Swift"],
  },

  // ── Android ─────────────────────────────────────────────
  {
    name: "RecycleView-app",
    owner: "nasa01-crypto",
    category: "android",
    summary: "Lista med namn och id i RecyclerView, kopplad till Firebase.",
    tech: ["Kotlin", "Android", "Firebase"],
  },
  {
    name: "BarbieCardgame-app",
    owner: "nasa01-crypto",
    category: "android",
    summary: "Kortspel för två spelare där den med högst kort får poäng.",
    tech: ["Kotlin", "Android"],
  },
  {
    name: "TicTacToegame-app",
    owner: "nasa01-crypto",
    category: "android",
    summary: "Luffarschack med lekfulla färger.",
    tech: ["Java", "Android"],
  },

  // ── React Native ────────────────────────────────────────
  {
    name: "Quotes-app",
    owner: "ns-develops",
    category: "react-native",
    summary: "Daglig källa till motivation med utvalda citat, affirmationer och reflektioner från ett öppet API.",
    tech: ["React Native", "Expo", "EAS Updates"],
  },
  {
    name: "Expo-setUp",
    owner: "ns-develops",
    category: "react-native",
    summary: "Grundsetup för React Native med Expo och QR-kod för testning.",
    tech: ["React Native", "Expo", "TypeScript"],
  },

  // ── Fullstack-webb ──────────────────────────────────────
  {
    name: "E-Commerce-web-Next.js",
    owner: "ns-develops",
    category: "fullstack-web",
    featured: true,
    summary: "Webbshop för hållbara kläder och produkter med betalning via Stripe.",
    tech: ["TypeScript", "Next.js (App Router)", "Tailwind CSS", "shadcn/ui", "Stripe Checkout", "Zustand", "Vercel"],
    highlights: [
      "Betalningssessioner skapas på servern med Next.js Server Actions",
      "Typad varukorg med Zustand och persist-middleware (egna TypeScript-interfaces)",
      "Stripe i testläge, deployad på Vercel, helt responsiv, CI/CD-pipeline",
    ],
    liveUrl: "https://e-commerce-web-next-js-36sp.vercel.app",
    story: {},
  },
  {
    name: "Booking-system",
    owner: "ns-develops",
    category: "fullstack-web",
    featured: true,
    summary:
      "Modernt bokningssystem för frisörer och barberare där kunder kan välja tjänst, datum och tid.",
    tech: ["JavaScript", "Node.js", "Express", "REST API"],
    story: {},
  },
  {
    name: "Dogcareweb-app-new",
    owner: "ns-develops",
    category: "fullstack-web",
    featured: true,
    summary:
      "Incheckningssystem för hunddagis med adminpanel: se alla hundar, vilka som är på plats och tidigare hundar.",
    tech: ["JavaScript", "REST API", "Axios"],
    highlights: ["Adminpanel", "CRUD mot API"],
    story: {},
  },
  {
    name: "Maintenance-app",
    owner: "ns-develops",
    category: "fullstack-web",
    summary: "App för att rapportera, hantera och följa upp underhållsärenden.",
    tech: ["JavaScript", "Node.js", "Express"],
  },
  {
    name: "TaskManager-Node.js",
    owner: "ns-develops",
    category: "fullstack-web",
    summary: "Fullstack att göra-app med REST-API.",
    tech: ["Node.js", "Express", "MongoDB", "HTML5", "MERN"],
  },
  {
    name: "Dashboard-Next.js-15-Shadcn-TypeScript",
    owner: "ns-develops",
    category: "frontend-web",
    summary: "Dashboard med mörkt/ljust läge och färgteman för diagrammen.",
    tech: ["TypeScript", "Next.js 15", "shadcn/ui", "Tailwind CSS", "next-themes", "Vercel"],
  },
  {
    name: "Weather-app-Angular",
    owner: "ns-develops",
    category: "frontend-web",
    summary: "Väderapp där man söker på en stad och ser aktuellt väder via Open-Meteo-API:t.",
    tech: ["TypeScript", "Angular", "HTML", "CSS", "Open-Meteo API"],
  },
  {
    name: "Firstproject-GraphQL",
    owner: "ns-develops",
    category: "fullstack-web",
    summary: "Enkel app med CRUD-operationer via GraphQL på en Node-server.",
    tech: ["Node.js", "GraphQL", "Apollo Client"],
  },

  // ── Backend / DevOps ────────────────────────────────────
  {
    name: "Notes-endpoints-backend",
    owner: "nasa01-crypto",
    category: "backend",
    featured: true,
    summary: "Serverlös backend för en anteckningsapp på AWS.",
    tech: ["JavaScript", "AWS Lambda", "Serverless Framework"],
    highlights: [
      "CRUD-endpoints för anteckningar",
      "Registrering och inloggning som returnerar en JWT-token; skyddade endpoints kräver Bearer-token",
      "Eget middleware-lager för autentisering och behörighet",
      "Hanterar HTTP-statuskoder (200, 201, 400, 401, 404, 409, 500); testad i Postman/Insomnia",
      "Byggd i december 2024",
    ],
    story: {},
  },
  {
    name: "Docker-setUp",
    owner: "ns-develops",
    category: "devops",
    summary: "Docker-miljö med Node.js-server, portkonfiguration, docker-compose, Express och MongoDB.",
    tech: ["Docker", "docker-compose", "Node.js", "Express", "MongoDB"],
  },

  // ── Övrigt ──────────────────────────────────────────────
  {
    name: "First-app-PHP",
    owner: "ns-develops",
    category: "other",
    summary: "Applikation byggd med PHP och Laravel.",
    tech: ["PHP", "Laravel"],
  },
  {
    name: "Agency-web",
    owner: "ns-develops",
    category: "frontend-web",
    summary: "Webbplats för en digital byrå, Natalies första webbplats.",
    tech: ["HTML", "CSS"],
    highlights: ["Responsiv", "Kontaktformulär", "Routing"],
  },
  {
    name: "Portfolio-ns-dev.tech",
    owner: "ns-develops",
    category: "frontend-web",
    summary: "Natalies portfoliosida ns-dev.tech.",
    tech: ["JavaScript"],
    liveUrl: "https://ns-dev.tech",
  },
  {
    name: "Portfolio-CV",
    owner: "ns-develops",
    category: "frontend-web",
    summary: "CV-sida.",
    tech: ["TypeScript"],
  },
];
