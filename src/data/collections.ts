export type Product = {
  id: string;
  name: string;
  emotion: string;
  embroidery: string;
  basePrice: number;
  color: string;
  accent: string;
  description: string;
};

export type Collection = {
  id: string;
  name: string;
  tagline: string;
  /** 0 = newest release. Each step older adds −5% (max −20%). */
  age: number;
  products: Product[];
};

export const collections: Collection[] = [
  {
    id: "gefuehle",
    name: "Gefühle",
    tagline: "Stickerei mittig. Ein Wort. Kein Filter.",
    age: 0,
    products: [
      {
        id: "gefuehle-hass",
        name: "HASS",
        emotion: "Hass",
        embroidery: "HASS",
        basePrice: 49,
        color: "#1a1212",
        accent: "#c43c3c",
        description: "Schwerer Jersey. Stickerei mittig — scharf und eng gesetzt.",
      },
      {
        id: "gefuehle-liebe",
        name: "LIEBE",
        emotion: "Liebe",
        embroidery: "LIEBE",
        basePrice: 49,
        color: "#f0e6e0",
        accent: "#b84a5a",
        description: "Off-white Body. Stickerei in warmem Rot — nah am Herz.",
      },
      {
        id: "gefuehle-wut",
        name: "WUT",
        emotion: "Wut",
        embroidery: "WUT",
        basePrice: 49,
        color: "#1c1410",
        accent: "#e85d04",
        description: "Dunkler Cut. Orange Stick — spürbar unter den Fingern.",
      },
      {
        id: "gefuehle-glueck",
        name: "GLÜCK",
        emotion: "Glück",
        embroidery: "GLÜCK",
        basePrice: 49,
        color: "#e8e2d4",
        accent: "#c9a227",
        description: "Sandfarben. Goldene Stickerei — ruhig, aber laut.",
      },
      {
        id: "gefuehle-freude",
        name: "FREUDE",
        emotion: "Freude",
        embroidery: "FREUDE",
        basePrice: 49,
        color: "#121a1a",
        accent: "#2dd4bf",
        description: "Near-black. Türkise Stickerei — leichter als es aussieht.",
      },
    ],
  },
  {
    id: "echo",
    name: "Echo",
    tagline: "Zweite Welle. Leiser, aber nicht weg.",
    age: 1,
    products: [
      {
        id: "echo-pulse",
        name: "PULSE",
        emotion: "Pulse",
        embroidery: "PULSE",
        basePrice: 49,
        color: "#161616",
        accent: "#a3a3a3",
        description: "Minimal. Ein Wort, das nachhallt.",
      },
      {
        id: "echo-static",
        name: "STATIC",
        emotion: "Static",
        embroidery: "STATIC",
        basePrice: 49,
        color: "#2a2a28",
        accent: "#d4d0c8",
        description: "Rauschen als Statement — stickiert, nicht gedruckt.",
      },
      {
        id: "echo-drift",
        name: "DRIFT",
        emotion: "Drift",
        embroidery: "DRIFT",
        basePrice: 49,
        color: "#1e2428",
        accent: "#7eb8c9",
        description: "Cooler Ton. Für Tage ohne Plan.",
      },
      {
        id: "echo-void",
        name: "VOID",
        emotion: "Void",
        embroidery: "VOID",
        basePrice: 49,
        color: "#0e0e0e",
        accent: "#5c5c5c",
        description: "Schwarz auf Schwarz. Fast unsichtbar — absichtlich.",
      },
      {
        id: "echo-flare",
        name: "FLARE",
        emotion: "Flare",
        embroidery: "FLARE",
        basePrice: 49,
        color: "#1a1814",
        accent: "#e8b84a",
        description: "Ein kurzer Blitz. Stickerei mit Kante.",
      },
    ],
  },
  {
    id: "origin",
    name: "Origin",
    tagline: "Der erste Drop. Noch da — etwas günstiger.",
    age: 2,
    products: [
      {
        id: "origin-mark",
        name: "MARK",
        emotion: "Mark",
        embroidery: "MARK",
        basePrice: 45,
        color: "#1c1c1c",
        accent: "#e8e4dc",
        description: "Das BERRACO-Zeichen. Wo alles anfing.",
      },
      {
        id: "origin-blank",
        name: "BLANK",
        emotion: "Blank",
        embroidery: "BLANK",
        basePrice: 45,
        color: "#f5f2eb",
        accent: "#1a1a1a",
        description: "Leer genug, um alles zu bedeuten.",
      },
      {
        id: "origin-cord",
        name: "CORD",
        emotion: "Cord",
        embroidery: "CORD",
        basePrice: 45,
        color: "#242018",
        accent: "#c4a574",
        description: "Erdige Palette. Schwerer Griff.",
      },
      {
        id: "origin-ink",
        name: "INK",
        emotion: "Ink",
        embroidery: "INK",
        basePrice: 45,
        color: "#12141a",
        accent: "#6b8cae",
        description: "Nachtblau. Stickerei wie nasse Tinte.",
      },
      {
        id: "origin-raw",
        name: "RAW",
        emotion: "Raw",
        embroidery: "RAW",
        basePrice: 45,
        color: "#cfc8bc",
        accent: "#8b3a2a",
        description: "Roh. Ungefiltert. Stickerei in Rost.",
      },
    ],
  },
];

export function getCollectionById(id: string): Collection | undefined {
  return collections.find((c) => c.id === id);
}
