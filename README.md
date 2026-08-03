# BERRACO Shop-Prototyp

Interaktiver Drop-Shop für **berraco.de** (Meilenstein A).  
Kein WordPress, kein echter Checkout — nur die Shop-Erfahrung lokal im Browser.

## Was du siehst

- Marke **BERRACO**, Shop startet direkt mit Kollektions-Reihen
- T-Shirts fliegen als 3D-Reihe rein; Klick → andere weichen, Detail klappt auf
- Erste Serie **Gefühle**: HASS, LIEBE, WUT, GLÜCK, FREUDE
- Staffel-Rabatt: neueste 0 %, dann −5 %, −10 %, … max. −20 %
- Warenkorb ist ein Mock („Checkout bald“)

## Starten (wie eine Vorschau)

Voraussetzung: [Node.js](https://nodejs.org/) (LTS).

```bash
npm install
npm run dev
```

Dann im Browser: [http://localhost:3000](http://localhost:3000)

## Befehle

| Befehl | Bedeutung |
|--------|-----------|
| `npm run dev` | Lokale Vorschau |
| `npm run build` | Produktions-Build prüfen |
| `npm run start` | Build lokal ausliefern |

## Projektstruktur (kurz)

- `src/data/collections.ts` — Kollektionen & Produkte
- `src/lib/pricing.ts` — Staffel-Rabatt (−5 % bis −20 %)
- `src/components/shop/` — 3D-Reihen, Detail, Warenkorb-Mock

## WordPress / all-inkl

Dein bestehendes WordPress auf **all-inkl** bleibt unberührt.  
Dieser Prototyp läuft erst lokal (später z. B. Vercel). Domain `berraco.de` erst umbiegen, wenn der Shop steht.

## Nächste Schritte (nicht in A)

- Echte Zahlung (Stripe), Größen-Lager, Versand
- Finale 3D-/Stickerei-Assets
- Domain auf den neuen Shop zeigen
