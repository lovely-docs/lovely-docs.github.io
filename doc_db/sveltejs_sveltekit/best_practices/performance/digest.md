## Built-in Performance Features

SvelteKit automatically provides:
- Code-splitting (load only code for current page)
- Asset preloading (prevent waterfalls)
- File hashing (cache assets forever)
- Request coalescing (group separate server load functions into single HTTP request)
- Parallel loading (universal load functions fetch simultaneously)
- Data inlining (replay fetch requests made during server rendering without new request)
- Conservative invalidation (re-run load functions only when necessary)
- Prerendering (serve pages without dynamic data instantly)
- Link preloading (eagerly anticipate data/code for client-side navigation)

## Diagnosing Performance Issues

Use Google PageSpeed Insights and WebPageTest for deployed sites. Browser devtools:
- Chrome: Lighthouse, Network, Performance tabs
- Edge: Lighthouse, Network, Performance tabs
- Firefox: Network, Performance tabs
- Safari: Web Inspector performance tools

Test in preview mode after building, not dev mode. Instrument backends with OpenTelemetry or Server-Timing headers to diagnose slow API calls.

## Optimizing Assets

**Images**: Use `@sveltejs/enhanced-img` package. Lighthouse identifies worst offenders.

**Videos**: Compress with Handbrake, convert to `.webm` or `.mp4`. Lazy-load below-fold videos with `preload="none"`. Strip audio from muted videos with FFmpeg.

**Fonts**: SvelteKit doesn't preload fonts by default (may download unused weights). In your `handle` hook, call `resolve` with a `preload` filter to include fonts. Subset fonts to reduce file size.

## Reducing Code Size

**Svelte version**: Use latest Svelte (5 is smaller/faster than 4, which is smaller/faster than 3).

**Packages**: Use `rollup-plugin-visualizer` to identify large packages. Inspect build output with `build: { minify: false }` in Vite config (remember to undo before deploying).

**External scripts**: Minimize third-party scripts. Use server-side analytics (Cloudflare, Netlify, Vercel) instead of JavaScript-based. Run third-party scripts in web worker with Partytown's SvelteKit integration to avoid blocking main thread.

**Selective loading**: Static `import` declarations bundle automatically. Use dynamic `import(...)` to lazy-load code conditionally.

## Navigation

**Preloading**: Speed up client-side navigation with link options (configured by default on `<body>`).

**Non-essential data**: Return promises from `load` functions instead of data itself for slow-loading data. Server load functions will stream data after navigation.

**Preventing waterfalls**: Waterfalls are sequential request chains that kill performance, especially on slow/distant networks.

Browser waterfalls: SvelteKit adds `modulepreload` tags/headers, but check devtools Network tab for additional preloading needs. Web fonts need manual handling. SPA mode causes waterfalls (empty page → fetch JS → render).

Backend waterfalls: Avoid sequential API calls (fetch user → fetch items → fetch item details). Use server load functions to make backend requests from server instead of browser (avoids high-latency round trips). Even server load functions can have waterfalls; prefer single database query with joins over multiple sequential queries.

## Hosting

Place frontend in same data center as backend to minimize latency. For sites without central backend, deploy to edge (many adapters support this, some support per-route configuration). Serve images from CDN. Use HTTP/2 or newer (Vite's code splitting creates many small files that benefit from parallel loading).

## General Resources

Apply Core Web Vitals principles to any web experience.