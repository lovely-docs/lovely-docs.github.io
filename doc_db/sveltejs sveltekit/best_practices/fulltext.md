

## Pages

### auth
Guide to implementing authentication and authorization in SvelteKit using sessions or tokens, with recommendations for session-based approaches using Lucia.

**Sessions vs Tokens**: Session IDs require DB queries but can be revoked immediately; JWTs offer better latency but cannot be revoked.

**SvelteKit Integration**: Check auth cookies in server hooks, store user info in `locals`.

**Recommended**: Use Lucia for session-based auth with `npx sv add lucia`.

### performance
Practical performance optimization techniques for SvelteKit apps: diagnosing issues, optimizing assets, reducing code size, improving navigation, and hosting considerations.

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

### icons
Best practices for including icons in SvelteKit: use CSS-based Iconify or choose Svelte icon libraries that don't create individual .svelte files per icon to avoid Vite optimization problems.

**CSS approach**: Use Iconify for CSS-based icons with Tailwind or UnoCSS plugins.

**Svelte approach**: Avoid icon libraries with one `.svelte` file per icon due to Vite pre-bundling performance issues.

### images
Optimize images using Vite's built-in handling, the @sveltejs/enhanced-img build plugin for automatic format conversion and responsive sizing, or CDN-based solutions for runtime images.

## Image Optimization

**Vite built-in**: Auto-processes imported assets with hashing and inlining.
```svelte
import logo from '$lib/assets/logo.png';
<img src={logo} />
```

**@sveltejs/enhanced-img**: Build-time plugin generating avif/webp, multiple sizes, intrinsic dimensions. Install and add to vite.config.js before sveltekit plugin.
```svelte
<enhanced:img src="./image.jpg" alt="text" />
```

Dynamic imports:
```svelte
import MyImage from './image.jpg?enhanced';
<enhanced:img src={MyImage} alt="text" />
```

Specify `sizes` for responsive images:
```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)" />
```

Custom widths:
```svelte
<enhanced:img src="./image.png?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px" />
```

Per-image transforms:
```svelte
<enhanced:img src="./image.jpg?blur=15" alt="text" />
```

**CDN approach**: For runtime images from CMS/database. Use `@unpic/svelte` or provider-specific libraries.

**Best practices**: Mix approaches per project, serve via CDN, provide 2x resolution images, use `sizes` for large images, set `fetchpriority="high"` for LCP images, always provide `alt` text, avoid `em`/`rem` in `sizes`.

### accessibility
Built-in accessibility features in SvelteKit: route announcements via page titles, focus management after navigation, and language attribute configuration.

## Route announcements
Set unique page titles in `<svelte:head>` so screen readers announce page changes during client-side navigation.

## Focus management
SvelteKit focuses `<body>` after navigation (or an `autofocus` element if present). Customize with `afterNavigate` hook or use `goto` with `keepFocus` option.

## Lang attribute
Set `lang` attribute on `<html>` in `src/app.html`. For multi-language apps, use the server handle hook to replace `%lang%` placeholder based on current page language.

### seo
Technical SEO best practices for SvelteKit: leverage built-in SSR and performance, set page titles/descriptions, create sitemaps, and optionally support AMP.

**Out of box**: SSR enabled by default (better indexing), minimal performance overhead, automatic URL normalization.

**Manual setup**: Add unique `<title>` and `<meta name="description">` to each page. Create sitemaps via endpoint. For AMP support, set `inlineStyleThreshold: Infinity`, disable CSR, add `amp` to HTML, and transform with `@sveltejs/amp` in hooks.

