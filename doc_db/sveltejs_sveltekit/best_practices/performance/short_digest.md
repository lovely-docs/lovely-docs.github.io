## Built-in Optimizations
SvelteKit provides code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, and link preloading.

## Diagnosing Issues
Use PageSpeed Insights, WebPageTest, or browser devtools (Lighthouse, Network, Performance tabs). Test in preview mode, not dev mode.

## Asset Optimization
- **Images**: Use `@sveltejs/enhanced-img`
- **Videos**: Compress to `.webm`/`.mp4`; lazy-load with `preload="none"`; strip audio with FFmpeg
- **Fonts**: Preload via `handle` hook's `resolve` with `preload` filter; subset fonts

## Code Size
- Use latest Svelte version
- Identify large packages with `rollup-plugin-visualizer`
- Replace JS analytics with server-side implementations
- Use dynamic `import(...)` for conditional code loading

## Navigation
- Preload code/data with link options
- Return promises from `load` functions to stream non-essential data
- Avoid waterfalls: use server `load` functions instead of universal ones; use database joins

## Hosting
- Colocate frontend/backend; deploy to edge for distributed users
- Serve images from CDN; use HTTP/2+