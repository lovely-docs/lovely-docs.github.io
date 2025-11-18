## Authentication
Use Lucia for session-based auth in SvelteKit. Sessions are stored in database and can be immediately revoked; JWTs cannot be revoked but have lower latency. Auth cookies are validated in server hooks and user info stored in `locals`.

## Performance
SvelteKit provides automatic optimizations: code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, and link preloading.

Diagnose with PageSpeed Insights, WebPageTest, or browser devtools (test in preview mode, not dev). Use OpenTelemetry or Server-Timing headers for slow API calls.

**Assets**: Use `@sveltejs/enhanced-img` for images (auto format conversion, responsive sizing, layout shift prevention). Compress videos to `.webm`/`.mp4` with Handbrake; lazy-load with `preload="none"`. Subset fonts and preload via `handle` hook's `resolve` with `preload` filter.

**Code size**: Upgrade Svelte version, use `rollup-plugin-visualizer` to identify large packages, replace JS analytics with server-side implementations, use Partytown for third-party scripts, use dynamic `import()` for conditional code.

**Navigation**: Preload code/data for client-side navigation via link options. Return promises from `load` functions to stream results. Prevent waterfalls by using server `load` functions instead of universal ones, and database joins instead of multiple queries.

**Hosting**: Colocate frontend/backend, deploy to edge for distributed users, serve images from CDN, use HTTP/2+.

## Icons
Use Iconify for CSS-based icons. Avoid Svelte icon libraries with one `.svelte` file per icon as they slow Vite's dependency optimization.

## Images
**Vite built-in**: Automatically processes imported assets, adds hashes, inlines small assets.
```svelte
import logo from '$lib/assets/logo.png';
<img alt="Logo" src={logo} />
```

**@sveltejs/enhanced-img**: Build-time plugin generating optimal formats (avif, webp), multiple sizes, intrinsic dimensions. Install, add `enhancedImages()` before `sveltekit()` in vite.config.js.
```svelte
<enhanced:img src="./image.jpg" alt="text" />
```

With dynamic selection and transforms:
```svelte
import MyImage from './image.jpg?enhanced';
<enhanced:img src={MyImage} alt="text" sizes="min(1280px, 100vw)" />
<enhanced:img src="./image.jpg?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px" />
<enhanced:img src="./image.jpg?blur=15" alt="text" />
```

**CDN-based**: For runtime images not available at build time. Use `@unpic/svelte` or provider-specific libraries.

Best practices: Mix approaches in one project, serve all images via CDN, provide 2x resolution for HiDPI, use `sizes` for large images, set `fetchpriority="high"` for LCP images, prevent layout shift with width/height, provide good alt text.

## Accessibility
SvelteKit injects a live region that reads page titles to announce route changes. Set unique titles with `<svelte:head><title>Page Title</title></svelte:head>`.

Focus management: SvelteKit focuses `<body>` after navigation; customize with `afterNavigate` hook or use `goto` with `keepFocus` option.

Set `lang` attribute on `<html>` element. For multi-language, use server-side `handle` hook to replace `%lang%` placeholder.

## SEO
SSR is enabled by default and should remain on. Core Web Vitals impact rankings; use hybrid rendering and optimize images.

Every page needs unique `<title>` and `<meta name="description">` in `<svelte:head>`. Return SEO data from page `load` functions and use in root layout.

Create dynamic sitemaps via `src/routes/sitemap.xml/+server.js`:
```js
export async function GET() {
	return new Response(
		`<?xml version="1.0" encoding="UTF-8" ?>
		<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
			<!-- url elements -->
		</urlset>`,
		{ headers: { 'Content-Type': 'application/xml' } }
	);
}
```

AMP support: Set `inlineStyleThreshold: Infinity`, disable `csr` in root layout, add `amp` attribute to `<html>`, transform HTML in `src/hooks.server.js` using `@sveltejs/amp`.