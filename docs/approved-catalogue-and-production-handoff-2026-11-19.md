# Redneckistan Designs - approved catalogue and production handoff (2026-11-19)

This document records user-supplied decisions. It does not automatically modify existing product flags, artwork or live commerce.

## Dropped concepts
Short "DO NOT LEAVE UNSUPERVISED"; "My Last Nerve"; country duck; black cat; Neon Rave; Cosmic Vibes; Royal Paisley; astronaut space scene.

## One Heart - 18 approved
Mountains (9): Three Sisters; Mount Rundle; Castle Mountain; Mount Assiniboine; Mount Temple; Ten Peaks; Mount Edith Cavell; Yamnuska; Crowsnest Mountain.

Artwear (6): Dimension One; Cosmic Fluidity; Sacred Forest; Stardust Unity; Realms Within; Melting Ruby Heart.

Paisley (3): Teal / Copper / Ivory; Midnight Luxe; Daydream.

Brand treatment: small front ruby heart, large back artwork. Customer selects hoodie style, colour, and mountain. Colours are selectable independently of design.

Tagline (no word cap on either line):
DIFFERENT PEOPLE. ONE HEART.
BRIGHTER WORLD. TOGETHER.

## Order of work
1. Rebuild sb-006 to 5:6.
2. Artwork for sb-001 and sb-002.
3. Dark and light masters for all nine.
4. Open Printful and upload by colour list.
5. Price and verify shipping.
6. Test one order end-to-end.
7. Enable sales only after verification and authorization.
8. Build the generator.

## Printful process (planned, not executed)
Free account; Bella+Canvas 3001 or Comfort Colors 1717; upload correct master per colour; full front scaled to 5:6; repeat for each variant; keep unpublished until the required launch checks pass.

## Light master conversion
1. Open dark master.
2. Remove black to transparency.
3. Invert cream to near-black.
4. Preserve red.
5. Verify against white.
6. Export transparent PNG at 4500 x 5400.

## Open items
sb-001/002 artwork; sb-006 rebuild; light masters (upload blocker); Printful account; pricing; generator unbuilt; manufacturer and payment unverified.

## Supplied Next.js scaffold - integration warning
The user supplied package.json for Next 15.1.0 / React 19, .env.example, .gitignore, next.config.mjs, tsconfig.json, tailwind.config.ts and .github/workflows/ci.yml.
The existing development branch uses a different app architecture and a 27-product unpublished preview. Do not overwrite its root package.json or enable CI without a separate migration and baseline test. The supplied tsconfig.json appeared twice with identical content. The supplied CI workflow was incomplete (ends after IMAGE_API_KEY: x).

## Safety
Existing saleEnabled=false safeguards stay in place. Do not expose credentials or upload live products. Do not enable checkout before supplier, payment, shipping and end-to-end order validation.
