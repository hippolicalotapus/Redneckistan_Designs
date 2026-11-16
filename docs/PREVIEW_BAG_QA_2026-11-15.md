# Preview bag verification

Base: `bce6db8f8161f886b2502657d421f9214f2639de`, `develop/store-foundation`.

Added a nonbinding preview bag to product details and the site header. It retains only known catalogue ID, illustrative size and integer quantity 1–10. Names are resolved from the current catalogue. Prices, approvals and checkout URLs supplied through storage are discarded. This is browser-local selection storage, not an order or inventory reservation. The catalogue, approved artwork and studio source were not changed. Checkout remains hard-disabled and no addresses or payment details are collected.

## Executed checks

- Seven model tests cover size/design merge semantics, different brands/sizes, invalid and stale IDs, quantities, immutability, tampered approval/price fields, corrupt storage, storage errors and persistence/removal/clear. Six initially failed against empty behavior before implementation; all seven now pass.
- Full original suite plus new tests: 25 tests passed. JavaScript syntax checks passed.
- Native Chromium iframe viewports 390px and 320px: missing size and quantity zero rejected; duplicate M additions merged to four; L retained separately; quantity eleven rejected, three accepted; removing L retained M; native reload restored M quantity three.
- Raising M to ten then adding another M was rejected without changing the count. Clear produced an empty bag and disabled Clear. Different brands remained separate (Sarcastabastard XL and One Heart M).
- Escape returned focus to the bag trigger. All tested checkout controls remained disabled. At 320px there was no page overflow (305px content/scroll width) and the bag also had no horizontal overflow (250px content/scroll width).
- Independent read-only code review found no blocking defect. It identified the scoped limitation below.

## Limits

Each tab keeps its own in-memory snapshot; concurrent tabs can overwrite one another's bag changes. This milestone does not claim synchronization across tabs. Storage can be cleared by the browser. Sizes remain illustrative. No real order, payment, shipping calculation or fulfillment request was tested or created. Browser viewports are not physical-device tests. No deployment, GitHub Actions, spending or supplier communication occurred.
