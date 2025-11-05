## Authentication
Sessions are revocable but require DB queries; JWT offer better latency but can't be revoked. Check auth cookies in server hooks, store user info in `locals`, use Lucia.

## Performance
SvelteKit handles code-splitting, preloading, hashing, and prerendering. Optimize images with `@sveltejs/enhanced-img`, compress videos, preload fonts. Use `rollup-plugin-visualizer` to find large packages. Return promises from `load` for streaming, use server `load` to avoid waterfalls. Deploy near backend, serve images from CDN.

## Icons & Images
Use Iconify for CSS icons. Avoid per-icon `.svelte` files. Use `@sveltejs/enhanced-img` for responsive images with multiple formats:
```svelte
<enhanced:img src="./image.jpg?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px" fetchpriority="high" alt="text" />
```

## Accessibility
Add unique `<title>` in `<svelte:head>` for screen readers. SvelteKit focuses `<body>` after navigation. Set `lang` on `<html>`.

## SEO
SSR enabled by default. Add unique `<title>` and `<meta name="description">` per page. Create sitemaps via `src/routes/sitemap.xml/+server.js`.