# for-all.dev

The Forall R&D website — parchment, rubrication, wyrms, and a castle wall.
React + TypeScript on Vite, run with [bun](https://bun.sh).

## Develop

```sh
bun install
bun dev          # dev server with HMR at http://localhost:5173
```

No more `python -m http.server` — Vite serves everything, including the
markdown content, which is bundled at build time.

## Build & check

```sh
bun run build    # tsc -b && vite build → dist/
bun run preview  # serve the production build locally
bun run lint     # eslint
```

## Content

Posts and pages are markdown with YAML frontmatter:

- `src/content/posts/YYYY-MM-DD-slug.md` — served at `/p/slug`
- `src/content/pages/*.md` — sections of the home page

They're rendered by our own small renderer (`src/lib/markdown.tsx`) — not
CommonMark, just the shapes our content uses, plus the signature moves:
`>` quotes become parchment scrolls, headings get cheese-shield anchors,
ordered lists enumerate as proof premises, footnotes (`[^id]`) collect into
an old-book endnote block, fenced code is an incantation.

The recurring SVG primitives (shield of swiss cheese, wax seal, wyrm rule,
scroll rolls) live in `src/components/`.

## Deploy

Static output in `dist/`, served by nginx on the server (config in
`operations/nginx-website.conf`, root `/home/quinn/website/dist`). Build and
sync `dist/` to the server.
