# Studio scaling and recovery checkpoint

Baseline: `82f1863f0c004eced448414c3fa39da89992c044` on `develop/store-foundation`. Recovered all 17 tracked files and verified each against its Git blob SHA before modifying anything. The original 18 Node tests passed.

## Confirmed defect and correction

At a 390px Chromium iframe viewport, the 20% front print clipped “Stop inbreeding. Ban country music.”: required height 158px, visible height 96px. A 50% back print with “Do not leave unsupervised. Last time required a lawyer.” required 103px in a 96px box. The 8px minimum preview font stayed fixed while the print width shrank, wrapping and hiding the remaining words.

The preview font now scales with the saved artwork scale and garment container. The slogan, saved coordinates, scale, front/back independence, and artwork itself are unchanged. At the original failing settings the complete front/back text occupied 4px and 13px respectively, without hidden overflow. Small physical print choices intentionally look small in the garment preview; this is not a full-size artwork reader or production proof.

## Executed verification

- `npm test`: 18 tests passed after the change.
- Real Chromium iframe checks at 390px and 320px, using actual form controls. Long draft text no longer had vertical clipping at the tested 20% and 100% front scales. No horizontal page overflow at 320px (305px content width after scrollbar).
- Actual browser reload restored the saved brand, back-side slogan and wishlist count. Switching to front recovered its distinct slogan and 20% scale. This was a native reload, not a simulated storage test.
- Each collection filter showed nine positions; search reduced Mountains to Mount Edith Cavell; the saved-only view restored one saved item.
- Keyboard Enter opened product details, checkout remained disabled, Escape closed the dialog and returned focus to View details.

Only `styles.css` and `studio/studio.js` changed in application code. Catalogue placeholders remain placeholders; no approved artwork or slogans were replaced or promoted to verified products. No deployment, Actions, spending, sale or production export occurred. Browser checks used an iframe viewport, not a physical phone.
