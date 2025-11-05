## Built-in optimizations

SvelteKit automatically handles: code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, and link preloading.

## Diagnosing performance issues

Use PageSpeed Insights or WebPageTest for deployed sites. Browser devtools provide Lighthouse, Network, and Performance tabs. Always test in preview mode after building, not in dev mode.

For slow API calls, instrument your backend with OpenTelemetry or Server-Timing headers.

## Optimizing assets

**Images**: Use `@sveltejs/enhanced-img` package. Lighthouse identifies problematic images.

**Videos**: Compress with Handbrake to `.webm` or `.mp4`. Lazy-load below-the-fold videos with `preload="none"`. Strip audio from muted videos with FFmpeg.

**Fonts**: SvelteKit doesn't preload fonts by default to avoid downloading unused variants. In your `handle` hook, call `resolve` with a `preload` filter to include fonts. Subset fonts to reduce file size.

## Reducing code size

- Use latest Svelte version (Svelte 5 is smaller/faster than 4, which is smaller/faster than 3)
- Use `rollup-plugin-visualizer` to identify large packages
- Replace JavaScript analytics with server-side implementations (Cloudflare, Netlify, Vercel offer SvelteKit adapters)
- Use Partytown's SvelteKit integration to run third-party scripts in web workers
- Use dynamic `import(...)` instead of static imports for conditionally-needed code

## Navigation performance

**Preloading**: Use link options to eagerly preload code and data for client-side navigation (enabled by default).

**Non-essential data**: Return promises from `load` functions instead of data to stream results after navigation.

**Preventing waterfalls**: 
- Browser waterfalls: SvelteKit adds `modulepreload` tags/headers. Manually preload web fonts. SPA mode causes extra round trips.
- Backend waterfalls: Use server `load` functions instead of universal ones to avoid sequential API calls from the browser. Combine database queries with joins instead of multiple sequential queries.

## Hosting

Deploy frontend in same data center as backend. Use edge deployment for sites without central backend. Serve images from CDN. Ensure host supports HTTP/2 or newer for parallel file loading.