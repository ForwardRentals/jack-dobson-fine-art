const SITE = 'https://jdobsonfineart.com';
const SITE_NAME = 'Jack Dobson Fine Art';
const OG_IMAGE = 'https://jdobsonfineart.com/og-alpenglow.jpg';
const DISALLOW = [];
// Single-page site (sections #prints, #about, #contact on one page).
const PAGES = [
  { path: '/', title: 'Jack Dobson — Artist & Snowboarder | Pemberton, BC', description: 'Limited edition fine art prints by Jack Dobson — snowboarder and artist based in Pemberton, British Columbia. Archival prints of mountain landscapes, powder runs, and the wild beauty of the Coast Mountains.' },
];
// Post-build SEO step (runs in the deploy workflow after `pnpm run build`).
// GitHub Pages serves unknown paths via 404.html with an HTTP 404 status, so
// client-side routes like /about were invisible to Google. This writes a real
// HTML file for every public page (served with 200), each with
// its own title, description and canonical URL, plus sitemap.xml and robots.txt.
// Add new pages to PAGES when you add routes.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const dist = 'dist';
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const today = new Date().toISOString().slice(0, 10);

function render({ path, title, description }) {
  const url = SITE + path;
  const head = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ].join('\n    ');
  return template
    .replace(/<meta name="robots"[^>]*>\s*/i, '')
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<\/head>/i, `  ${head}\n  </head>`);
}

// /about is written as dist/about.html: GitHub Pages serves it at /about with
// a 200, whereas dist/about/index.html would 301 to /about/.
for (const page of PAGES) {
  // Paths ending in "/" (e.g. /blog/, which also has child pages) get a folder index.html.
  const file = page.path.endsWith('/') ? join(dist, page.path, 'index.html') : join(dist, page.path.slice(1) + '.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(page));
}

writeFileSync(join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  PAGES.map(p => `  <url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n${DISALLOW.map(d => `Disallow: ${d}\n`).join('')}\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`SEO: wrote ${PAGES.length} pages, sitemap.xml, robots.txt`);
