# Payment-to-order state milestone

Implement a pure server-side order state model after the existing item validator. A pending order is bound to a server-owned order ID, provider session ID and complete expected CAD amount. The item-only validator's subtotal is not a final payable total and cannot directly create an order.

Completeness of that final amount is the future trusted caller's responsibility. This helper validates a positive integer amount and exact payment matching; it cannot prove that shipping/tax were included or distinguish an incorrectly renamed subtotal. A finalized quote and trusted session creation must establish that before using this model.

The future webhook adapter must first verify the raw signature with the payment provider's official SDK, retrieve authoritative session data and load the matching durable order. Only then may it call this model with a normalized verified event. No verification Boolean supplied by a browser is accepted as authentication. This milestone does not implement that adapter, provider connection or HTTP endpoint.

Completed-but-unpaid events remain pending. A matching paid event creates one stable fulfillment intent. Duplicate IDs and multiple success event types cannot create additional intents; late failure cannot reverse paid status. Reject mismatched order/session/currency/amount and malformed data. Preserve original inputs and JSON-serializable state.

The eventual database must atomically compare the order revision, persist the processed event ID and unique intent together, then let a retryable worker process the intent. The pure model is not durable storage or a concurrency guarantee. No supplier call, email, payment, refund or shipment occurs here. Refunds, cancellations and disputes remain separate required lifecycle work before launch.

Reference reviewed: https://docs.stripe.com/checkout/fulfillment.md?ui=full-page — provider-confirmed payment state, repeated/concurrent delivery and delayed success handling. Keep the storefront and release gate disabled. Test fictional data only and review before committing.
