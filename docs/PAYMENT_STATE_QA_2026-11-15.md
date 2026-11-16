# Payment-to-order model checkpoint

Baseline: `bab788277c8c1c39f37a5859471367d8ea6585bf`, `develop/store-foundation`.

Implemented the pure `server/payment-state.js` model for normalized, already-verified provider events. It binds a pending order to the expected order/session IDs, CAD currency and amount, tracks accepted event IDs and a revision, and creates a stable fulfillment intent only after paid confirmation. Completed-but-unpaid events never create an intent. Delayed success is supported; repeat success retains the original intent, and late failures cannot reverse paid status. Mismatched/invalid events reject without changing the original state.

## Executed verification

- Thirteen payment-model tests, two commerce-boundary tests and the original 38 tests: **53 tests passed**, zero failures. Node syntax check passed.
- Initial empty model behavior failed eleven of the first twelve payment tests before implementation.
- Tests serialize and reload state, then verify duplicate detection. They also cover failure followed by success, late failure/unpaid events, wrong order/session/currency/amount, unsupported events and malformed stored state.
- Integration checks show the real disabled catalogue cannot supply an order, an item-only draft is not directly usable as a pending order, and a payment matching only the item subtotal is rejected when the stored expected total includes fictional shipping and tax. These test amounts are not actual rates or production quotes.
- Independent review found a revision-limit inconsistency. Reproduced it, added a regression, and corrected terminal revision handling: duplicate reads remain possible, while a new event cannot overflow the revision. The full 53-test suite passed after the correction.
- Clarified the final-total boundary: the model cannot prove that a supplied numeric amount includes shipping/tax. A future trusted finalized-quote/session-creation service is responsible for that.

## Not implemented or claimed

No HTTP webhook, signature verification, authoritative provider-session retrieval, payment account selection, live/test provider calls, durable database, transactional event/intent write, worker, refunds, disputes, cancellations or actual fulfillment is implemented here. The future adapter must use the official SDK to verify the raw webhook, retrieve authoritative session data and load the order before calling this model. Production deduplication requires an atomic revision/event/unique-intent transaction and retryable worker; a pure function and serialized fixture do not prove concurrent or crash-safe processing.

There were no UI changes, so no new browser screenshot or physical-device claim is made. No deployment, GitHub Actions, spending, email or real order occurred. The release gate and checkout remain disabled.
