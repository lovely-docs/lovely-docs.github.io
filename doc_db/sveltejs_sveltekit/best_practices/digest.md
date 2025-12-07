## Authentication
Session IDs vs JWT tradeoffs: sessions stored in database (immediately revokable, requires DB query per request) vs JWT (not revoked, better latency). Check auth cookies in server hooks, store user data in `locals`. Use Lucia for session-based auth via `npx sv add lucia`.

## Performance
Built-in features: code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, link preloading.

Diagnostics: Google PageSpeed Insights, WebPageTest, browser devtools (Chrome/Edge Lighthouse + Network + Performance tabs; Firefox Network + Performance; Safari Web Inspector).

Assets:
- Images: `@sveltejs/enhanced-img` for auto format/size/EXIF stripping. Usage: `<enhanced:img src="./image.jpg" alt="text" />` or with dynamic imports via `?enhanced` query. Responsive sizing: `<enhanced:img src="./image.png" sizes="min(1280px, 100vw)" />`. Custom widths: `src="./image.png?w=1280;640;400"` with matching `sizes` attribute. Per-image transforms: `src="./image.jpg?blur=15"`. Width/height auto-inferred to prevent layout shift.
- Videos: compress with Handbrake to `.webm`/`.mp4`, lazy-load below-fold with `preload="none"`, strip audio from muted videos with FFmpeg.
- Fonts: manually preload in `handle` hook via `resolve` with `preload` filter; subset fonts to reduce size.

Code reduction:
- Use latest Svelte (5 < 4 < 3 in size/speed).
- Identify large packages with `rollup-plugin-visualizer`.
- Minimize third-party scripts; use server-side analytics (Cloudflare, Netlify, Vercel) instead of JS-based. Run third-party scripts in web worker with Partytown's SvelteKit integration.
- Static `import` bundles automatically; use dynamic `import(...)` for conditional lazy-loading.

Navigation:
- Preload links (configured by default on `<body>`).
- Return promises from `load` functions for slow data; server load functions stream after navigation.
- Prevent waterfalls: browser waterfalls need manual web font handling (SvelteKit adds `modulepreload` tags/headers); backend waterfalls avoided by using server load functions for backend requests (avoids high-latency round trips) and preferring single DB query with joins over sequential queries.

Hosting: co-locate frontend with backend, deploy to edge for sites without central backend, serve images from CDN, use HTTP/2+.

## Icons
CSS-based via Iconify (supports many sets at icon-sets.iconify.design, integrates with Tailwind/UnoCSS plugins). Avoid Svelte icon libraries with one `.svelte` file per icon due to Vite optimization slowdown, especially with mixed umbrella and subpath imports.

## Images
Three approaches:

1. Vite built-in: `import logo from '$lib/assets/logo.png'; <img src={logo} />`

2. `@sveltejs/enhanced-img`: auto format/size/EXIF. Setup: `npm i -D @sveltejs/enhanced-img`, add `enhancedImages()` plugin to Vite config. Usage: `<enhanced:img src="./image.jpg" alt="text" />`. Dynamic: `import MyImage from './image.jpg?enhanced'; <enhanced:img src={MyImage} />`. Glob: `import.meta.glob('/path/*.{jpg,png,...}', { eager: true, query: { enhanced: true } })`. Responsive: `<enhanced:img src="./image.png" sizes="min(1280px, 100vw)" />`. Custom widths: `src="./image.png?w=1280;640;400"` with `sizes` attribute. Transforms: `src="./image.jpg?blur=15"`. Width/height auto-inferred.

3. CDN dynamic loading: for runtime images (CMS, database). Libraries like `@unpic/svelte` or platform-specific (Cloudinary, Contentful, Storyblok, Contentstack).

Best practices: mix all three as appropriate; serve via CDN; provide 2x originals for HiDPI; specify `sizes` for large images (>400px); set `fetchpriority="high"` and avoid `loading="lazy"` for LCP images; constrain with CSS and use `width`/`height` to prevent layout shift; provide good `alt` text; don't use `em`/`rem` in `sizes`.

## Accessibility
Route announcements: SvelteKit announces page title to screen readers after navigation via injected live region. Every page needs unique, descriptive `<title>` in `<svelte:head>`.

Focus management: SvelteKit auto-focuses `<body>` after navigation/form submission (or `autofocus` element if present). Customize with `afterNavigate` hook: `import { afterNavigate } from '$app/navigation'; afterNavigate(() => { document.querySelector('.focus-me')?.focus(); })`. `goto()` accepts `keepFocus` option to preserve current focus.

Language: set `lang` attribute on `<html>` in `src/app.html`. For multi-language, set dynamically in server hook: `<html lang="%lang%">` in app.html, then in `src/hooks.server.js`: `export function handle({ event, resolve }) { return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', get_lang(event)) }); }`.

## SEO
Out-of-box: SSR enabled by default (more reliably indexed than CSR), performance impacts ranking, SvelteKit has minimal overhead, auto-redirects trailing slash variants (configurable via `trailingSlash`).

Manual setup:
- Title/meta: every page needs unique `<title>` and `<meta name="description">` in `<svelte:head>`. Pattern: return SEO data from page `load` functions, use in root layout via `page.data`.
- Sitemaps: create dynamically at `src/routes/sitemap.xml/+server.js`: `export async function GET() { return new Response('<?xml version="1.0"?><urlset xmlns="..."><!-- urls --></urlset>', { headers: { 'Content-Type': 'application/xml' } }); }`
- AMP: set `inlineStyleThreshold: Infinity` in `svelte.config.js`, disable CSR in root layout (`export const csr = false;`), add `amp` attribute to `<html>` in app.html, transform HTML in `src/hooks.server.js` using `@sveltejs/amp`. Optionally use `dropcss` to remove unused CSS after transformation. Validate with `amphtml-validator` in `handle` hook (prerendered pages only).