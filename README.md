# Backyard Catalogue

A standalone Next.js app that renders **only** the Custom Fence & Gates
catalogue flipbook. It was split out of the main marketing site so the
catalogue can be hosted and deployed independently (e.g. on its own domain or
subdomain).

The whole app is a single page (`/`) that renders the flipbook full-screen.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build & run

```bash
npm run build
npm start
```

## Where the content lives

- `src/config/catalogue.ts` — the catalogue content (collections, styles,
  finishes, spec sheets). Keep in sync with the main site.
- `src/config/services.ts` — slug → title map for each collection.
- `src/config/site.ts` — phone/email shown on the back cover. Override the
  email with `NEXT_PUBLIC_ENQUIRY_EMAIL`.
- `src/components/catalogue-book.tsx` — the flipbook (StPageFlip) component.
- `public/` — the collection photos referenced by the catalogue.

## Keeping it in sync with the main site

This project is a copy, not a shared package. When the catalogue changes in the
main `thebackyardfence` site, copy over `src/config/catalogue.ts` and any new
images it references in `public/`.
# CustomFence-Gates
