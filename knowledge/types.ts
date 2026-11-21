export type Category = "ios" | "android" | "react-native" | "fullstack-web" | "frontend-web" | "backend" | "devops" | "other";

export interface Project {
  /** Repots namn, används som id */
  name: string;
  /** GitHub-konto som äger repot */
  owner: "ns-develops" | "nasa01-crypto";
  category: Category;
  /** Visas först och lyfts fram av assistenten */
  featured?: boolean;
  summary: string;
  tech: string[];
  /** Fakta som är bekräftade från repot (README, kod, taggar) */
  highlights?: string[];
  liveUrl?: string;
  /**
   * DIN berättelse. Fyll i det som inte syns i koden.
   * Tomma fält används aldrig: assistenten hänvisar då till dig i stället för att gissa.
   */
  story?: {
    context?: string; // skolprojekt, examensarbete, eget projekt? själv eller i team?
    why?: string; // varför du byggde det och valde tekniken
    challenges?: string; // svåra problem och hur du löste dem
    learned?: string; // vad du lärde dig / skulle göra annorlunda
  };
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  summary: string;
  background: string[];
  education: string[];
  skills: Record<string, string[]>;
  languages: string[];
  links: { github: string[]; portfolio?: string; linkedin?: string };
  contact: { email?: string };
  /** Fyll i: lämna tomt det du inte vill att assistenten ska säga */
  jobSearch: {
    lookingFor?: string;
    workMode?: string;
    availableFrom?: string;
  };
  softSkills?: string[];
}
