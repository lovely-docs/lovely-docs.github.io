## Built-in Optimizations
SvelteKit automatically handles: code-splitting, asset preloading, file hashing for caching, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, and link preloading.

## Diagnosing Performance Issues
Use PageSpeed Insights or WebPageTest for deployed sites. Browser devtools provide Lighthouse, Network, and Performance tabs (Chrome/Edge/Firefox/Safari). Always test in preview mode after building, not in dev mode.

For slow API calls, instrument your backend with OpenTelemetry or Server-Timing headers.

## Optimizing Assets
**Images**: Use `@sveltejs/enhanced-img` package; Lighthouse identifies problematic images.

**Videos**: Compress with Handbrake to `.webm` or `.mp4`; lazy-load with `preload="none"`; strip audio from muted videos with FFmpeg.

**Fonts**: SvelteKit doesn't preload fonts by default. In your `handle` hook, call `resolve` with a `preload` filter to include fonts. Subset fonts to reduce file size.

## Reducing Code Size
- Use latest Svelte version (5 is smaller/faster than 4, which is smaller/faster than 3)
- Use `rollup-plugin-visualizer` to identify large packages; inspect build output with `build: { minify: false }` in Vite config
- Replace JavaScript analytics with server-side implementations (Cloudflare, Netlify, Vercel)
- Use Partytown's SvelteKit integration to run third-party scripts in web workers
- Use dynamic `import(...)` instead of static imports for conditionally-needed code

## Navigation Performance
**Preloading**: Use link options to eagerly preload code and data for client-side navigation (configured by default on `<body>`).

**Non-essential data**: Return promises from `load` functions instead of data to stream results after navigation.

**Preventing waterfalls**: 
- Browser waterfalls: SvelteKit adds `modulepreload` tags/headers; manually preload web fonts
- SPA mode creates extra round trips (empty page → JS → render)
- Backend waterfalls: Use server `load` functions instead of universal ones to avoid sequential API calls from the browser; use database joins instead of multiple queries

## Hosting
- Colocate frontend and backend in same data center
- Deploy to edge for geographically distributed users
- Serve images from CDN
- Use HTTP/2 or newer for parallel file loading