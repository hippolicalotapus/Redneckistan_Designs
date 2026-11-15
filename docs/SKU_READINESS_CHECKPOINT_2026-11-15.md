# Offline hoodie readiness assessment

Base: `bce6db8f8161f886b2502657d421f9214f2639de` on `develop/store-foundation`. All 18 baseline source blobs were independently verified against the complete GitHub tree.

Run `npm run readiness` or `npm run readiness -- 1-1` for the Mount Edith Cavell design slot. Other existing One Heart mountain slot IDs are supported. Unknown IDs and other groups are rejected.

The new offline command reports the current catalogue state and six production evidence gaps: assigned garment/SKU, production artwork and rights, physical decoration dimensions, itemized quote, complete landed cost, and sample/proof acceptance. Generic supplier notes are context rather than verified SKU costs. This is a snapshot of evidence absent from the inspected repository; external records may exist and new evidence requires reassessment. It is not a launch approval engine.

The report reads the existing catalogue without altering it. All 27 catalogue records, prices, sale controls, studio files and approved visual assets are unchanged. No quote, physical measurement, supplier SKU or retail price is invented. Existing test and serve commands are preserved.

Five new behavior tests cover CLI selection, identity from input, nonmutation, invalid states and clean error output. Red-before-green evidence was recorded. Full `npm test` passes 23 tests, zero failures. The lead reran the complete suite. Independent scope and quality review passed, including portable temporary-directory/file-URL handling in tests.

No dependencies or network operations were added. No purchases, sales, deployment, publication or Actions runs were requested. Prepared for a separate development branch with skip markers and no pull request.
