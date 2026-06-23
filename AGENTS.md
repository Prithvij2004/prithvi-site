# AGENTS.md

Minimal instructions for working on this Astro personal site.

## Project

- Astro static site for Prithvi J.
- Deployed on Vercel.
- Keep changes small and focused.

## Commands

- `npm run dev` — start local development server.
- `npm run build` — build the site.
- `npm run preview` — preview the production build.

## Folder structure

- `src/` — main website source code.
  - `src/pages/` — route pages such as home, blog, and projects.
  - `src/components/` — reusable Astro components.
  - `src/layouts/` — shared page layouts.
  - `src/styles/` — global CSS and site styling.
- `public/` — static files copied directly into the built site, like PDFs and scripts.
- `dist/` — generated production build output; do not edit by hand.
- `.astro/` — Astro-generated type and content cache files.
- `.vercel/` — Vercel project metadata.
- `node_modules/` — installed dependencies; do not edit.

## Notes

- Prefer editing files under `src/` and `public/`.
- Run `npm run build` after meaningful site changes.
