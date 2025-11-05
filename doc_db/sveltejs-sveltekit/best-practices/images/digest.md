## Image Optimization Approaches

**Vite's built-in handling**: Automatically processes imported assets, adds hashes for caching, and inlines small assets.
```svelte
<script>
	import logo from '$lib/assets/logo.png';
</script>
<img alt="The project logo" src={logo} />
```

**@sveltejs/enhanced-img**: Build-time plugin that generates optimal formats (avif, webp), creates multiple sizes, sets intrinsic dimensions to prevent layout shift, and strips EXIF data. Only works with local files during build.

Setup:
```js
import { enhancedImages } from '@sveltejs/enhanced-img';
export default defineConfig({
	plugins: [enhancedImages(), sveltekit()]
});
```

Usage with static imports:
```svelte
<enhanced:img src="./path/to/your/image.jpg" alt="An alt text" />
```

Dynamic imports with query parameter:
```svelte
<script>
	import MyImage from './path/to/your/image.jpg?enhanced';
</script>
<enhanced:img src={MyImage} alt="some alt text" />
```

Or with glob:
```svelte
<script>
	const imageModules = import.meta.glob('/path/to/assets/*.{jpg,png}', {
		eager: true,
		query: { enhanced: true }
	})
</script>
{#each Object.entries(imageModules) as [_path, module]}
	<enhanced:img src={module.default} alt="some alt text" />
{/each}
```

**Responsive sizing**: Use `sizes` attribute for large images to serve smaller versions on smaller devices:
```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)"/>
```

Custom widths with `w` query parameter:
```svelte
<enhanced:img src="./image.png?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"/>
```

**Per-image transforms**: Apply transforms via query string:
```svelte
<enhanced:img src="./path/to/your/image.jpg?blur=15" alt="An alt text" />
```

**CDN approach**: For images not available at build time (CMS, database, backend). Use CDN-agnostic libraries like `@unpic/svelte` or provider-specific solutions (Cloudinary, Contentful, Storyblok, Contentstack).

## Best Practices

- Mix approaches in one project as needed
- Serve all images via CDN to reduce latency
- Provide images at 2x resolution for HiDPI displays
- Use `sizes` for images larger than ~400px width
- Set `fetchpriority="high"` and avoid `loading="lazy"` for LCP images
- Constrain images with container/styling to prevent layout shift
- Always provide `alt` text
- Don't use `em` or `rem` in `sizes` attribute; use absolute units