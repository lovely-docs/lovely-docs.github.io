

## Pages

### authentication-and-authorization
Authentication and authorization strategies in SvelteKit: comparing sessions vs tokens, integration via server hooks, and using framework-specific libraries.

**Sessions vs JWT**: Sessions are revocable but require DB queries; JWT offer better latency but can't be revoked.

**SvelteKit Integration**: Check auth cookies in server hooks, store user info in `locals`.

**Use framework-specific libraries** like Lucia for auth implementation.

### performance
Practical performance optimization techniques for SvelteKit apps: diagnosing issues, optimizing assets, reducing code size, improving navigation, and hosting considerations.

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

### icons
Best practices for using icons in SvelteKit: prefer CSS-based approaches with Iconify, and avoid Svelte component libraries with per-icon files due to Vite optimization issues.

**CSS**: Use Iconify for CSS-based icons with support for many icon sets and CSS framework plugins.

**Svelte**: Avoid icon libraries with one `.svelte` file per icon as they slow down Vite's dependency optimization, especially with mixed import styles.

### images
Three approaches to image optimization: Vite's built-in asset handling, @sveltejs/enhanced-img for build-time optimization with multiple formats and sizes, and CDN-based solutions for dynamic images.

## Image Optimization

**Vite built-in**: Auto-processes imported assets with hashing and inlining.

**@sveltejs/enhanced-img**: Build-time plugin generating avif/webp formats, multiple sizes, and intrinsic dimensions.
```svelte
<enhanced:img src="./image.jpg" alt="text" />
```

Dynamic imports:
```svelte
<script>
	import MyImage from './image.jpg?enhanced';
</script>
<enhanced:img src={MyImage} alt="text" />
```

Responsive sizing:
```svelte
<enhanced:img src="./image.png?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"/>
```

Per-image transforms:
```svelte
<enhanced:img src="./image.jpg?blur=15" alt="text" />
```

**CDN approach**: For dynamic/external images using `@unpic/svelte` or provider-specific libraries.

**Best practices**: Mix approaches as needed, serve via CDN, provide 2x resolution images, use `sizes` for large images, set `fetchpriority="high"` for LCP images, avoid `em`/`rem` in `sizes`.

### accessibility
SvelteKit provides built-in accessibility features: route announcements via live regions, focus management after navigation, and language attribute configuration.

## Route announcements
Every page needs a unique `<title>` in `<svelte:head>` so screen readers announce page changes during client-side navigation.

## Focus management
SvelteKit focuses `<body>` after navigation (or an `autofocus` element if present). Customize with `afterNavigate` hook. The `goto` function has a `keepFocus` option to preserve focus.

## Language attribute
Set `lang` attribute on `<html>` in `src/app.html`. Use the `handle` hook to set it dynamically for multi-language apps.

### seo
Technical SEO best practices for SvelteKit: leverage built-in SSR and performance, set page metadata, create sitemaps, and optionally support AMP.

**Out of box**: SSR enabled by default (better indexing), minimal performance overhead, automatic trailing slash normalization.

**Manual setup**: Add unique `<title>` and `<meta name="description">` to each page in `<svelte:head>`. Create sitemaps via `src/routes/sitemap.xml/+server.js` endpoint. For AMP support, set `inlineStyleThreshold: Infinity`, disable `csr`, add `amp` to `<html>`, and transform with `@sveltejs/amp` in hooks.

