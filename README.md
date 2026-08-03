# BERRACO Shop

Dark drop-shop for **berraco.de** — Layout wie Mockup (Arc-Carousel, DROP 001 EMOTIONS).

Live: https://berraco-cursor.vercel.app

## Start

```bash
npm install
npm run dev
```

→ http://localhost:3000

## Neues Shirt / Shirtigo-Bilder

Alles in [`src/data/collections.ts`](src/data/collections.ts).

1. Produkt bei **Shirtigo** anlegen (Heavyweight Tee + Emboss/Stick).
2. Produktfoto exportieren → nach `public/products/` legen  
   **oder** Shirtigo-Bild-URL nutzen.
3. Eintrag setzen:

```ts
tee({
  id: "emotions-love",
  name: "LOVE",
  emotion: "Love",
  embroidery: "LOVE",
  basePrice: 89,
  color: "#0c0c0c",
  accent: "#9b1b2e",
  description: "Black heavyweight. Deep red emboss.",
  image: "/products/tee-love.png", // ← hier Shirtigo-URL einsetzen
  sku: "BER-001-LOVE",
  shirtigoProductId: "…", // später für API
}),
```

Ohne `image` zeigt der Shop einen Farb-Fallback mit Stick-Text.

## Drops & Staffel

- Linke Dots = Drops (DROP 001, DROP 002, …)
- `age: 0` = voller Preis, `1` = −5 %, `2` = −10 %, … max −20 %

## Stack

- Next.js + Tailwind + Framer Motion
- Warenkorb-Mock (Checkout später / Stripe)
- WordPress auf all-inkl bleibt unberührt
