# for-all.dev website

Simple, single-page static site with markdown-editable content.

## Setup

```bash
npm install
```

## Development

Edit markdown files in `content/`:
- `content/hero.md` - Hero section with summary
- `content/previous-work.md` - Projects, papers, customers
- `content/contact.md` - Contact information

### Build once

```bash
npm run build
```

Output: `dist/index.html`

### Watch mode (auto-rebuild on changes)

```bash
npm run watch
```

Then serve locally:
```bash
python3 -m http.server -d dist 8080
```

Visit http://localhost:8080

## Structure

```
content/          # Markdown content files (edit these!)
static/
  template.html   # HTML template with placeholders
  style.css       # Plain CSS styling
  img/           # Static images
build.js         # Build script (converts MD to HTML)
watch.js         # Auto-rebuild on file changes
dist/            # Build output (generated, not committed)
```

## Deployment

Deploy the `dist/` directory to your static hosting service.
