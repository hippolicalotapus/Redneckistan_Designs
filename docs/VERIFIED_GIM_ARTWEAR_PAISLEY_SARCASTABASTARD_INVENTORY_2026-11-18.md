# Verified original GIM apparel design inventory and candidate slot reconciliation

Date: 2026-11-18. Source: `hippolicalotapus/global-intimacy-marketplace`, `main`, `site/apparel.js` Git blob `2203d327e903522ac517fc30aa5647d3cc0d0357`. This source explicitly labels all listed concepts `owner-selected-concept`, `imageApproved:false`, `priceVerified:false`, `canAcceptOrders:false`.

## Artwear, paisley and Sarcastabastard

Git hashes below identify existing **preview card WebP** assets, not manufacturer-ready print masters. Candidate slots are sequence/category matches to generic placeholders, **not verified owner-approved slot assignments**.

| Original ID | Source design name | Candidate Redneckistan slot (unconfirmed) | Preview card Git blob SHA |
|---|---|---|---|
| OH-A01 | Dimension One | 2-1 | `68bb29f0f814c0ab6a2f5e69c8cfb0ca01e8889e` |
| OH-A02 | Cosmic Fluidity | 2-2 | `5bac06d927ce2fd6fbe05579d9c0a672a8e6275e` |
| OH-A03 | Sacred Forest | 2-3 | `ec98dec41b89075b3e6c49a8da678da5f964c372` |
| OH-A04 | Stardust Unity | 2-4 | `ad23b72bc6b51fcf629f46f37de6b486d6d6035d` |
| OH-A05 | Realms Within | 2-5 | `44ccae882faf4c2b9e02983035eca3c576eb63bf` |
| OH-A06 | Melting Ruby Heart | 2-6 | `b92cfe463a944e355d0116a81291ffa652dbee74` |
| OH-P01 | Teal / Copper / Ivory Paisley | 2-7 | `82c56f76cbc00e1e3c8b12f73d47d35fe90d6537` |
| OH-P02 | Midnight Luxe | 2-8 | `48f784b8d7c0299a2d1937ba121b1fc08593b531` |
| OH-P03 | Daydream | 2-9 | `7e174aa58405ede48e08cc6e3d1461b45afe670a` |
| SB-T01 | I FUCK UP EVERYTHING | 3-1 | `6b9ea37a30c591373170072978ad5afa7483bb56` |

The GIM tree also contains reference sheets `OH_A01-A05_Art_Tees.webp`, `OH_A06_Melting_Ruby_Heart.webp`, `OH_P01_Teal_Copper_Ivory.webp`, `OH_P02-P03_Midnight_Luxe_Daydream.webp` and `SB_T01_I_Fuck_Up_Everything.webp` under `site/assets/apparel/references/`. The original catalogue links these to each source ID. These are **existing preview assets**, not approved production artwork.

## Mountains

Nine original mountain hoodie design IDs and names are recorded in `site/apparel.js` and visually verified in `docs/VERIFIED_HOODIE_ARTWORK_IDENTITIES_2026-11-18.md`. The only exact existing label match is Redneckistan slot `1-1` Mount Edith Cavell ↔ `OH-H07`. No other mountain slot order is confirmed; never map by numeric suffix.

## Sarcastabastard outstanding

`SB-T01` is the sole original Sarcastabastard entry in the inspected GIM `site/apparel.js`. Its title `I FUCK UP EVERYTHING` and associated concept image do **not** establish the complete wording of any longer approved slogan or an approved final small chest print. No other eight original artwork masters or nine-slot owner approvals were located in this source. Keep all nine Redneckistan Sarcastabastard positions unresolved.

## Required safeguards

- Do not rename any existing Redneckistan slot, copy preview art, promote source candidates to confirmed mappings, or alter original designs based only on numeric sequence.
- Do not infer manufacturing permission from `owner-selected-concept`. Physical print dimensions, sample acceptance, rights, supplier quote and final approval remain separate release gates.
- All 27 Redneckistan catalogue entries retain `approved:false`, `artworkVerified:false`, `supplierQuoteVerified:false`, `saleEnabled:false`, `priceCad:null`; checkout remains disabled.
- This register is documentation only and does not alter application code, artwork or tests.
