import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { marked } from 'marked';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read markdown content files
const heroMd = readFileSync('content/hero.md', 'utf-8');
const previousWorkMd = readFileSync('content/previous-work.md', 'utf-8');
const contactMd = readFileSync('content/contact.md', 'utf-8');

// Convert markdown to HTML
const heroHtml = marked.parse(heroMd);
const previousWorkHtml = marked.parse(previousWorkMd);
const contactHtml = marked.parse(contactMd);

// Read HTML template
const template = readFileSync('static/template.html', 'utf-8');

// Replace placeholders with rendered content
const finalHtml = template
    .replace('{{HERO_CONTENT}}', heroHtml)
    .replace('{{PREVIOUS_WORK_CONTENT}}', previousWorkHtml)
    .replace('{{CONTACT_CONTENT}}', contactHtml);

// Create dist directory if it doesn't exist
mkdirSync('dist', { recursive: true });

// Write final HTML to dist
writeFileSync('dist/index.html', finalHtml);

// Copy static assets
import { cpSync } from 'fs';
cpSync('static/style.css', 'dist/style.css');

// Copy img directory if it exists
try {
    cpSync('static/img', 'dist/img', { recursive: true });
    console.log('✓ Build complete! Output: dist/index.html');
    console.log('✓ Copied style.css and img/');
} catch (err) {
    if (err.code === 'ENOENT') {
        console.log('✓ Build complete! Output: dist/index.html');
        console.log('✓ Copied style.css');
        console.log('  (No img/ directory to copy)');
    } else {
        throw err;
    }
}
