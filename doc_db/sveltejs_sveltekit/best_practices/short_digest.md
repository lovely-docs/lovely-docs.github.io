**Auth**: Sessions vs JWT tradeoffs; use Lucia for session-based auth.

**Performance**: Built-in features (code-splitting, preloading, caching, request coalescing, data inlining). Diagnostics with PageSpeed Insights, WebPageTest, browser devtools. Image optimization: `@sveltejs/enhanced-img` with `<enhanced:img src="./image.jpg" alt="text" />`, responsive sizing via `sizes` attribute, custom widths `?w=1280;640;400`. Video: compress to `.webm`/`.mp4`, lazy-load with `preload="none"`. Fonts: manually preload in `handle` hook. Code: use latest Svelte, identify large packages with `rollup-plugin-visualizer`, minimize third-party scripts, use dynamic `import()` for lazy-loading. Navigation: prevent waterfalls via server load functions with DB joins, return promises for slow data. Hosting: co-locate frontend/backend, edge deployment, CDN, HTTP/2+.

**Icons**: Iconify CSS-based (icon-sets.iconify.design); avoid per-icon `.svelte` files.

**Images**: Vite built-in, `@sveltejs/enhanced-img` (auto format/size/EXIF), or CDN dynamic loading. Best practices: 2x originals for HiDPI, `sizes` for large images, `fetchpriority="high"` for LCP, prevent layout shift with `width`/`height`.

**Accessibility**: Page titles announce to screen readers; auto-focus `<body>` (customize with `afterNavigate`); set `lang` attribute on `<html>` (dynamic via server hook).

**SEO**: SSR by default, performance matters, normalize URLs. Manual: unique `<title>`/`<meta name="description">` per page from `load` functions. Sitemaps via `src/routes/sitemap.xml/+server.js`. AMP: inline styles, disable CSR, transform HTML with `@sveltejs/amp`.