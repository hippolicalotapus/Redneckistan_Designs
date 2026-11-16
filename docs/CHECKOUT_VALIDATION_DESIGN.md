# Checkout validation milestone

Prepare a server-only validation module for the future checkout endpoint. It receives the requested catalogue version, destination country and design/size/quantity selections separately from trusted server-owned product and release data. Client-side bag data is a request, never pricing or approval authority.

Reject unknown, malformed, stale, unavailable or unapproved selections as a whole; do not silently drop lines. Merge identical design/size requests only within the quantity limit. Resolve prices as integer CAD cents from trusted variants and produce an item subtotal only. Require artwork, supplier and physical-sample approval references before a variant can produce an item draft.

The current release configuration remains disabled. There is no HTTP endpoint, payment API, tax/shipping calculation or fulfillment action in this milestone. A successful validator result is an internal item draft, never payment authorization or a completed order. Future deployment must keep server code/configuration out of static public assets and load trusted data independently of request bodies.

This advances the previously documented server-side pricing prerequisite without choosing an unverified payment account. Existing storefront, preview bag and approved artwork remain unchanged. Test with explicitly fictional fixtures and the real disabled 27-position catalogue, then run the complete suite and independent review before committing.
