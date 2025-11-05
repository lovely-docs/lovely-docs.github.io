## Authentication and Authorization
Sessions are revocable but require DB queries; JWT offer better latency but can't be revoked. Check auth cookies in server hooks and store user info in `locals`. Use framework-specific libraries like Lucia.

## Performance
SvelteKit handles code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, and link preloading.

Diagnose with PageSpeed Insights, WebPageTest, or browser devtools (Lighthouse, Network, Performance tabs). Instrument slow APIs with OpenTelemetry or Server-Timing headers.

Optimize images with `@sveltejs/enhanced-img`, compress videos to `.webm`/`.mp4` with lazy-loading, preload fonts via `resolve` with `preload` filter in `handle` hook. Find large packages with `rollup-plugin-visualizer`. Replace JS analytics with server-side solutions. Use Partytown for third-party scripts. Use dynamic `import(...)` for conditional code.

Preload links (default enabled), return promises from `load` for streaming non-essential data, use server `load` instead of universal to avoid waterfalls. Deploy frontend near backend or use edge deployment, serve images from CDN, use HTTP/2+.

## Icons
Use Iconify for CSS-based icons. Avoid icon libraries with one `.svelte` file per icon as they slow down Vite's dependency optimization.

## Images
Vite auto-processes imported assets with hashing and inlining. `@sveltejs/enhanced-img` generates avif/webp formats, multiple sizes, and intrinsic dimensions:
```svelte
<enhanced:img src="./image.jpg?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px" fetchpriority="high" alt="text" />
```
For dynamic/external images use `@unpic/svelte` or provider-specific libraries. Serve via CDN, provide 2x resolution images, set `fetchpriority="high"` for LCP images.

## Accessibility
Every page needs a unique `<title>` in `<svelte:head>` for screen reader announcements. SvelteKit focuses `<body>` after navigation (or an `autofocus` element if present). Customize with `afterNavigate` hook. Set `lang` attribute on `<html>` in `src/app.html` or dynamically via `handle` hook.

## SEO
SSR enabled by default with minimal performance overhead and automatic trailing slash normalization. Add unique `<title>` and `<meta name="description">` to each page in `<svelte:head>`. Create sitemaps via `src/routes/sitemap.xml/+server.js` endpoint. For AMP support, set `inlineStyleThreshold: Infinity`, disable `csr`, add `amp` to `<html>`, and transform with `@sveltejs/amp` in hooks.