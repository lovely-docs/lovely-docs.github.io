## Built-in optimizations

SvelteKit handles code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, and link preloading.

## Diagnosing issues

Test in preview mode (not dev). Use PageSpeed Insights, WebPageTest, or browser devtools (Lighthouse, Network, Performance tabs). Instrument slow APIs with OpenTelemetry or Server-Timing headers.

## Asset optimization

- **Images**: Use `@sveltejs/enhanced-img`
- **Videos**: Compress to `.webm`/`.mp4`, lazy-load with `preload="none"`, strip audio with FFmpeg
- **Fonts**: Preload via `resolve` with `preload` filter in `handle` hook, subset fonts

## Code size

- Use latest Svelte version
- Use `rollup-plugin-visualizer` to find large packages
- Replace JS analytics with server-side (Cloudflare, Netlify, Vercel)
- Use Partytown for third-party scripts in web workers
- Use dynamic `import(...)` for conditional code

## Navigation

- Preload with link options (default enabled)
- Return promises from `load` for streaming non-essential data
- Avoid waterfalls: use server `load` instead of universal, combine DB queries with joins

## Hosting

Deploy frontend near backend or use edge deployment. Serve images from CDN. Use HTTP/2+.