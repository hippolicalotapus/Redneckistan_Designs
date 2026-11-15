# 27-design launch register — working plan

Status: planning only. No SKU is approved for sale by this file.

## Launch structure
- Group A — 9 One Heart mountain designs. Existing mountain-series concepts must be recovered and individually checked against their original approvals. Mount Edith Cavell is a documented example.
- Group B — 9 One Heart artwear designs. Recover the six previously presented art T-shirts and three paisley concepts; confirm which are approved and feasible. Full-coverage paisley is not confirmed as printable with the currently quoted process.
- Group C — 9 Sarcastabastard designs. Recover previously shortlisted exact slogans and approved layouts from prior artwork and correspondence. Do not manufacture slogans or infer approval from a draft.

## Source evidence
- G&L quotation attachment "One Heart Product Pricing.xlsx", message 1a1d574762548668 (business Gmail, November 2026).
- G&L hoodie DTG: S&S SF500 $37.90; Forge L00580 $43.52. DTF: S&S SF500 $46.40; Forge L00580 $52.22.
- Additional G&L charges: $3.50/order POD fulfilment; shipping to Alberta estimated $13–16 for one hoodie ($20–23 PO box); $3.50 for 2XL+; $35/design/print method setup; $65/hour original artwork; tax extra.
- G&L says independent website orders can be accepted through API integration; endpoint, credentials, webhook and production acceptance requirements are NOT yet verified.
- Lifted Press message 1a1a836c8a768db7 confirms adult humour accepted and DTF suitable for mountain hoodies and Sarcastabastard tees subject to production artwork. No itemized quote received. All-over art and paisley require another process.

## Non-negotiable release gates
1. Retrieve original artwork masters and exact slogan approval records. Reference PDF is not a production-ready print file.
2. Confirm each design's unique visual composition, original rights, garment fit and decoration dimensions.
3. Obtain G&L T-shirt pricing and verify hoodie sample quality before making any product purchasable.
4. Confirm API technical specifications and test order handling using non-production fixtures only.
5. Verify Canadian tax, shipping, returns and payment fees; display honest landed prices.
6. Do not send live orders, authorize setup, purchase samples, charge customers, deploy or publish without explicit approval.

## Catalogue data schema for implementation
Each of 27 slots requires: slot ID, brand, group, approved exact design name, original artwork file path, rights status, garment style, print method, print dimensions, supplier quoted cost, fulfillment fee, shipping policy, retail price, proof status, test status, and sale-enabled flag. Default sale-enabled=false.

## Testing checklist
- Exactly 27 catalogue slots, no duplicate slot IDs.
- 9 slots in each group, no cross-brand contamination.
- Every unverified or missing product must remain non-purchasable.
- No placeholder prices represented as supplier quotes.
- Mobile layout, accessibility, checkout sandbox, and order-integration contract tests must pass before release.
