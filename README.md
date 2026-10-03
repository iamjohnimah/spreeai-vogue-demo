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

The storefront and fitting room were checked locally on desktop and at 390px and 320px widths without horizontal page overflow. Decorative upward arrows were removed. The Vogue wordmark, fitting-room header, typography, controls and content groups now share a restrained editorial treatment.

Real SPREEAI staging try-on returned complete, readable images for all ten items on Olivia, plus the Tilda jacket and Brity pants together. Garment readiness was completed through the supported manual QA endpoint on the isolated Vogue staging partner; individual review votes and failed renders remain in history. Back and video remain placeholders. The dress had four provider-filtered avatar test renders; the successful Olivia preview was reviewed and verified separately, and provider filtering remains active. Try-on handles a service rate-limit response with one bounded retry respecting Retry-After.

Fit notes and curated Style edits are guidance, not calibrated fit maps or a live AI stylist. Size recommendations require calibrated garment measurements; the current Vogue records do not have size charts and show an explicit unavailable state. Staging services may require VPN access for viewers.

## Publishing

GitHub Pages publishes the static files at the repository root through the included workflow. There are no API keys, session tokens or private project history in this repository. SPREEAI authenticates browser sessions at runtime. Photo uploads are sent directly to SPREEAI after the user's consent; they are not stored in this repository.

Build: 2026.10.03.03.
