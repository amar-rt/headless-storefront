# Headless Shopify Storefront

A compact headless storefront for the Shopify platform, built with Vite + React. Home, PLP,
PDP, blogs, and generic content pages, all driven by Shopify's Storefront API — point it at
any store via a couple of env vars.

## Quick start

```
npm install
copy .env.example .env    # then fill in real values, see below
npm run dev
```

Without a `.env`, the app shows a "not configured" screen instead of a blank page.

## Connecting a Shopify store

1. In Shopify Admin: **Settings → Apps and sales channels → Develop apps → Create an app.**
2. Under **API credentials**, configure Storefront API access and generate a token with
   unauthenticated read scopes for products, collections, content, and blogs.
3. Fill in `.env`:

```
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your-storefront-api-public-token
VITE_SHOPIFY_API_VERSION=2025-01
```

No store yet? Create a free development store via [Shopify Partners](https://www.shopify.com/partners)
and use its "Add sample data" option to populate products/collections/a blog/pages.

## What's here

- **Home** (`/`) — featured collections + products.
- **PLP** (`/collections/:handle`) — numbered pagination built on top of Shopify's
  cursor-based API (see `src/lib/useCursorPagination.ts`).
- **PDP** (`/products/:handle`) — variant selection, add to cart.
- **Cart** — slide-out drawer, persisted across reloads via `localStorage`, redirects to
  Shopify's hosted checkout on "Checkout".
- **Blog** (`/blogs/:handle`, `/blogs/:handle/:articleHandle`).
- **Pages** (`/pages/:handle`) — generic Shopify content pages.

## Re-skinning

All design tokens (colors, fonts, radii, spacing) live in one file: `src/styles/theme.css`.
Nothing else in the app hardcodes a color. It ships seeded with values pulled from an
existing Shopify theme as a starting palette — edit that file to match a different brand.

## Scripts

```
npm run dev       # start the dev server
npm run build     # typecheck, then production build to dist/
npm run preview   # preview the production build
npm run typecheck # tsc -b, no emit
npm test          # run unit tests (node --test, no test-framework dependency)
```

## Deliberately out of scope

No search, no customer accounts. No routing library, GraphQL client, or state-management
library — see the source for why (short comments at each relevant file).
