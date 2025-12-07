

## Pages

### auth
Authentication/authorization: session IDs vs JWT tradeoffs; check cookies in server hooks and store user data in locals; use Lucia for session-based auth.

## Sessions vs Tokens

After user authentication via credentials, subsequent requests need to maintain authentication state using either:

- **Session IDs**: Stored in database, can be immediately revoked, but require a database query per request
- **JWT (JSON Web Tokens)**: Not checked against datastore, cannot be immediately revoked, better latency and lower datastore load

## Integration Points

Auth cookies can be checked inside server hooks. When a user matches provided credentials, store user information in `locals` via server hooks.

## Implementation

Use Lucia for session-based auth - it provides example code and projects for SvelteKit. Add it with `npx sv create` (new project) or `npx sv add lucia` (existing project).

Auth systems are tightly coupled to web frameworks since most code involves validating user input, handling errors, and routing users appropriately. Generic JS auth libraries often include multiple web frameworks, so SvelteKit-specific guides like Lucia are preferred over multi-framework solutions.

### performance
Performance optimization guide covering SvelteKit's built-in features (code-splitting, preloading, caching, request coalescing, data inlining), diagnostic tools (PageSpeed Insights, WebPageTest, browser devtools), asset optimization (images with enhanced-img, video compression/lazy-loading, font preloading/subsetting), code reduction (latest Svelte, package analysis, third-party script minimization, dynamic imports), navigation optimization (link preloading, promise-based data loading, waterfall prevention via server load functions and database joins), and hosting (co-location, edge deployment, CDN, HTTP/2+).

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

### icons
Two icon approaches: CSS-based via Iconify (supports many sets, integrates with Tailwind/UnoCSS); Svelte libraries (avoid per-icon .svelte files due to Vite optimization issues).

## CSS Icons

Use Iconify to define icons purely via CSS. Iconify supports many popular icon sets available at icon-sets.iconify.design. Icons can be included via CSS and integrated with popular CSS frameworks using the Iconify Tailwind CSS plugin or UnoCSS plugin. This approach doesn't require importing each icon into `.svelte` files.

## Svelte Icons

Many icon libraries exist for Svelte. When choosing an icon library, avoid those that provide one `.svelte` file per icon, as these can have thousands of files that significantly slow down Vite's dependency optimization. This performance issue is especially problematic when icons are imported both via umbrella imports and subpath imports, as documented in the vite-plugin-svelte FAQ.

### images
Image optimization via Vite built-in handling, @sveltejs/enhanced-img plugin (auto format/size/EXIF), or CDN dynamic loading; use `<enhanced:img>` with optional `sizes` and `?w=` query params; provide 2x resolution originals, set fetchpriority/width/height for performance.

## Image Optimization Techniques

Three approaches for optimizing images in SvelteKit projects:

### Vite's Built-in Handling
Automatically processes imported assets with hashing for caching and inlining of small assets:
```svelte
<script>
	import logo from '$lib/assets/logo.png';
</script>
<img alt="The project logo" src={logo} />
```

### @sveltejs/enhanced-img Plugin
Provides automatic image optimization with multiple formats (avif, webp), responsive sizing, intrinsic dimensions, and EXIF stripping. Only works with build-time accessible images.

**Setup:**
```sh
npm i -D @sveltejs/enhanced-img
```
```js
import { enhancedImages } from '@sveltejs/enhanced-img';
export default defineConfig({
	plugins: [enhancedImages(), sveltekit()]
});
```

**Basic usage:**
```svelte
<enhanced:img src="./path/to/your/image.jpg" alt="An alt text" />
```

**Dynamic imports:**
```svelte
<script>
	import MyImage from './path/to/your/image.jpg?enhanced';
</script>
<enhanced:img src={MyImage} alt="some alt text" />
```

**With glob:**
```svelte
<script>
	const imageModules = import.meta.glob(
		'/path/to/assets/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
		{ eager: true, query: { enhanced: true } }
	)
</script>
{#each Object.entries(imageModules) as [_path, module]}
	<enhanced:img src={module.default} alt="some alt text" />
{/each}
```

**Responsive sizing with srcset:**
```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)"/>
```

**Custom widths:**
```svelte
<enhanced:img
  src="./image.png?w=1280;640;400"
  sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
/>
```

**Per-image transforms:**
```svelte
<enhanced:img src="./path/to/your/image.jpg?blur=15" alt="An alt text" />
```

Width and height are automatically inferred and added to prevent layout shift. Use CSS to override dimensions if needed.

### CDN-based Dynamic Loading
For images not accessible at build time (CMS, database, backend). Provides dynamic optimization and flexibility but may have setup overhead and costs. Libraries like `@unpic/svelte` provide CDN-agnostic support; specific CDNs (Cloudinary) and CMS platforms (Contentful, Storyblok, Contentstack) offer Svelte integrations.

## Best Practices

- Mix and match all three solutions in one project as appropriate
- Serve all images via CDN to reduce latency
- Provide original images at 2x display width for HiDPI devices; processing can downscale but not upscale
- For large images (hero images, >400px width), specify `sizes` to serve smaller versions on smaller devices
- For important images (LCP), set `fetchpriority="high"` and avoid `loading="lazy"`
- Constrain images with container/styling and use `width`/`height` to prevent layout shift
- Always provide good `alt` text
- Don't use `em` or `rem` in `sizes` declarations; they're relative to user's default font-size, not CSS-modified values

### accessibility
SvelteKit accessibility: route announcements via page titles, automatic focus management with customization hooks, and language attribute configuration for assistive technology.

## Route announcements

SvelteKit uses client-side routing, so page navigations don't trigger full reloads. To compensate, SvelteKit injects a live region that announces the new page title to screen readers after navigation. Every page must have a unique, descriptive `<title>` in a `<svelte:head>` block:

```svelte
<svelte:head>
	<title>Todo List</title>
</svelte:head>
```

## Focus management

SvelteKit automatically focuses the `<body>` element after navigation and form submission to simulate traditional server-rendered behavior. If an element has the `autofocus` attribute, that element is focused instead.

Customize focus management with the `afterNavigate` hook:

```js
import { afterNavigate } from '$app/navigation';

afterNavigate(() => {
	const to_focus = document.querySelector('.focus-me');
	to_focus?.focus();
});
```

The `goto()` function accepts a `keepFocus` option to preserve the currently-focused element instead of resetting focus. Ensure the focused element still exists after navigation.

## The "lang" attribute

Set the `lang` attribute on the `<html>` element in `src/app.html` to the document's language for correct assistive technology pronunciation:

```html
<html lang="de">
```

For multi-language content, set `lang` dynamically using the server hook:

```html
<!-- src/app.html -->
<html lang="%lang%">
```

```js
// src/hooks.server.js
export function handle({ event, resolve }) {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', get_lang(event))
	});
}
```

SvelteKit provides accessible defaults but you remain responsible for accessible application code. Svelte's compile-time accessibility checks apply to SvelteKit apps.

### seo
SEO techniques for SvelteKit: leverage default SSR and performance, normalize URLs, set page titles/descriptions from load functions, create XML sitemaps via endpoints, optionally support AMP with style inlining and HTML transformation.

## SEO Best Practices for SvelteKit

### Out of the Box Features

**SSR (Server-Side Rendering)**
- SvelteKit uses SSR by default, which is more reliably indexed by search engines than client-side rendering
- Can be disabled in `handle` hook but not recommended unless necessary
- Dynamic rendering is possible if needed but not generally recommended

**Performance**
- Core Web Vitals impact search engine ranking
- Svelte/SvelteKit have minimal overhead, making high-performance sites easier to build
- Test with Google PageSpeed Insights or Lighthouse
- Use hybrid rendering mode and optimize images to improve speed

**Normalized URLs**
- SvelteKit automatically redirects trailing slash variants to maintain canonical URLs (configurable via `trailingSlash` option)

### Manual Setup

**Title and Meta Tags**
- Every page needs unique `<title>` and `<meta name="description">` in `<svelte:head>`
- Common pattern: return SEO data from page `load` functions, use in root layout's `<svelte:head>` via `page.data`

**Sitemaps**
- Create dynamically using an endpoint at `src/routes/sitemap.xml/+server.js`:
```js
export async function GET() {
	return new Response(
		`<?xml version="1.0" encoding="UTF-8" ?>
		<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" ...>
			<!-- <url> elements go here -->
		</urlset>`.trim(),
		{ headers: { 'Content-Type': 'application/xml' } }
	);
}
```

**AMP (Accelerated Mobile Pages)**
- Set `inlineStyleThreshold: Infinity` in `svelte.config.js` to inline all styles (since `<link rel="stylesheet">` isn't allowed in AMP)
- Disable CSR in root layout: `export const csr = false;`
- Add `amp` attribute to `<html>` in `app.html`
- Transform HTML in `src/hooks.server.js`:
```js
import * as amp from '@sveltejs/amp';

export async function handle({ event, resolve }) {
	let buffer = '';
	return await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			buffer += html;
			if (done) return amp.transform(buffer);
		}
	});
}
```
- Optionally use `dropcss` to remove unused CSS after AMP transformation:
```js
import * as amp from '@sveltejs/amp';
import dropcss from 'dropcss';

export async function handle({ event, resolve }) {
	let buffer = '';
	return await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			buffer += html;
			if (done) {
				let css = '';
				const markup = amp.transform(buffer)
					.replace('⚡', 'amp')
					.replace(/<style amp-custom([^>]*?)>([^]+?)<\/style>/, (match, attributes, contents) => {
						css = contents;
						return `<style amp-custom${attributes}></style>`;
					});
				css = dropcss({ css, html: markup }).css;
				return markup.replace('</style>', `${css}</style>`);
			}
		}
	});
}
```
- Validate transformed HTML with `amphtml-validator` in `handle` hook (only for prerendered pages due to performance)

