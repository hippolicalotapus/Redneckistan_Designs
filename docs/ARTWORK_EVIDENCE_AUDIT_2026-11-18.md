# Redneckistan Designs — evidence-based 27-slot artwork audit (2026-11-18)

**Scope:** GitHub integration branch at `6add35a3fdae97495fd607e1cbcedb2a535fec61`. This is a repository evidence audit, not a claim that approved designs do not exist elsewhere. No approvals or sale flags are changed.

## Repository findings

- `catalogue/launch-27.json` contains 27 distinct positions: 9 One Heart mountains (`1-1`–`1-9`), 9 One Heart artwear (`2-1`–`2-9`), and 9 Sarcastabastard (`3-1`–`3-9`).
- Every position currently has `approved:false`, `artworkVerified:false`, `supplierQuoteVerified:false`, `saleEnabled:false`, and `priceCad:null`.
- The Git tree has no tracked `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, `.pdf`, `.ai`, `.eps`, `.psd`, `.tif`, or `.tiff` artwork assets. This does not establish that external artwork is missing.
- `app.js` deliberately renders `ARTWORK UNDER REVIEW` placeholders. No original design is displayed in the current catalogue.
- `1-1` is labelled `Mount Edith Cavell`; `1-2`–`1-9` are unnamed mountain concepts.
- `2-1`–`2-6` are artwear concepts; `2-7`–`2-9` are paisley concepts. No master artwork or final approved SKU mapping is present.
- `3-1`–`3-9` are labelled `Slogan awaiting exact approval`. The exact approved slogan-to-artwork-to-slot mapping is not recorded here.
- `docs/27-design-launch-register.md` references prior designs and G&L/Lifted Press correspondence; those references do not prove item-specific production readiness.

## Required evidence per slot before approval

1. Source-approved exact design name and immutable original artwork file identifier; retain version and file hash.
2. Approval provenance (person, date, exact image and print-size approval) and intellectual-property/usage rights.
3. Brand-specific garment style, sizes, colours, front/back positions, physical dimensions and decoration process.
4. Supplier acceptance of actual artwork, print-ready resolution/colour requirements and physical sample/proof result.
5. Itemized supplier quote, setup, fulfillment, shipping, taxes, size surcharges, and verified retail pricing.
6. Offline integration/fulfillment checks, then separately authorized hosted-origin QA.

## Next safe steps

- Recover original artwork and exact approvals from existing project files, designs and supplier threads; **do not invent or relabel** missing work.
- Create an external evidence register mapping each of the 27 stable slot IDs to verified file hashes and approval sources.
- Add a non-mutating audit command that reports missing evidence without promoting any design to approved or purchasable.
- Keep checkout disabled and all `saleEnabled` flags false until each release gate is independently satisfied.

**Safety:** No artwork replaced, no supplier order sent, no payments activated, no deploy/merge/action run.
