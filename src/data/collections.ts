/**
 * Produkte ohne WooCommerce.
 *
 * Shirtigo: fertige Produktfotos unter `image` eintragen
 * (z.B. "/products/tee-love.png" oder später Shirtigo-CDN-URL).
 *
 * Neues Shirt: tee({ ... }) in products[] kopieren.
 */

export type Product = {
  id: string;
  name: string;
  /** Untertitel, z.B. HEAVYWEIGHT TEE */
  subtitle: string;
  emotion: string;
  embroidery: string;
  basePrice: number;
  /** Fallback-Farbe falls kein Bild */
  color: string;
  accent: string;
  description: string;
  /** Lokal /public oder Shirtigo-Bild-URL */
  image?: string;
  sku?: string;
  /** Shirtigo Produkt-ID später */
  shirtigoProductId?: string;
  sizes?: string[];
};

export type Collection = {
  id: string;
  /** z.B. DROP 001 — EMOTIONS */
  label: string;
  name: string;
  tagline: string;
  /** 0 = neueste. Jede Stufe älter = −5% (max −20%). */
  age: number;
  products: Product[];
};

const DEFAULT_SIZES = ["S", "M", "L", "XL"];

export function tee(
  partial: Omit<Product, "sizes" | "subtitle"> & {
    sizes?: string[];
    subtitle?: string;
  },
): Product {
  return {
    subtitle: "HEAVYWEIGHT TEE",
    sizes: DEFAULT_SIZES,
    ...partial,
  };
}

export function getProductSizes(product: Product): string[] {
  return product.sizes?.length ? product.sizes : DEFAULT_SIZES;
}

export const collections: Collection[] = [
  {
    id: "emotions",
    label: "DROP 001 — EMOTIONS",
    name: "Emotions",
    tagline: "Embossed. Center chest. Heavyweight.",
    age: 0,
    products: [
      tee({
        id: "emotions-rage",
        name: "RAGE",
        emotion: "Rage",
        embroidery: "RAGE",
        basePrice: 89,
        color: "#1a1a1a",
        accent: "#3a3a3a",
        description: "Boxy heavyweight. Tone-on-tone emboss.",
        image: "/products/tee-rage.png",
        sku: "BER-001-RAGE",
      }),
      tee({
        id: "emotions-hate",
        name: "HATE",
        emotion: "Hate",
        embroidery: "HATE",
        basePrice: 89,
        color: "#d4d0c8",
        accent: "#6a6660",
        description: "Off-white body. Soft embossed mark.",
        image: "/products/tee-hate.png",
        sku: "BER-001-HATE",
      }),
      tee({
        id: "emotions-love",
        name: "LOVE",
        emotion: "Love",
        embroidery: "LOVE",
        basePrice: 89,
        color: "#0c0c0c",
        accent: "#9b1b2e",
        description: "Black heavyweight. Deep red emboss.",
        image: "/products/tee-love.png",
        sku: "BER-001-LOVE",
      }),
      tee({
        id: "emotions-joy",
        name: "JOY",
        emotion: "Joy",
        embroidery: "JOY",
        basePrice: 89,
        color: "#181818",
        accent: "#4a4a4a",
        description: "Charcoal cut. Quiet emboss.",
        image: "/products/tee-joy.png",
        sku: "BER-001-JOY",
      }),
      tee({
        id: "emotions-fear",
        name: "FEAR",
        emotion: "Fear",
        embroidery: "FEAR",
        basePrice: 89,
        color: "#0e0e0e",
        accent: "#3d3d3d",
        description: "Near-black. Shadow emboss.",
        image: "/products/tee-fear.png",
        sku: "BER-001-FEAR",
      }),
    ],
  },
  {
    id: "echo",
    label: "DROP 002 — ECHO",
    name: "Echo",
    tagline: "Coming next. Staffel −5%.",
    age: 1,
    products: [
      tee({
        id: "echo-pulse",
        name: "PULSE",
        emotion: "Pulse",
        embroidery: "PULSE",
        basePrice: 89,
        color: "#161616",
        accent: "#a3a3a3",
        description: "Placeholder until Shirtigo assets land.",
        sku: "BER-002-PULSE",
      }),
      tee({
        id: "echo-static",
        name: "STATIC",
        emotion: "Static",
        embroidery: "STATIC",
        basePrice: 89,
        color: "#2a2a28",
        accent: "#d4d0c8",
        description: "Placeholder until Shirtigo assets land.",
        sku: "BER-002-STATIC",
      }),
      tee({
        id: "echo-drift",
        name: "DRIFT",
        emotion: "Drift",
        embroidery: "DRIFT",
        basePrice: 89,
        color: "#1e2428",
        accent: "#7eb8c9",
        description: "Placeholder until Shirtigo assets land.",
        sku: "BER-002-DRIFT",
      }),
      tee({
        id: "echo-void",
        name: "VOID",
        emotion: "Void",
        embroidery: "VOID",
        basePrice: 89,
        color: "#0e0e0e",
        accent: "#5c5c5c",
        description: "Placeholder until Shirtigo assets land.",
        sku: "BER-002-VOID",
      }),
      tee({
        id: "echo-flare",
        name: "FLARE",
        emotion: "Flare",
        embroidery: "FLARE",
        basePrice: 89,
        color: "#1a1814",
        accent: "#e8b84a",
        description: "Placeholder until Shirtigo assets land.",
        sku: "BER-002-FLARE",
      }),
    ],
  },
];

export function getCollectionById(id: string): Collection | undefined {
  return collections.find((c) => c.id === id);
}
