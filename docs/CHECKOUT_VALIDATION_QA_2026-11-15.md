# Checkout item-draft validation checkpoint

Baseline: `4778b46182db6a9cb2c49a52664fa10c3e32ccc7` on `develop/store-foundation`.

Implemented `server/checkout-validation.js` and a disabled server release configuration. The function validates requested design IDs, sizes, quantities, catalogue version and destination separately from server-owned product data. It rejects client prices, approvals, supplier mappings and redirect fields; invalid lines reject the complete draft. Duplicate requests cannot exceed ten for a variant. Product/artwork/supplier verification flags and nonempty artwork/sample/supplier approval references are all required, along with an active uniquely mapped CAD variant and variant-specific destination allowlist.

Prices resolve from trusted variants as integer CAD cents with safe-integer checks on line amounts and subtotal. A successful result is explicitly `stage: items-only`, without a final payable total. Approval references are structural prerequisites, not proof of real approvals: a future server-owned loader and operator verification remain responsible for their authenticity. Never accept the trusted data argument from the request body.

## Executed evidence

- Thirteen new validator tests plus the original 25 tests: **38 passed**. Node syntax checks also passed.
- Initial stub behavior failed six feature tests. The per-variant destination regression also failed before its correction.
- The real 27-position catalogue produces no draft with the disabled release, and still fails product readiness if the release flag alone is enabled in a test copy.
- Fictional fixture prices, SKUs and approval references exercise the positive path. They are test data, not proposed products or prices.
- Independent review found that sparse arrays could bypass `forEach`, producing an empty draft. Reproduced the defect, added sparse/mixed-array tests, and corrected iteration so missing slots become invalid lines. The full suite passes after the correction.

## Limits and next integration

This module has no HTTP route, payment-provider request, authentication, tax/shipping calculation, stock reservation, database or fulfillment side effect. There is no live checkout and no sale authorization. Future wiring must independently load the trusted release/catalogue, keep server configuration out of static files, calculate complete totals, handle payment events and durable order transitions, and complete fulfillment tests before enabling sales. The storefront and bag UI were unchanged, so no new browser test or screenshot was needed for this backend-only milestone. No Actions, deployment, spending or account changes occurred.
