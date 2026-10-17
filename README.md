# Vogue × SPREEAI shopping concept

Independent shopping review, not an official Vogue website or endorsed partnership.

## October 17 update — meeting preparation

Build 2026.10.17.05 unifies garment ribbons and complete outfits in Profile → Saved looks. Existing ribbons and saved outfits migrate into the same browser-local collection, with matching save/remove states across cards, product pages, comparison and the builder. Saves do not require a model and remain available when the selected model changes. A short floating ribbon confirms new saves, with reduced-motion support.

Try-on, Build a look and Fittings offer Straight-on, Side profile and Three-quarter poses. The latter two use the same v3.1 presets as the current SPREEAI shop: editorial and three_quarter. For complete outfits, the verified front render is connected as the pose input, preserving its other clothes and accessories while the service re-poses the primary garment. Derived inputs remain session-scoped and never replace the selected identity or enter its uploaded-photo ledger. Cache keys and retry counters are isolated per pose, outfit and identity. Duplicate front results are rejected as alternate views; image recovery still resolves the original request. All three thumbnail photographs are verified generated try-ons of the currently selected model or uploaded photo and outfit, framed full body. The additional poses prepare after the front image is ready. Pending or unavailable states never substitute a reference person or a different pose.

The Vogue partner's staging service requires the scoped backend release 1.26.18-vogue-poses.1 for the two additional presets. It retains partner isolation and Oscar's existing access. Retailer purchases remain external; calibrated sizing, back try-on and video availability are unchanged.

Click any ready pose thumbnail or main try-on image to open an enlarged full-body viewer, with keyboard-accessible zoom controls and Escape/close returning to the same fitting-room selection.

Hover contrast, modal transitions, pose cards, save feedback, profile navigation and mobile controls were refined. Frontend validation: production bundle builds and all 32 automated checks pass. Browser checks cover ribbon-to-profile saving, reload persistence, complete-outfit saving and reopening, readable hover text/wordmark, and a 390px mobile layout with no horizontal overflow.

## October 8 update — repaired front previews

25 captured products from Vogue Shopping, with original product photography, designer names, prices and retailer links. Provenance is in source-catalog.json; prices are snapshots, not live stock.

Homepage Try on buttons remain centered inside each image frame, below the garment. On the product page, Try it on appears inside the fitting-room panel directly above Build a look; it is not over the photograph. Compare remains separate, and Find my size sits beside Size Guide. The try-on dialog contains only try-on controls. Back and video remain explicit Coming soon placeholders.

## Image recovery

The browser verifies that a completed preview can actually display before marking it ready. When delivery fails, it refreshes the same result with bounded retries and preserves its request ID for manual recovery. For eligible unsigned staging render URLs, a failed CDN image can load the identical render key from the known SPREEAI image origin. This is limited to this Vogue review. Signed URLs, foreign hosts, uploads and mismatched render IDs are excluded. If the service remains COMPLETE without an image after bounded refreshes, recovery makes one fresh render using the identical identity, garment selection and pose. A second empty result stops with a retryable error. Requests with existing but temporarily unavailable images retain their original request ID. Retry does not substitute another model or show a product photo as a personal preview. Ten deterministic recovery tests pass. This client behavior cannot replace an image that the service does not deliver.

## Verified and remaining work

All 25 product pages passed desktop/mobile layout checks: the primary action is above Build a look, no image-mounted product-page CTA, no horizontal overflow. All 25 homepage product images loaded. Saving/removing a look was exercised for all 25 garments; saved-look persistence across reload and reopening the correct outfit were verified. Compare selection supports three pieces with separate save actions.

A real staging Twin-image connection failure was repaired in the client: an approved catalog Twin is registered into the current guest session, with a deduplicated session-scoped connection. Only the catalog image matching the selected Twin may be used; shopper photos retain their separate consent/upload flow and photo ledger. The recovery produced COMPLETE renders and real images for Tilda jacket, Eden top and The Kyle gloves. The updated local storefront also displayed the live Tilda image. All 25 garments now have decoded front-preview evidence on the approved catalog Twin. The browser honors the service retry delay once and offers a manual retry when the backend is busy.

The three remaining garments are now available for front try-on: the Zara mesh dress, By Malene Birger Henna brooch and Dries Van Noten blazer. Their latest ingestion batches each produced six reviewed images; all three also completed fresh guest try-ons whose actual result images decoded. The brooch now preserves its 12 cm scale and upper-chest placement. Original product photographs remain the catalog source; unsuitable older generated references are excluded. Older failed/rejected requests remain in the audit history. Individual provider or quality rejections can still occur and are shown honestly, with retry support.

All 25 sizing requests returned no calibrated size chart. The UI states that personal sizing is unavailable and links to the original retailer size guide. Verified garment charts must be attached before calibrated recommendations can work; no fabricated sizing predictions are supplied. Front try-on was verified for all 25 garments on the approved Twin; calibrated sizing remains unavailable.

Browser-local saved looks are not cloud accounts. Retailer checkout remains external. Style edits and fitting preferences are guidance, not calibrated fit maps. No pixel-identity claim: Vogue editorial and advertising inventory varies.

## Rebuild and publish

Editable React source is under source/. With Node: cd source, npm install, npm run build. GitHub Pages publishes the root static files via the existing workflow.

No API secrets, session credentials or shopper photos are shipped. Sessions authenticate with SPREEAI at runtime. The staging service may require VPN access.
