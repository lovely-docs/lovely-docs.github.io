## Authentication
Use Lucia for session-based auth. Sessions are revocable but require DB queries; JWTs have lower latency but cannot be revoked. Validate auth cookies in server hooks, store user info in `locals`.

## Performance
SvelteKit auto-optimizes: code-splitting, preloading, hashing, coalescing, parallel loading, inlining, invalidation, prerendering. Use `@sveltejs/enhanced-img` for images with auto format conversion and responsive sizing. Compress videos with Handbrake, subset fonts. Upgrade Svelte version, use dynamic `import()` for conditional code. Use server `load` functions and DB joins to prevent waterfalls. Colocate frontend/backend, deploy to edge, use CDN for images.

## Icons & Images
Use Iconify for CSS icons. Avoid Svelte icon libraries with one file per icon. For images: use Vite's built-in handling, `@sveltejs/enhanced-img` for build-time optimization, or CDN for runtime images. Provide 2x resolution for HiDPI, use `sizes` for large images, set `fetchpriority="high"` for LCP images.

## Accessibility
SvelteKit announces route changes via page titles in live region. Customize focus management with `afterNavigate` hook. Set `lang` attribute on `<html>` element.

## SEO
Keep SSR enabled. Set unique `<title>` and `<meta name="description">` per page. Create dynamic sitemaps via `src/routes/sitemap.xml/+server.js`. Optional AMP support via `@sveltejs/amp`.