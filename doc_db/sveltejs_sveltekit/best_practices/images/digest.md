## Image Optimization Approaches

**Vite's built-in handling**: Automatically processes imported assets, adds hashes for caching, and inlines small assets.
```svelte
import logo from '$lib/assets/logo.png';
<img alt="The project logo" src={logo} />
```

**@sveltejs/enhanced-img**: Build-time plugin that generates optimal formats (avif, webp), creates multiple sizes, sets intrinsic dimensions to prevent layout shift, and strips EXIF data. Only works with local files at build time.

Setup: Install `@sveltejs/enhanced-img`, add `enhancedImages()` plugin before `sveltekit()` in vite.config.js.

Basic usage with static paths:
```svelte
<enhanced:img src="./path/to/your/image.jpg" alt="An alt text" />
```

Dynamic image selection with manual imports:
```svelte
import MyImage from './path/to/your/image.jpg?enhanced';
<enhanced:img src={MyImage} alt="some alt text" />
```

Or with glob imports:
```svelte
const imageModules = import.meta.glob('/path/to/assets/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}', {
  eager: true,
  query: { enhanced: true }
})
{#each Object.entries(imageModules) as [_path, module]}
  <enhanced:img src={module.default} alt="some alt text" />
{/each}
```

Width and height are automatically inferred and added to prevent layout shift. Use CSS to override dimensions if needed.

For large images, specify `sizes` to request smaller versions on smaller devices:
```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)"/>
```

Custom widths with `w` query parameter:
```svelte
<enhanced:img src="./image.png?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px" />
```

Per-image transforms via query string:
```svelte
<enhanced:img src="./path/to/your/image.jpg?blur=15" alt="An alt text" />
```

**CDN-based optimization**: For images not accessible at build time (CMS, database, backend). CDNs serve appropriate formats based on User-Agent header. Libraries like `@unpic/svelte` provide CDN-agnostic support, or use provider-specific libraries (Cloudinary, Contentful, Storyblok, Contentstack).

## Best Practices

- Mix approaches in one project (Vite for meta tags, enhanced-img for homepage, CDN for user content)
- Serve all images via CDN to reduce latency
- Provide images at 2x resolution for HiDPI displays; processing can downscale but not upscale
- Use `sizes` for images much larger than mobile width (~400px) like hero images
- Set `fetchpriority="high"` and avoid `loading="lazy"` for LCP images
- Constrain images with container/styling and use width/height to prevent layout shift
- Always provide good `alt` text
- Don't use `em` or `rem` in `sizes` declarations as they're relative to user's default font-size, not CSS-modified values