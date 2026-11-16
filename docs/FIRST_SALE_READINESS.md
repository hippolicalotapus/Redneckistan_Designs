# First-sale prerequisites

The preview bag is implemented and tested; live checkout is not connected. No catalogue concept is yet a verified purchasable variant.

The server-side item-draft validator is now implemented and tested separately from the browser bag. It resolves trusted variant prices and blocks missing approvals and destinations, but is not connected to an endpoint or payment provider. It does not calculate a payable total, create an order, or fulfill anything.

A separate payment-to-order state model is now tested offline with fictional events. It handles pending/paid/failed status, duplicate notifications and a stable fulfillment intent. It does not verify signatures, contact a provider, persist orders transactionally or send a supplier request. A trusted final-total service and the actual webhook/database/worker integration remain required.

## Evidence reviewed

A read-only review of the existing supplier correspondence confirms G&L accepts individual direct-to-customer fulfillment and the proposed adult-humour apparel, with original artwork ownership retained. A custom-site API was discussed as possible, but the API contract and test-order workflow have not been supplied. Existing shipping figures are estimates rather than destination-specific checkout rates. Private supplier costs and correspondence are not copied into this client project.

The connected Stripe listing exposes only a test-mode context named “New business”; its association with this clothing store is unconfirmed. No live payment, payout or merchant-verification readiness has been established. No account was selected or changed.

## Ordered launch work

1. Finalize the first One Heart hoodie and Sarcastabastard shirt from actual approved artwork. Keep the locked print proportions and obtain supplier-specific production files and an accepted physical sample.
2. Confirm garment/colour/size SKU mapping and complete unit economics, including the missing T-shirt quote, setup, print placements and applicable charges. Resolve supplier quote ambiguities before using them.
3. Obtain exact destination shipping rates, production/tracking behavior, cancellation/refund handling and a testable fulfillment API contract.
4. Select the intended verified payment account. Implement server-side trusted pricing and availability, payment-session creation, verified payment events and durable order state. Browser bag contents can supply desired IDs/sizes/quantities, never authoritative prices or sale permissions.
5. Test successful and failed payments, repeated events, fulfillment failure, refunds and tracking without live sales. Confirm customer-facing sizes, materials, delivery and policies against the actual product and operating process.
6. Release only verified variants after the complete purchase and fulfillment flow passes review. Retain disabled checkout for every unverified concept.

This record does not authorize spending, ordering samples, accepting terms, contacting suppliers, deploying or enabling payments. No implied approval is inferred from a quote, test-mode account or a customer-side flag.
