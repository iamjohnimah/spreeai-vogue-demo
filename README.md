# Vogue × SPREEAI shopping concept

Independent shopping review, not an official Vogue website or endorsed partnership.

## October 7 update — build 2026.10.07.04

25 captured products from Vogue Shopping, with original product photography, designer names, prices and retailer links. Provenance is in source-catalog.json; prices are snapshots, not live stock.

Homepage Try on buttons remain centered inside each image frame, below the garment. On the product page, Try it on appears inside the fitting-room panel directly above Build a look; it is not over the photograph. Compare remains separate, and Find my size sits beside Size Guide. The try-on dialog contains only try-on controls. Back and video remain explicit Coming soon placeholders.

## Verified and remaining work

All 25 product pages passed desktop/mobile layout checks: the primary action is above Build a look, no image-mounted product-page CTA, no horizontal overflow. All 25 homepage product images loaded. Saving/removing a look was exercised for all 25 garments; saved-look persistence across reload and reopening the correct outfit were verified. Compare selection supports three pieces with separate save actions.

A real staging Twin-image connection failure was repaired in the client: an approved catalog Twin is registered into the current guest session, with a deduplicated session-scoped connection. Only the catalog image matching the selected Twin may be used; shopper photos retain their separate consent/upload flow and photo ledger. The recovery produced COMPLETE renders and real images for Tilda jacket, Eden top and The Kyle gloves. The updated local storefront also displayed the live Tilda image. Broader rendering verification hit HTTP 429; these requests are not recorded as successful. The browser honors the service retry delay once and offers a manual retry.

The 15 added garments are imported but not ready: the latest unrestricted readiness audit found eight FAILED and seven AVATARS. Admin evidence identifies failing inherited Twin image references during ingestion QA. No failed render was approved and readiness was not bypassed. These variants need the staging Twin references repaired, ingestion QA rerun, output reviewed and approved before live previews are available. The client Twin repair cannot repair server-side ingestion jobs.

All 25 sizing requests returned no calibrated size chart. The UI states that personal sizing is unavailable and links to the original retailer size guide. Verified garment charts must be attached before calibrated recommendations can work; no fabricated sizing predictions are supplied. Full all-garment try-on/sizing verification remains incomplete.

Browser-local saved looks are not cloud accounts. Retailer checkout remains external. Style edits and fitting preferences are guidance, not calibrated fit maps. No pixel-identity claim: Vogue editorial and advertising inventory varies.

## Rebuild and publish

Editable React source is under source/. With Node: cd source, npm install, npm run build. GitHub Pages publishes the root static files via the existing workflow.

No API secrets, session credentials or shopper photos are shipped. Sessions authenticate with SPREEAI at runtime. The staging service may require VPN access.
