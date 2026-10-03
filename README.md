# Vogue × SPREEAI shopping concept

An independent storefront review using the first ten items from Vogue's New Arrivals page, captured October 3, 2026. This is not an official Vogue website or an endorsed partnership.

The storefront uses Vogue's wordmark, observed public typography, navigation, product photographs and shopping layout. SPREEAI's fitting room is embedded in the shopping flow. Descriptive editorial copy is original to this concept.

## Features

- Personal virtual try-on and size recommendation requests connected to SPREEAI staging.
- Up to three looks in side-by-side comparison.
- Fit preference notes, curated Style edits and a complementary outfit builder.
- Heart outfits, preserve the exact selected pieces, and reopen saved looks in the same browser.
- Back try-on and video try-on are explicitly marked Coming soon.
- Shopping bag with links to each original retailer. Payments and orders occur at those retailers.

## Review status

The storefront, product navigation, saved outfits, outfit selection, comparison selection and shopping bag were checked locally, including 390px and 320px widths without horizontal page overflow. Actual render success is not yet verified: staging currently reports that these garments are still being prepared, and the staging admin is unavailable. Fit notes and curated Style edits are demonstrations, not calibrated fit maps or a live AI stylist. Size recommendations require calibrated garment measurements and return an explicit unavailable state when no valid result is supplied.

## Publishing

GitHub Pages publishes the static files at the repository root through the included workflow. There are no API keys, session tokens or private project history in this repository. SPREEAI authenticates browser sessions at runtime. Photo uploads are sent directly to SPREEAI after the user's consent; they are not stored in this repository.

Build: 2026.10.03.01.
