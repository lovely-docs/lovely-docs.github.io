## Built-in Features
SvelteKit provides code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, and link preloading.

## Diagnosing
Use PageSpeed Insights, WebPageTest, and browser devtools (Lighthouse, Network, Performance tabs). Test in preview mode. Instrument backends with OpenTelemetry or Server-Timing headers.

## Assets
- **Images**: Use `@sveltejs/enhanced-img`, check Lighthouse
- **Videos**: Compress with Handbrake (`.webm`/`.mp4`), lazy-load with `preload="none"`, strip audio with FFmpeg
- **Fonts**: Manually preload in `handle` hook with `resolve` and `preload` filter; subset fonts

## Code Size
- Use latest Svelte version
- Identify large packages with `rollup-plugin-visualizer`
- Minimize third-party scripts; use server-side analytics or Partytown for web workers
- Use dynamic `import(...)` for conditional code loading

## Navigation
- Use link options for preloading (default on `<body>`)
- Return promises from `load` for non-essential data (streams after navigation)
- Prevent waterfalls: avoid sequential API calls; use server load functions; prefer database joins over multiple queries; check Network tab for resource preloading needs; avoid SPA mode

## Hosting
Place frontend in same data center as backend. Deploy to edge for distributed users. Serve images from CDN. Use HTTP/2+.