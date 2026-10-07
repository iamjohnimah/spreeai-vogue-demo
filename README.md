# Vogue × SPREEAI shopping concept

Independent shopping review, not an official Vogue website or endorsed partnership.

## October 7 update

25 products: the original ten New Arrivals pieces and 15 additional products from https://www.vogue.com/shopping, with Vogue product photographs, designer names, prices and retailer links. Provenance is in source-catalog.json. Prices are a capture, not live inventory.

Vogue wordmarks, FB Didot, Vogue Avant Garde and Adobe Garamond typography, navigation, editorial banner and shopping layout. Added visible branded card try-on actions, category filters, price sorting and a refined fitting room. Mobile comparison actions now wrap within the viewport. Original retailer checkout links remain external.

## Features and verification

Local interactions verified: category filtering, price sorting, shopping bag size validation, saved looks and restoration, outfit-to-bag quantity merging, styling search and occasion controls, comparison selection, and profile consent gating. Desktop 1440px and mobile 390px/320px product images loaded without page overflow. No claim of pixel identity: Vogue's live advertising and editorial inventory vary.

All 15 staging garment records were created in isolated vogue-partner-review. Importing a record is not successful try-on verification. Current anonymous guest tests of all 25 garments failed: existing pieces return a missing Twin image URL error; new variants remain AVATARS while their QA renders fail against the same missing images. Failed renders were not accepted and readiness was not bypassed. Restore staging image resolution, rerun garment QA, review the output and then mark verified variants ready.

The Twin picker now rejects incomplete image records and explains the service issue. Photo preview/upload/delete consent flow remains implemented; end-to-end upload was not verified in this pass because the browser file chooser timed out. Rendering remains a live staging dependency, never a synthetic success.

Back and video try-on remain explicit Coming soon placeholders. Size recommendation requests need calibrated retailer charts; these records lack them. Fit preferences and curated Style edits are guidance, not calibrated fit maps or an AI stylist. Browser-local saves are not cloud accounts.

## Rebuild and publish

Editable React source is included under source/. With a current Node runtime: cd source, npm install, npm run build. This writes the bundled assets and updates index.html cache hashes. GitHub Pages publishes root static files via the existing workflow.

No API secrets, session credentials or shopper photos are included. Browser sessions authenticate with SPREEAI at runtime. Own photos are transmitted directly to SPREEAI only after shopper consent. The service may require VPN access.

Build 2026.10.07.01.
