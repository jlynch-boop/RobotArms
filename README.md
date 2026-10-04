# Robot Arms LLC website

This directory contains the static Robot Arms LLC company site and the
preserved legacy family routes. The public site is generated into `dist/` so
the source, build tooling, and product repositories are never uploaded as
assets.

## Local build and checks

```sh
npm run build
npm run validate
```

For a local Cloudflare Workers preview after a Wrangler install:

```sh
npx wrangler dev --config wrangler.jsonc --local
```

The deployment target is the existing `robotarms` Worker and its `dist/`
asset directory. Deployment is an owner action and is intentionally not run
by this build.

## Site map

- `/` — Robot Arms LLC studio home
- `/seedshelf/` — factual SeedShelf product page
- `/seedshelf/privacy/` — SeedShelf data and recovery details
- `/pathweaver/` — curriculum-only Pathweaver overview
- `/about/`, `/support/`, `/privacy/` — company pages
- `/games/` — preserved Odin's Magic Lab game hub
- `/prints.html` and `/prints/` — preserved 3D print gallery and files
- `/unhinged/` — preserved noindex legacy route

`site/config.mjs` contains the verified company and support inboxes used by
the generated pages. No personal address or phone number is published.
